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
    let currentSort = 'recommended';
    let searchQuery = searchIngredient || '';

    const updateView = () => {
        const pantry = window.BhojInventory ? window.BhojInventory.get() : [];
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
        let allFiltered = window.BhojRecommendation.searchRecipes(searchQuery, pantry);
        
        if (searchQuery && allFiltered.length === 0) {
            const generated = window.BhojRecommendation.generateRecipeFromPantry(pantry, searchQuery);
            const existing = window.BhojData.recipes.find(r => r.id === generated.id);
            if (!existing) {
                window.BhojData.recipes.push(generated);
            }
            allFiltered = [generated];
        }

        // Filter by Category
        allFiltered = window.BhojRecommendation.filterRecipesByCategory(allFiltered, currentFilter);
        
        // Sort
        allFiltered = window.BhojRecommendation.sortRecipes(allFiltered, currentSort);

        // Splitting into categories
        let useSoonRecipes = [];
        let bestPantryRecipes = [];
        let otherRecipes = [];

        if (!searchQuery && currentFilter === 'all' && currentSort === 'recommended') {
            useSoonRecipes = window.BhojRecommendation.getUseSoonRecipes(allFiltered);
            bestPantryRecipes = window.BhojRecommendation.getBestPantryRecipes(allFiltered).filter(r => !useSoonRecipes.includes(r));
            otherRecipes = allFiltered.filter(r => !useSoonRecipes.includes(r) && !bestPantryRecipes.includes(r));
        } else {
            // If searching or filtering, just show them all in a standard list
            otherRecipes = allFiltered;
        }

        let title = searchQuery ? `Recipes using ${searchQuery}` : 'Recipes From Your Pantry';
        let subtitle = searchQuery 
            ? `Recipes you can make with ${searchQuery} and other pantry items.`
            : 'Cook something delicious with the food you already have.';

        // Categories UI
        const categories = [
            { id: 'all', label: 'All' },
            { id: 'quick', label: '⚡ Quick' },
            { id: 'breakfast', label: '🍳 Breakfast' },
            { id: 'lunch', label: '🍛 Lunch' },
            { id: 'dinner', label: '🍽️ Dinner' },
            { id: 'snacks', label: '🥨 Snacks' },
            { id: 'desserts', label: '🍰 Desserts' },
            { id: 'drinks', label: '🥤 Drinks' },
            { id: 'vegetarian', label: '🥗 Vegetarian' }
        ];

        let filterHtml = categories.map(c => `
            <button class="btn btn-outline ${currentFilter === c.id ? 'active' : ''}" data-filter="${c.id}">${c.label}</button>
        `).join('');

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
                        ${filterHtml}
                    </div>

                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                        <span style="font-weight: 500; color: #666;">Sort By:</span>
                        <select id="recipe-sort" class="form-input" style="width: auto; display: inline-block;">
                            <option value="recommended" ${currentSort === 'recommended' ? 'selected' : ''}>Recommended</option>
                            <option value="expiring" ${currentSort === 'expiring' ? 'selected' : ''}>Expiring Soon</option>
                            <option value="pantry" ${currentSort === 'pantry' ? 'selected' : ''}>Most Pantry Ingredients</option>
                            <option value="quickest" ${currentSort === 'quickest' ? 'selected' : ''}>Quickest</option>
                        </select>
                    </div>
                </div>

                ${allFiltered.length === 0 ? `
                    <div class="text-center" style="padding: 40px; color: #666; background: white; border-radius: 8px;">
                        <h3>We couldn't find a recipe matching your criteria.</h3>
                        <p style="margin-top: 10px;">Try adjusting your search or filters.</p>
                        ${searchQuery ? `<button class="btn btn-primary" style="margin-top: 20px;" onclick="window.navigateTo('recipes')">Explore All Recipes</button>` : ''}
                    </div>
                ` : ''}

                ${useSoonRecipes.length > 0 ? `
                    <div style="margin-bottom: 50px;">
                        <h2 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: var(--color-danger);">
                            <i class="fa-solid fa-fire"></i> Use These Soon
                        </h2>
                        <p style="color: #666; margin-bottom: 20px;">These recipes use ingredients that are approaching expiry.</p>
                        <div class="grid grid-cols-3 gap-3">
                            ${useSoonRecipes.map(r => generateRecipeCard(r, true)).join('')}
                        </div>
                    </div>
                ` : ''}

                ${bestPantryRecipes.length > 0 ? `
                    <div style="margin-bottom: 50px;">
                        <h2 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: var(--color-success);">
                            <i class="fa-solid fa-utensils"></i> Best Recipes From Your Pantry
                        </h2>
                        <p style="color: #666; margin-bottom: 20px;">These recipes use the highest number of ingredients you already have.</p>
                        <div class="grid grid-cols-3 gap-3">
                            ${bestPantryRecipes.map(r => generateRecipeCard(r, true)).join('')}
                        </div>
                    </div>
                ` : ''}

                ${otherRecipes.length > 0 ? `
                    <div>
                        <h2 style="margin-bottom: 15px;">${(useSoonRecipes.length > 0 || bestPantryRecipes.length > 0) ? 'More Options' : 'All Recipes'}</h2>
                        <div class="grid grid-cols-3 gap-3">
                            ${otherRecipes.map(r => generateRecipeCard(r, false)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        attachEventListeners();
    };

    function generateRecipeCard(recipe, isRecommended = false) {
        let recommendationBadge = '';
        let recommendationReasonHtml = '';
        let matchDetails = '';

        if (recipe.isGenerated) {
            recommendationBadge = `<div style="position: absolute; top: 10px; left: 10px; background-color: var(--color-primary); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">✨ Generated Recipe</div>`;
            recommendationReasonHtml = `
                <div style="background-color: var(--color-primary-bg); color: var(--color-primary); padding: 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px; display: flex; gap: 8px; align-items: flex-start;">
                    <i class="fa-solid fa-wand-magic-sparkles" style="margin-top: 2px;"></i>
                    <span>Custom recipe generated for your search!</span>
                </div>
            `;
        } else if (recipe.matchData && (recipe.matchData.matched.length > 0 || recipe.matchData.expiring.length > 0)) {
            
            if (isRecommended) {
                recommendationBadge = `<div style="position: absolute; top: 10px; left: 10px; background-color: var(--color-accent); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">⭐ Recommended</div>`;
            }

            const dynamicReason = window.BhojRecommendation.generateRecommendationReason(recipe);
            
            if (dynamicReason) {
                let isUrgent = dynamicReason.includes('🔥');
                recommendationReasonHtml = `
                    <div style="background-color: ${isUrgent ? 'var(--color-danger-bg)' : 'var(--color-success-bg)'}; color: ${isUrgent ? 'var(--color-danger)' : 'var(--color-success)'}; padding: 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; margin-bottom: 15px; display: flex; gap: 8px; align-items: flex-start;">
                        <span style="flex: 1;">${dynamicReason}</span>
                    </div>
                `;
            }

            matchDetails = `
                <div style="font-size: 0.85rem; margin-bottom: 15px;">
                    <div style="margin-bottom: 5px;"><strong>Uses:</strong> 
                        ${recipe.matchData.matched.length > 0 ? recipe.matchData.matched.map(i => `<span style="color: var(--color-success);">✓ ${i}</span>`).join(', ') : 'None'}
                    </div>
                    ${recipe.matchData.short.length > 0 ? `
                        <div style="margin-bottom: 5px;"><strong>Short on:</strong> 
                            ${recipe.matchData.short.map(i => `<span style="color: var(--color-warning);">⚠ ${i}</span>`).join(', ')}
                        </div>
                    ` : ''}
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
                    
                    ${recommendationReasonHtml}
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

        const sortSelect = document.getElementById('recipe-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                updateView();
            });
        }
    }

    updateView();
};
