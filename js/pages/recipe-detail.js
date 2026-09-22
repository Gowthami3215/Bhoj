// Recipe Detail Page View
window.renderRecipeDetail = function (queryParam) {
    const container = document.getElementById('view-recipe-detail');

    // Extract recipe ID from URL
    let recipeId = null;
    if (typeof queryParam === 'string' && queryParam.startsWith('?')) {
        const params = new URLSearchParams(queryParam);
        recipeId = params.get('id');
    } else if (window.location.search.includes('id')) {
        const params = new URLSearchParams(window.location.search);
        recipeId = params.get('id');
    }

    if (!recipeId) {
        container.innerHTML = `
            <div class="container section-padding text-center">
                <h2>Recipe not found.</h2>
                <button class="btn btn-primary mt-4" onclick="window.navigateTo('recipes')">Back to Recipes</button>
            </div>`;
        return;
    }

    const recipe = window.BhojData.recipes.find(r => r.id === recipeId);

    if (!recipe) {
        container.innerHTML = `
            <div class="container section-padding text-center">
                <h2>Recipe not found.</h2>
                <button class="btn btn-primary mt-4" onclick="window.navigateTo('recipes')">Back to Recipes</button>
            </div>`;
        return;
    }

    const pantry = window.BhojInventory ? window.BhojInventory.get() : [];

    // Process ingredients and match with pantry
    let availableCount = 0;
    let missingCount = 0;
    let expiringCount = 0;
    let expiringNames = [];

    const processedIngredients = recipe.ingredients.map(ing => {
        // Find matching item in pantry that is NOT expired (daysRemaining >= 0)
        const pantryItem = pantry.find(p => p.name.toLowerCase() === ing.name.toLowerCase());
        const isAvailable = pantryItem && pantryItem.daysRemaining >= 0;
        const isExpiring = isAvailable && pantryItem.daysRemaining <= 3;

        if (isAvailable) {
            availableCount++;
            if (isExpiring) {
                expiringCount++;
                expiringNames.push(ing.name);
            }
        } else {
            missingCount++;
        }

        return {
            ...ing,
            isAvailable,
            isExpiring,
            pantryItem
        };
    });

    let ingredientsHtml = '';
    processedIngredients.forEach(ing => {
        let iconHtml = ing.isAvailable
            ? '<span style="color: var(--color-success);"><i class="fa-solid fa-check"></i></span>'
            : '<span style="color: #999;"><i class="fa-regular fa-circle"></i></span>';
        let nameHtml = ing.name;
        let expiryHtml = '';

        if (ing.isExpiring) {
            nameHtml = `<span style="color: var(--color-danger); font-weight: 600;">🔥 ${ing.name}</span>`;
            let daysText = ing.pantryItem.daysRemaining === 0 ? "Expires today" :
                ing.pantryItem.daysRemaining === 1 ? "Expires tomorrow" :
                    `Expires in ${ing.pantryItem.daysRemaining} days`;
            expiryHtml = `<div style="font-size: 0.75rem; color: var(--color-danger); margin-top: 2px;">${daysText}</div>`;
        }

        ingredientsHtml += `
            <li style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <div style="margin-top: 2px;">${iconHtml}</div>
                        <div>
                            <div>${nameHtml}</div>
                            ${expiryHtml}
                        </div>
                    </div>
                    <span style="font-weight: 600; color: var(--color-primary);">${ing.quantity} ${ing.unit}</span>
                </div>
            </li>
        `;
    });

    // Ingredient availability summary
    let pantrySummaryHtml = `
        <div style="background-color: var(--color-bg); padding: 15px; border-radius: var(--radius-sm); margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px; font-size: 0.85rem; color: #666; letter-spacing: 1px;">YOUR PANTRY</h4>
            <div style="display: flex; flex-direction: column; gap: 5px; font-size: 0.9rem;">
                ${availableCount > 0 ? `<div style="color: var(--color-success);"><i class="fa-solid fa-check" style="margin-right: 5px;"></i> ${availableCount} ingredient${availableCount > 1 ? 's' : ''} available</div>` : ''}
                ${missingCount > 0 ? `<div style="color: #999;"><i class="fa-regular fa-circle" style="margin-right: 5px;"></i> ${missingCount} ingredient${missingCount > 1 ? 's' : ''} missing</div>` : ''}
            </div>
            <div style="margin-top: 10px; font-weight: 500; font-size: 0.9rem; color: #444;">
                ${availableCount === 0 ? "You don't currently have the main ingredients for this recipe." :
            missingCount === 0 ? "You already have most of what you need!" :
                "You have some of the ingredients needed."}
            </div>
        </div>
    `;

    let recommendationReason = '';
    
    // Explicitly find matched names from processedIngredients
    const matchedNames = processedIngredients.filter(i => i.isAvailable).map(i => i.name);
    
    if (expiringCount > 0) {
        let msg = expiringCount === 1
            ? `Your ${expiringNames[0]} expires soon and this recipe uses it.`
            : `This recipe helps you use ${expiringCount} ingredients approaching expiry.`;

        recommendationReason = `
        <div style="background-color: var(--color-warning-bg); padding: 20px; border-radius: var(--radius-md); margin-bottom: 30px; border-left: 4px solid var(--color-warning);">
            <h4 style="color: #856404; margin-bottom: 10px;"><i class="fa-solid fa-lightbulb"></i> Why Bhoj Recommended This</h4>
            <p style="margin: 0; color: #856404; font-size: 0.95rem;">
                ${msg}
            </p>
        </div>`;
    } else if (availableCount > 0) {
        // Build "Uses X, Y and Z available in your pantry."
        let matchedStr = "";
        if (matchedNames.length === 1) matchedStr = matchedNames[0];
        else if (matchedNames.length === 2) matchedStr = matchedNames.join(' and ');
        else {
            matchedStr = matchedNames.slice(0, -1).join(', ') + ' and ' + matchedNames[matchedNames.length - 1];
        }
        
        recommendationReason = `
        <div style="background-color: var(--color-success-bg); padding: 20px; border-radius: var(--radius-md); margin-bottom: 30px; border-left: 4px solid var(--color-success);">
            <h4 style="color: #155724; margin-bottom: 10px;"><i class="fa-solid fa-lightbulb"></i> Why Bhoj Recommended This</h4>
            <p style="margin: 0; color: #155724; font-size: 0.95rem;">
                Uses ${matchedStr} available in your pantry.
            </p>
        </div>`;
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
        let videoUrl = recipe.videoUrl;
        if (videoUrl && videoUrl.includes('youtube.com/watch?v=')) {
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
            const ampersandPosition = videoUrl.indexOf('&');
            if(ampersandPosition !== -1) {
                videoUrl = videoUrl.substring(0, ampersandPosition);
            }
        }
        
        const hasVideo = videoUrl && videoUrl !== '' && videoUrl.includes('embed');

        if (hasVideo) {
            return `
                <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 30px; background-color: #000; box-shadow: var(--shadow-md); padding-top: 56.25%;">
                    <iframe src="${videoUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </div>
            `;
        } else {
            return `
                <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: var(--radius-lg); padding: 40px; text-align: center; margin-bottom: 30px; color: #6c757d;">
                    <i class="fa-solid fa-video-slash" style="font-size: 2rem; margin-bottom: 10px; color: #adb5bd;"></i>
                    <p style="margin: 0; font-weight: 500;">Detailed cooking video currently unavailable for this recipe.</p>
                </div>
            `;
        }
    }

    const videoHtml = getRecipeVideo(recipe);

    const isVeg = recipe.tags && recipe.tags.includes("Vegetarian");

    container.innerHTML = `
        <div class="container" style="padding: 40px 20px;">
            <button class="btn btn-outline mb-4" onclick="if(window.history.length > 1) window.history.back(); else window.navigateTo('recipes');" style="padding: 8px 16px;">
                <i class="fa-solid fa-arrow-left" style="margin-right: 5px;"></i> Back to Recipes
            </button>

            <!-- Video Section -->
            ${videoHtml}

            <!-- Desktop Layout -->
            <div style="display: flex; flex-wrap: wrap; gap: 40px;">
                
                <!-- Left: Info & Steps -->
                <div style="flex: 1; min-width: 320px;">
                    <h1 style="margin-bottom: 15px;">${recipe.title}</h1>
                    <p style="font-size: 1.15rem; color: #555; margin-bottom: 25px; line-height: 1.6;">${recipe.description}</p>
                    
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
                            <i class="fa-solid fa-utensils"></i> Serves <span id="serve-badge-count">${recipe.servings || 2}</span>
                        </span>
                    </div>

                    ${recommendationReason}
                    
                    <!-- Mobile view shows ingredients here normally in DOM flow if we used media queries. 
                         With flex-wrap, if screen is small, the Right column wraps below Left column.
                         But we want Steps below Ingredients. So we put Steps outside this container. -->
                </div>

                <!-- Right: Ingredients -->
                <div style="flex: 0 0 350px; min-width: 320px;">
                    <div class="card" style="padding: 30px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
                            <h3 style="margin: 0; font-size: 1.2rem; letter-spacing: 0.5px;">INGREDIENTS</h3>
                            
                            <div style="display: flex; flex-direction: column; align-items: flex-end;">
                                <div style="font-size: 0.75rem; color: #999; margin-bottom: 8px; font-weight: 600; letter-spacing: 1px;">SERVINGS</div>
                                <div style="display: flex; align-items: center; background-color: var(--color-bg); border-radius: var(--radius-pill); padding: 5px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                                    <button id="serve-minus" aria-label="Decrease servings" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: white; cursor: pointer; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; color: var(--color-text);"><i class="fa-solid fa-minus"></i></button>
                                    <span id="serve-count" style="padding: 0 15px; font-weight: 700; min-width: 45px; text-align: center; font-size: 1.1rem; color: var(--color-primary);">${recipe.servings || 2}</span>
                                    <button id="serve-plus" aria-label="Increase servings" style="width: 32px; height: 32px; border-radius: 50%; border: none; background: white; cursor: pointer; box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; color: var(--color-text);"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        
                        ${pantrySummaryHtml}
                        
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${ingredientsHtml}
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Bottom: Full width steps -->
            <div style="margin-top: 50px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                    <h3 style="margin: 0; font-size: 1.4rem; letter-spacing: 0.5px;">HOW TO MAKE IT</h3>
                    <div style="background: var(--color-bg); padding: 8px 16px; border-radius: var(--radius-pill);">
                        <span id="step-progress" style="color: var(--color-primary); font-weight: 600; font-size: 0.95rem;">0 of ${totalSteps} steps completed</span>
                    </div>
                </div>
                <div>
                    ${stepsHtml}
                </div>
            </div>
        </div>
    `;

    // Interactivity for servings
    setTimeout(() => {
        let currentServings = recipe.servings || 2;
        const countSpan = document.getElementById('serve-count');
        const badgeCountSpan = document.getElementById('serve-badge-count');
        const minusBtn = document.getElementById('serve-minus');
        const plusBtn = document.getElementById('serve-plus');

        if (countSpan && minusBtn && plusBtn) {
            minusBtn.addEventListener('click', () => {
                if (currentServings > 1) {
                    currentServings--;
                    countSpan.innerText = currentServings;
                    if (badgeCountSpan) badgeCountSpan.innerText = currentServings;
                }
            });
            plusBtn.addEventListener('click', () => {
                if (currentServings < 20) {
                    currentServings++;
                    countSpan.innerText = currentServings;
                    if (badgeCountSpan) badgeCountSpan.innerText = currentServings;
                }
            });
        }

        // Interactivity for Steps
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
