// Core Engine for Smart Recipe Recommendations
// Reads from BhojData (recipes) and uses BhojInventory logic for dates.

window.BhojRecommendation = (function() {

    function normalizeIngredientName(name) {
        if (!name) return "";
        let lower = name.toLowerCase().trim();
        
        lower = lower.replace(/\s*\(.*\)/g, ''); // remove anything in parentheses
        lower = lower.replace(/\bslices?\b/g, '').trim();
        lower = lower.replace(/\bchopped\b/g, '').trim();
        lower = lower.replace(/\bcrushed\b/g, '').trim();
        
        if (lower === 'tomatoes') return 'tomato';
        if (lower === 'potatoes') return 'potato';
        if (lower === 'onions') return 'onion';
        if (lower === 'biscuits') return 'biscuit';
        
        if (lower.endsWith('s') && lower.length > 3) {
            lower = lower.slice(0, -1);
        }
        
        return lower;
    }

    function getIngredientAliases(ingredientName) {
        const aliases = {
            'biscuit': ['marie biscuit', 'digestive biscuit', 'cookie'],
            'paneer': ['cottage cheese'],
            'tomato': ['cherry tomato'],
            'potato': ['aloo'],
            'onion': ['red onion', 'white onion'],
            'egg': ['eggs']
        };
        const norm = normalizeIngredientName(ingredientName);
        return aliases[norm] || [];
    }

    function areIngredientsRelated(name1, name2) {
        const norm1 = normalizeIngredientName(name1);
        const norm2 = normalizeIngredientName(name2);
        
        if (norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1)) return true;
        
        const aliases1 = getIngredientAliases(norm1);
        const aliases2 = getIngredientAliases(norm2);
        
        if (aliases1.includes(norm2) || aliases2.includes(norm1)) return true;
        
        return false;
    }

    function getRelatedIngredients(ingredientName) {
        const norm = normalizeIngredientName(ingredientName);
        const related = [norm, ...getIngredientAliases(norm)];
        return related;
    }

    function getMatchingIngredients(recipe, pantry) {
        const result = {
            totalRequired: recipe.ingredients.length,
            available: 0,
            missing: [],
            matched: [],
            expiring: [], // Items expiring in <= 3 days
            percentage: 0
        };

        recipe.ingredients.forEach(reqIng => {
            // Look for match in active pantry (ignore expired items)
            const match = pantry.find(pantryItem => {
                const daysRem = window.BhojInventory.calculateDaysRemaining(pantryItem.expiryDate);
                if (daysRem < 0) return false; // Safety: Never recommend expired food
                
                return areIngredientsRelated(reqIng.name, pantryItem.name);
            });

            if (match) {
                result.available++;
                result.matched.push(reqIng.name);
                
                const daysRem = window.BhojInventory.calculateDaysRemaining(match.expiryDate);
                if (daysRem <= 3) {
                    result.expiring.push({
                        name: reqIng.name,
                        pantryName: match.name,
                        daysRemaining: daysRem
                    });
                }
            } else {
                result.missing.push(reqIng.name);
            }
        });

        result.percentage = result.totalRequired > 0 ? (result.available / result.totalRequired) : 0;
        return result;
    }

    function calculateRecipeScore(recipe, pantry, searchQuery = "") {
        const matchData = getMatchingIngredients(recipe, pantry);
        
        let score = matchData.percentage * 50; // base score (0 to 50 max)
        
        // Exact search query bonus
        if (searchQuery) {
            const qNorm = normalizeIngredientName(searchQuery);
            if (normalizeIngredientName(recipe.title).includes(qNorm)) {
                score += 30;
            }
            if (recipe.ingredients.some(ing => areIngredientsRelated(ing.name, qNorm))) {
                score += 20;
            }
        }
        
        matchData.expiring.forEach(exp => {
            if (exp.daysRemaining === 0) {
                score += 30; // Very high priority
            } else if (exp.daysRemaining === 1) {
                score += 25; // Very high priority
            } else if (exp.daysRemaining <= 3) {
                score += 15; // High priority
            } else if (exp.daysRemaining <= 7) {
                score += 5;  // Medium priority
            }
        });

        score -= (matchData.missing.length * 5); // Missing ingredient penalty

        return {
            score,
            matchData
        };
    }

    function searchRecipesByIngredient(query, pantry) {
        const qNorm = normalizeIngredientName(query);
        const recipes = window.BhojData.recipes;
        
        let results = recipes.filter(r => {
            if (!query) return true;
            
            const matchesName = r.title.toLowerCase().includes(qNorm);
            const matchesDesc = r.description.toLowerCase().includes(qNorm);
            const matchesTags = r.tags.some(t => t.toLowerCase().includes(qNorm));
            const matchesIng = r.ingredients.some(ing => areIngredientsRelated(ing.name, qNorm));
            
            return matchesName || matchesDesc || matchesTags || matchesIng;
        });

        // Score and sort
        const scored = results.map(r => {
            const { score, matchData } = calculateRecipeScore(r, pantry, query);
            return { ...r, score, matchData };
        });

        return scored.sort((a, b) => b.score - a.score);
    }

    function getRecommendedRecipes(pantry) {
        const recipes = window.BhojData.recipes;
        const scoredRecipes = recipes.map(recipe => {
            const { score, matchData } = calculateRecipeScore(recipe, pantry);
            return {
                ...recipe,
                score,
                matchData
            };
        });

        // Filter out recipes with very poor scores or lots of missing items unless pantry is tiny
        const filtered = scoredRecipes.filter(r => r.score > 0 || pantry.length === 0);

        return filtered.sort((a, b) => b.score - a.score);
    }

    function generateRecipeFromPantry(pantryItems, searchTerm) {
        // Fallback recipe generator
        const activePantry = pantryItems.filter(p => window.BhojInventory.calculateDaysRemaining(p.expiryDate) >= 0);
        
        let mainIng = searchTerm ? searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1) : "Pantry";
        
        // Pick a few random items from pantry to "combine"
        const selected = activePantry.slice(0, 3).map(p => p.name);
        if (searchTerm && !selected.some(s => areIngredientsRelated(s, searchTerm))) {
            selected.unshift(mainIng);
        }

        const recipeName = selected.join(' & ') + ' Special';
        
        const generatedRecipe = {
            id: 'generated-' + Date.now(),
            title: recipeName,
            description: `A unique, dynamically generated recipe combining ${mainIng} with your available pantry ingredients.`,
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
            
            // Dynamically find a video from existing recipes that matches the main ingredient
            videoUrl: (() => {
                const searchQ = normalizeIngredientName(mainIng);
                const relatedRecipe = window.BhojData.recipes.find(r => 
                    r.videoUrl && r.videoUrl !== '' && 
                    (r.title.toLowerCase().includes(searchQ) || r.ingredients.some(ing => areIngredientsRelated(ing.name, searchQ)))
                );
                return relatedRecipe ? relatedRecipe.videoUrl : 'https://www.youtube.com/embed/KwyfvJbSj38'; // fallback to a generic cooking video
            })(),
            
            videoTitle: '',
            time: '20',
            difficulty: 'Medium',
            servings: 2,
            tags: ['Generated', 'Quick'],
            ingredients: selected.map(s => ({ name: s, quantity: 1, unit: 'portion' })),
            steps: [
                { title: 'Prepare Ingredients', description: 'Gather and prepare all ingredients according to standard cooking practices.' },
                { title: 'Combine', description: `Mix the ${selected.join(', ')} together.` },
                { title: 'Cook', description: 'Heat a pan and cook the mixture until well done.' },
                { title: 'Serve', description: 'Plate the dish nicely and serve hot.' }
            ],
            isGenerated: true // flag to help UI know
        };

        const { score, matchData } = calculateRecipeScore(generatedRecipe, pantryItems, searchTerm);
        generatedRecipe.score = score;
        generatedRecipe.matchData = matchData;

        return generatedRecipe;
    }

    return {
        normalizeIngredientName,
        getIngredientAliases,
        areIngredientsRelated,
        getRelatedIngredients,
        getMatchingIngredients,
        calculateRecipeScore,
        searchRecipesByIngredient,
        getRecommendedRecipes,
        generateRecipeFromPantry
    };
})();
