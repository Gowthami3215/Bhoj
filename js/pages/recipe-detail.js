// Recipe Detail Page View
window.renderRecipeDetail = function (queryParam) {
    const container = document.getElementById('view-recipe-detail');

    let recipeId = null;
    if (typeof queryParam === 'string' && queryParam.startsWith('?')) {
        const params = new URLSearchParams(queryParam);
        recipeId = params.get('id');
    } else if (window.location.search.includes('id')) {
        const params = new URLSearchParams(window.location.search);
        recipeId = params.get('id');
    }

    if (!recipeId) {
        container.innerHTML = `<div class="container section-padding text-center"><h2>Recipe not found.</h2><button class="btn btn-primary mt-4" onclick="window.navigateTo('recipes')">Back to Recipes</button></div>`;
        return;
    }

    const recipe = window.BhojData.recipes.find(r => r.id === recipeId);

    if (!recipe) {
        container.innerHTML = `<div class="container section-padding text-center"><h2>Recipe not found.</h2><button class="btn btn-primary mt-4" onclick="window.navigateTo('recipes')">Back to Recipes</button></div>`;
        return;
    }

    const pantry = window.BhojInventory ? window.BhojInventory.get() : [];

    function scaleIngredients(ingredients, baseServings, selectedServings) {
        return ingredients.map(ing => {
            const originalQty = parseFloat(ing.quantity);
            let scaledQty = originalQty;
            if (!isNaN(originalQty)) {
                scaledQty = (originalQty * selectedServings) / baseServings;
            }
            return { ...ing, scaledQuantity: scaledQty };
        });
    }

    // Main Update Function
    function renderIngredientsBlock(selectedServings) {
        const baseServings = recipe.servings || 2;
        const scaledIngredients = scaleIngredients(recipe.ingredients, baseServings, selectedServings);
        
        let availableCount = 0;
        let missingCount = 0;
        let expiringCount = 0;
        let expiringNames = [];

        const processedIngredients = scaledIngredients.map(ing => {
            const pantryItem = pantry.find(p => window.BhojRecommendation.areIngredientsRelated(ing.name, p.name));
            
            let status = 'missing'; 
            let comparison = { text: 'Not in pantry' };
            
            if (pantryItem) {
                const isExpired = pantryItem.daysRemaining < 0;
                if (isExpired) {
                    status = 'expired';
                    comparison = { text: '<span style="color:var(--color-danger)">⚠ Expired</span>' };
                } else {
                    if (ing.scaledQuantity > 0 && pantryItem.quantity) {
                        const comp = window.BhojRecommendation.compareQuantities(ing.scaledQuantity, ing.unit, pantryItem.quantity);
                        status = comp.status;
                        comparison = comp;
                    } else {
                        status = 'available';
                        comparison = { text: `Available: ${pantryItem.quantity || 'Yes'}` };
                    }
                    
                    if (status === 'available') availableCount++;
                    else if (status === 'short') missingCount++;
                    
                    if (pantryItem.daysRemaining >= 0 && pantryItem.daysRemaining <= 3) {
                        expiringCount++;
                        expiringNames.push(ing.name);
                    }
                }
            } else {
                missingCount++;
            }

            return { ...ing, status, comparison, pantryItem };
        });

        let ingredientsHtml = '';
        processedIngredients.forEach(ing => {
            let iconHtml = '';
            if (ing.status === 'available') iconHtml = '<span style="color: var(--color-success);"><i class="fa-solid fa-check"></i></span>';
            else if (ing.status === 'expired') iconHtml = '<span style="color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i></span>';
            else if (ing.status === 'short') iconHtml = '<span style="color: var(--color-warning);"><i class="fa-solid fa-triangle-exclamation"></i></span>';
            else iconHtml = '<span style="color: #999;"><i class="fa-regular fa-circle"></i></span>';
            
            let nameHtml = ing.name;
            if (ing.pantryItem && ing.pantryItem.daysRemaining >= 0 && ing.pantryItem.daysRemaining <= 3) {
                nameHtml = `<span style="color: var(--color-danger); font-weight: 600;">🔥 ${ing.name}</span>`;
            }

            ingredientsHtml += `
                <li style="padding: 12px 0; border-bottom: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <div style="margin-top: 2px;">${iconHtml}</div>
                            <div>
                                <div style="font-weight: 500;">${nameHtml}</div>
                                <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">${ing.comparison.text}</div>
                            </div>
                        </div>
                        <span style="font-weight: 600; color: var(--color-primary); text-align: right;">
                            ${isNaN(ing.scaledQuantity) ? ing.quantity : window.BhojRecommendation.formatQuantity(ing.scaledQuantity)} ${ing.unit}
                        </span>
                    </div>
                </li>
            `;
        });

        let pantrySummaryHtml = `
            <div style="background-color: var(--color-bg); padding: 15px; border-radius: var(--radius-sm); margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px; font-size: 0.85rem; color: #666; letter-spacing: 1px;">YOUR PANTRY</h4>
                <div style="display: flex; flex-direction: column; gap: 5px; font-size: 0.9rem;">
                    ${availableCount > 0 ? `<div style="color: var(--color-success);"><i class="fa-solid fa-check" style="margin-right: 5px;"></i> ${availableCount} ingredient${availableCount > 1 ? 's' : ''} available</div>` : ''}
                    ${missingCount > 0 ? `<div style="color: #999;"><i class="fa-regular fa-circle" style="margin-right: 5px;"></i> ${missingCount} ingredient${missingCount > 1 ? 's' : ''} missing or short</div>` : ''}
                </div>
            </div>
        `;

        // Create a fake recipe object to reuse our global recommendation logic
        const fakeRecipe = { ...recipe };
        const scored = window.BhojRecommendation.calculateAdvancedRecipeScore(fakeRecipe, pantry, "");
        fakeRecipe.matchData = scored.matchData;
        const dynamicReason = window.BhojRecommendation.generateRecommendationReason(fakeRecipe);
        
        let recommendationReasonHtml = '';
        if (dynamicReason) {
            let isUrgent = dynamicReason.includes('🔥');
            recommendationReasonHtml = `
            <div style="background-color: ${isUrgent ? 'var(--color-danger-bg)' : 'var(--color-success-bg)'}; color: ${isUrgent ? 'var(--color-danger)' : 'var(--color-success)'}; padding: 20px; border-radius: var(--radius-md); margin-bottom: 30px; border-left: 4px solid ${isUrgent ? 'var(--color-danger)' : 'var(--color-success)'};">
                <h4 style="margin-bottom: 10px;"><i class="fa-solid fa-lightbulb"></i> Why Bhoj Recommended This</h4>
                <p style="margin: 0; font-size: 0.95rem;">${dynamicReason}</p>
            </div>`;
        }

        return { pantrySummaryHtml, ingredientsHtml, recommendationReason: recommendationReasonHtml };
    }

    let stepsHtml = '';
    const totalSteps = recipe.steps.length;
    recipe.steps.forEach((step, index) => {
        let title = typeof step === 'object' && step.title ? step.title : "Step";
        let desc = typeof step === 'object' && step.description ? step.description : step;
        stepsHtml += `
            <div class="step-item" data-step="${index}" style="margin-bottom: 20px; padding: 20px; border-radius: var(--radius-md); border: 1px solid #eee; background: white; cursor: pointer; transition: var(--transition);">
                <div style="display: flex; gap: 20px;">
                    <div class="step-marker" style="flex-shrink: 0; width: 36px; height: 36px; background-color: white; border: 2px solid #ddd; color: #999; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem; transition: var(--transition);">
                        ${index + 1}
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #999; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">
                            ${String(index + 1).padStart(2, '0')}
                        </div>
                        <h4 style="margin-bottom: 10px; font-size: 1.1rem;">${title}</h4>
                        <p style="margin: 0; color: #555; line-height: 1.6;">${desc}</p>
                    </div>
                </div>
            </div>
        `;
    });

    function getRecipeVideo(recipe) {
        return `
            <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: var(--radius-lg); padding: 40px; text-align: center; margin-bottom: 30px; color: #6c757d;">
                <span style="font-size: 3rem; margin-bottom: 10px; display: block;">🎥</span>
                <h3 style="margin-bottom: 10px; color: #333;">Cooking Video Coming Soon</h3>
                <p style="margin: 0; font-weight: 500; font-size: 1rem;">We're working on adding a detailed cooking video<br>for this recipe.</p>
            </div>
        `;
    }

    const videoHtml = getRecipeVideo(recipe);
    const isVeg = recipe.tags && recipe.tags.includes("Vegetarian");
    
    let currentServings = recipe.servings || 2;
    const initBlocks = renderIngredientsBlock(currentServings);

    container.innerHTML = `
        <div class="container" style="padding: 40px 20px;">
            <button class="btn btn-outline mb-4" onclick="if(window.history.length > 1) window.history.back(); else window.navigateTo('recipes');" style="padding: 8px 16px;">
                <i class="fa-solid fa-arrow-left" style="margin-right: 5px;"></i> Back to Recipes
            </button>

            ${videoHtml}

            <div style="display: flex; flex-wrap: wrap; gap: 40px;">
                <div style="flex: 1; min-width: 320px;">
                    <h1 style="margin-bottom: 15px;">${recipe.title}</h1>
                    <p style="font-size: 1.15rem; color: #555; margin-bottom: 25px; line-height: 1.6;">${recipe.description}</p>
                    
                    <div style="margin-bottom: 25px;">
                        <button id="mark-cooked-btn" class="btn btn-primary" style="padding: 10px 20px; font-weight: bold;">
                            <i class="fa-solid fa-fire-burner"></i> Mark Recipe as Cooked
                        </button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 35px;">
                        <span class="badge" style="display:flex; align-items:center; gap:6px; background: #f0f0f0; color: #333; font-size: 0.9rem; padding: 6px 14px;">
                            <i class="fa-regular fa-clock"></i> ${recipe.time} min
                        </span>
                        <span class="badge" style="display:flex; align-items:center; gap:6px; background: #e2f3f1; color: var(--color-success); font-size: 0.9rem; padding: 6px 14px;">
                            <i class="fa-solid fa-chart-simple"></i> ${recipe.difficulty}
                        </span>
                        <span class="badge" style="display:flex; align-items:center; gap:6px; background: ${isVeg ? '#e2f3f1' : '#fbe5df'}; color: ${isVeg ? 'var(--color-success)' : 'var(--color-danger)'}; font-size: 0.9rem; padding: 6px 14px;">
                            ${isVeg ? '<i class="fa-solid fa-leaf"></i> Vegetarian' : '<i class="fa-solid fa-drumstick-bite"></i> Non-Vegetarian'}
                        </span>
                        <span class="badge" style="display:flex; align-items:center; gap:6px; background: #f0f0f0; color: #333; font-size: 0.9rem; padding: 6px 14px;">
                            <i class="fa-solid fa-utensils"></i> Serves <span id="serve-badge-count">${currentServings}</span>
                        </span>
                    </div>

                    <div id="recommendation-reason-container">
                        ${initBlocks.recommendationReason}
                    </div>
                </div>

                <div style="flex: 0 0 350px; min-width: 320px;">
                    <div class="card" style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
                            <h3 style="margin: 0; font-size: 1.2rem; letter-spacing: 0.5px;">INGREDIENTS <br><span style="font-size: 0.8rem; font-weight: normal; color: #666;">for <span id="serve-title-count">${currentServings}</span> people</span></h3>
                            
                            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                                <div style="font-size: 0.75rem; color: #999; margin-bottom: 8px; font-weight: 600; letter-spacing: 1px;">SERVINGS</div>
                                <div style="display: flex; align-items: center; background-color: var(--color-bg); border-radius: var(--radius-pill); padding: 5px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                                    <button id="serve-minus" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-text);"><i class="fa-solid fa-minus"></i></button>
                                    <span id="serve-count" style="padding: 0 15px; font-weight: 700; min-width: 45px; text-align: center; font-size: 1.1rem; color: var(--color-primary);">${currentServings}</span>
                                    <button id="serve-plus" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--color-text);"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="pantry-summary-container">
                            ${initBlocks.pantrySummaryHtml}
                        </div>
                        
                        <ul id="ingredients-list-container" style="list-style: none; padding: 0; margin: 0;">
                            ${initBlocks.ingredientsHtml}
                        </ul>
                    </div>
                </div>
            </div>

            <div style="margin-top: 50px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                    <h3 style="margin: 0; font-size: 1.4rem; letter-spacing: 0.5px;">HOW TO MAKE IT</h3>
                    <div style="background: var(--color-bg); padding: 8px 16px; border-radius: var(--radius-pill);">
                        <span id="step-progress" style="color: var(--color-primary); font-weight: 600; font-size: 0.95rem;">0 of ${totalSteps} steps completed</span>
                    </div>
                </div>
                <div>${stepsHtml}</div>
            </div>
        </div>
    `;

    setTimeout(() => {
        const countSpan = document.getElementById('serve-count');
        const badgeCountSpan = document.getElementById('serve-badge-count');
        const titleCountSpan = document.getElementById('serve-title-count');
        const minusBtn = document.getElementById('serve-minus');
        const plusBtn = document.getElementById('serve-plus');
        
        const summaryCont = document.getElementById('pantry-summary-container');
        const listCont = document.getElementById('ingredients-list-container');
        const recCont = document.getElementById('recommendation-reason-container');

        const markCookedBtn = document.getElementById('mark-cooked-btn');
        if (markCookedBtn) {
            markCookedBtn.addEventListener('click', () => {
                if (window.BhojActivity) {
                    window.BhojActivity.trackEvent('recipe_cooked', { recipeId: recipe.id, recipeName: recipe.title });
                    markCookedBtn.innerHTML = '<i class="fa-solid fa-check"></i> Cooked';
                    markCookedBtn.style.backgroundColor = 'var(--color-success)';
                    markCookedBtn.style.borderColor = 'var(--color-success)';
                    markCookedBtn.disabled = true;
                } else {
                    window.navigateTo('login');
                }
            });
        }
        
        const updateView = () => {
            countSpan.innerText = currentServings;
            if (badgeCountSpan) badgeCountSpan.innerText = currentServings;
            if (titleCountSpan) titleCountSpan.innerText = currentServings;
            
            const blocks = renderIngredientsBlock(currentServings);
            if (summaryCont) summaryCont.innerHTML = blocks.pantrySummaryHtml;
            if (listCont) listCont.innerHTML = blocks.ingredientsHtml;
            if (recCont) recCont.innerHTML = blocks.recommendationReason;
        };

        if (countSpan && minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => {
                if (currentServings > 1) {
                    currentServings--;
                    updateView();
                }
            });
            plusBtn.addEventListener('click', () => {
                if (currentServings < 50) {
                    currentServings++;
                    updateView();
                }
            });
        }

        let completedSteps = 0;
        const progressSpan = document.getElementById('step-progress');
        const stepItems = document.querySelectorAll('.step-item');

        stepItems.forEach(item => {
            item.addEventListener('click', function () {
                const marker = this.querySelector('.step-marker');
                const isCompleted = this.classList.contains('completed');

                if (isCompleted) {
                    this.classList.remove('completed');
                    this.style.backgroundColor = 'white';
                    this.style.borderColor = '#eee';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                    marker.style.backgroundColor = 'white';
                    marker.style.borderColor = '#ddd';
                    marker.style.color = '#999';
                    marker.innerHTML = parseInt(this.getAttribute('data-step')) + 1;
                    completedSteps--;
                } else {
                    this.classList.add('completed');
                    this.style.backgroundColor = 'var(--color-success-bg)';
                    this.style.borderColor = 'var(--color-success)';
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = 'var(--shadow-sm)';
                    marker.style.backgroundColor = 'var(--color-success)';
                    marker.style.borderColor = 'var(--color-success)';
                    marker.style.color = 'white';
                    marker.innerHTML = '<i class="fa-solid fa-check"></i>';
                    completedSteps++;
                }

                if (progressSpan) {
                    progressSpan.innerText = `${completedSteps} of ${totalSteps} steps completed`;
                }
            });
        });
    }, 100);
};
