// Recipes Page View
window.renderRecipes = function(queryParam) {
    const container = document.getElementById('view-recipes');
    
    // Extract query parameters
    let searchIngredient = null;
    if (typeof queryParam === 'string' && queryParam.startsWith('?')) {
        const params = new URLSearchParams(queryParam);
        searchIngredient = params.get('ingredient');
    } else if (window.location.search.includes('ingredient')) {
        const params = new URLSearchParams(window.location.search);
        searchIngredient = params.get('ingredient');
    }

    // State
    let currentFilter = 'all';
    let searchQuery = searchIngredient || ''; // initialize search with param

    const updateView = () => {
        const pantry = window.BhojInventory.get();
        const isEmpty = pantry.length === 0;

        if (isEmpty && !searchQuery) {
            // Empty Pantry State
            container.innerHTML = `
                <div class="container section-padding text-center">
                    <h1 style="margin-bottom: 20px;">Recipes For You</h1>
                    <div class="empty-state" style="padding: 60px 20px; background: white; border-radius: 8px; border: 2px dashed #ddd;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🍽️</div>
                        <h2>Your pantry is empty.</h2>
                        <p style="color: var(--color-text-light); margin-bottom: 30px;">Add food to get personalized recipe recommendations to help reduce waste.</p>
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button class="btn btn-primary" onclick="window.navigateTo('scan')">Scan Food</button>
                        </div>
                    </div>
                    
                    <h3 style="margin-top: 40px; margin-bottom: 20px;">Explore All Recipes</h3>
                    <div class="grid grid-cols-3 gap-3" style="text-align: left;">
                        ${window.BhojData.recipes.map(r => generateRecipeCard(r)).join('')}
                    </div>
                </div>
            `;
            return;
        }

        // Search logic using our new Recommendation engine
        let allFiltered;
        if (searchQuery) {
            allFiltered = window.BhojRecommendation.searchRecipesByIngredient(searchQuery, pantry);
            
            // If absolute 0 found and we have a search term, GENERATE A FALLBACK RECIPE!
            if (allFiltered.length === 0) {
                const generated = window.BhojRecommendation.generateRecipeFromPantry(pantry, searchQuery);
                
                // Temporarily inject it into memory so if clicked, the detail page can find it!
                // Since our SPA reloads the global state, we push it to BhojData.recipes
                const existing = window.BhojData.recipes.find(r => r.id === generated.id);
                if (!existing) {
                    window.BhojData.recipes.push(generated);
                }
                
                allFiltered = [generated];
            }
        } else {
            allFiltered = window.BhojRecommendation.getRecommendedRecipes(pantry);
        }
        
        let filteredRecipes = allFiltered.filter(r => {
            // Category Filter
            if (currentFilter === 'quick' && parseInt(r.time) > 30) return false;
            if (currentFilter === 'easy' && r.difficulty !== 'Easy') return false;
            if (currentFilter === 'veg' && !r.tags.includes('Vegetarian')) return false;
            if (currentFilter === 'expiring' && (!r.matchData || r.matchData.expiring.length === 0)) return false;
            return true;
        });

        // Split into recommended and regular
        const recommended = filteredRecipes.filter(r => r.score > 0 || r.isGenerated);
        const regular = filteredRecipes.filter(r => (!r.score || r.score === 0) && !r.isGenerated);

        let title = searchQuery ? `Recipes using ${searchQuery}` : 'Recipes From Your Pantry';
        let subtitle = searchQuery 
            ? `Recipes you can make with ${searchQuery} and other pantry items.`
            : 'Cook something delicious with the food you already have.';

        container.innerHTML = `
            <div class="container section-padding">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="margin-bottom: 10px;">${title}</h1>
                    <p style="color: var(--color-text-light); max-width: 600px; margin: 0 auto;">
                        ${subtitle}
                    </p>
                </div>

                <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 40px;">
                    <input type="text" id="recipe-search" class="form-input" placeholder="Search recipes or ingredients..." value="${searchQuery}" style="max-width: 500px;">
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                        <button class="btn btn-outline ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                        <button class="btn btn-outline ${currentFilter === 'quick' ? 'active' : ''}" data-filter="quick">Quick (< 30m)</button>
                        <button class="btn btn-outline ${currentFilter === 'easy' ? 'active' : ''}" data-filter="easy">Easy</button>
                        <button class="btn btn-outline ${currentFilter === 'veg' ? 'active' : ''}" data-filter="veg">Vegetarian</button>
                        <button class="btn btn-outline ${currentFilter === 'expiring' ? 'active' : ''}" data-filter="expiring">Uses Expiring Ingredients</button>
                    </div>
                </div>

                ${filteredRecipes.length === 0 ? `
                    <div class="text-center" style="padding: 40px; color: #666; background: white; border-radius: 8px;">
                        <h3>We couldn't find a recipe matching your criteria.</h3>
                        <p style="margin-top: 10px;">Try adjusting your search or filters.</p>
                        ${searchQuery ? `<button class="btn btn-primary" style="margin-top: 20px;" onclick="window.navigateTo('recipes')">Explore All Recipes</button>` : ''}
                    </div>
                ` : ''}

                ${recommended.length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                            <span style="color: var(--color-accent);"><i class="fa-solid fa-fire"></i></span> Recommended For You
                        </h2>
                        <div class="grid grid-cols-3 gap-3">
                            ${recommended.map(r => generateRecipeCard(r, true)).join('')}
                        </div>
                    </div>
                ` : ''}

                ${regular.length > 0 ? `
                    <div>
                        <h2 style="margin-bottom: 15px;">Other Options</h2>
                        <div class="grid grid-cols-3 gap-3">
                            ${regular.map(r => generateRecipeCard(r, false)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        attachEventListeners();
    };

    function generateRecipeCard(recipe, isRecommended = false) {
        let recommendationBadge = '';
        let recommendationReason = '';
        let matchDetails = '';

        if (recipe.isGenerated) {
            recommendationBadge = `<div style="position: absolute; top: 10px; left: 10px; background-color: var(--color-primary); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">✨ Generated Recipe</div>`;
            recommendationReason = `
                <div style="background-color: var(--color-primary-bg); color: var(--color-primary); padding: 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px; display: flex; gap: 8px; align-items: flex-start;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="margin-top: 2px;"></i>
                    <span>Custom recipe generated for your search!</span>
                </div>
            `;
        } else if (isRecommended && recipe.matchData) {
            recommendationBadge = `<div style="position: absolute; top: 10px; left: 10px; background-color: var(--color-accent); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">⭐ Recommended</div>`;
            
            if (recipe.matchData.expiring.length > 0) {
                let text = recipe.matchData.expiring.length === 1 
                    ? `Recommended because ${recipe.matchData.expiring[0].pantryName} expires in ${recipe.matchData.expiring[0].daysRemaining} days` 
                    : `Uses ${recipe.matchData.expiring.length} ingredients approaching expiry`;
                recommendationReason = `
                    <div style="background-color: var(--color-danger-bg); color: var(--color-danger); padding: 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px; display: flex; gap: 8px; align-items: flex-start;">
                        <i class="fa-solid fa-fire" style="margin-top: 2px;"></i>
                        <span>${text}</span>
                    </div>
                `;
            } else if (recipe.matchData.matched.length > 0) {
                recommendationReason = `
                    <div style="background-color: var(--color-success-bg); color: var(--color-success); padding: 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px; display: flex; gap: 8px; align-items: flex-start;">
                        <i class="fa-solid fa-check-circle" style="margin-top: 2px;"></i>
                        <span>Uses ${recipe.matchData.matched.length} ingredients from your pantry</span>
                    </div>
                `;
            }

            matchDetails = `
                <div style="font-size: 0.85rem; margin-bottom: 15px;">
                    <div style="margin-bottom: 5px;"><strong>Uses:</strong> 
                        ${recipe.matchData.matched.length > 0 ? recipe.matchData.matched.map(i => `<span style="color: var(--color-success);">✓ ${i}</span>`).join(', ') : 'None'}
                    </div>
                    ${recipe.matchData.missing.length > 0 ? `
                        <div><strong>Missing:</strong> 
                            ${recipe.matchData.missing.map(i => `<span style="color: #999;">○ ${i}</span>`).join(', ')}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        return `
            <div class="card recipe-card" style="display: flex; flex-direction: column;">
                <div style="position: relative; cursor:pointer;" onclick="window.navigateTo('recipe-detail', '?id=${recipe.id}')">
                    <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%; height: 200px; object-fit: cover;">
                    ${recommendationBadge}
                </div>
                <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.85rem; color: #666;">
                        <span><i class="fa-regular fa-clock"></i> ${recipe.time} min</span>
                        <span style="color: ${recipe.difficulty === 'Easy' ? 'var(--color-success)' : 'var(--color-warning)'}">
                            <i class="fa-solid fa-chart-simple"></i> ${recipe.difficulty}
                        </span>
                    </div>
                    
                    <h3 style="margin-bottom: 10px; cursor:pointer;" onclick="window.navigateTo('recipe-detail', '?id=${recipe.id}')">${recipe.title}</h3>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">${recipe.description}</p>
                    
                    ${recommendationReason}
                    ${matchDetails}
                    
                    <div style="margin-top: auto;">
                        <button class="btn btn-primary" style="width: 100%;" onclick="window.navigateTo('recipe-detail', '?id=${recipe.id}')">
                            View Recipe
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function attachEventListeners() {
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                updateView();
            });
            // Focus cursor at end
            searchInput.focus();
            const val = searchInput.value;
            searchInput.value = '';
            searchInput.value = val;
        }

        const filterBtns = document.querySelectorAll('button[data-filter]');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = e.target.getAttribute('data-filter');
                updateView();
            });
        });
    }

    updateView();
};
