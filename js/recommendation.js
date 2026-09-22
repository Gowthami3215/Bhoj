// Core Engine for Smart Recipe Recommendations
// Reads from BhojData (recipes) and uses BhojInventory logic for dates.

window.BhojRecommendation = (function() {

    // --- PHASE 6 SHARED PARSING UTILS ---
    function formatQuantity(val) {
        if (val === 0) return "0";
        if (Math.abs(val - 0.25) < 0.01) return "0.25";
        if (Math.abs(val - 0.5) < 0.01) return "0.5";
        if (Math.abs(val - 0.75) < 0.01) return "0.75";
        if (Math.abs(val - 0.33) < 0.02) return "0.33";
        if (Math.abs(val - 0.66) < 0.02) return "0.66";
        let rounded = Math.round(val * 10) / 10;
        return rounded.toString();
    }

    function parsePantryQuantity(str) {
        if (!str) return { val: 0, unit: '' };
        const match = str.toString().match(/^([\d\.]+)\s*(.*)$/);
        if (match) {
            return { val: parseFloat(match[1]), unit: match[2].toLowerCase().trim() };
        }
        return { val: 0, unit: str.toLowerCase().trim() };
    }

    function normalizeUnit(unit) {
        const u = unit.toLowerCase().trim();
        if (u === 'grams' || u === 'g') return 'g';
        if (u === 'kilograms' || u === 'kg') return 'kg';
        if (u === 'milliliters' || u === 'ml') return 'ml';
        if (u === 'liters' || u === 'l') return 'l';
        if (u === 'pieces' || u === 'piece' || u === 'pcs' || u === 'pc') return 'piece';
        if (u === 'cups' || u === 'cup') return 'cup';
        if (u === 'tablespoons' || u === 'tbsp' || u === 'tablespoon') return 'tbsp';
        if (u === 'teaspoons' || u === 'tsp' || u === 'teaspoon') return 'tsp';
        return u;
    }

    function compareQuantities(reqVal, reqUnit, pantryStr) {
        const p = parsePantryQuantity(pantryStr);
        const rU = normalizeUnit(reqUnit);
        const pU = normalizeUnit(p.unit);

        let pValNorm = p.val;
        let pUnitNorm = pU;
        
        if (pU === 'kg' && rU === 'g') { pValNorm = p.val * 1000; pUnitNorm = 'g'; }
        else if (pU === 'g' && rU === 'kg') { pValNorm = p.val / 1000; pUnitNorm = 'kg'; }
        else if (pU === 'l' && rU === 'ml') { pValNorm = p.val * 1000; pUnitNorm = 'ml'; }
        else if (pU === 'ml' && rU === 'l') { pValNorm = p.val / 1000; pUnitNorm = 'l'; }
        
        if (pUnitNorm === rU || (!pUnitNorm && rU === 'piece')) {
            if (pValNorm >= reqVal) {
                return { status: 'available', text: `Available: ${pantryStr}` };
            } else {
                let diff = formatQuantity(reqVal - pValNorm);
                return { status: 'short', text: `Available: ${pantryStr}<br>Need: ${diff} ${reqUnit} more` };
            }
        } else {
            return { status: 'unknown', text: `Available: ${pantryStr}` };
        }
    }


    // --- PHASE 7 ALIASING & SEARCH ---
    function normalizeIngredientName(name) {
        if (!name) return "";
        let lower = name.toLowerCase().trim();
        
        lower = lower.replace(/\s*\(.*\)/g, '');
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
            'biscuit': ['marie biscuit', 'digestive biscuit', 'cookie', 'cookies'],
            'paneer': ['cottage cheese'],
            'tomato': ['cherry tomato'],
            'potato': ['aloo'],
            'onion': ['red onion', 'white onion'],
            'egg': ['eggs'],
            'bread': ['bread slices', 'sandwich bread', 'bun']
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
        return [norm, ...getIngredientAliases(norm)];
    }


    // --- PHASE 7 ADVANCED SCORING ---
    function calculateAdvancedRecipeScore(recipe, pantry, searchQuery = "") {
        let score = 0;
        const matchData = {
            totalRequired: recipe.ingredients.length,
            availableCount: 0,
            missing: [],
            matched: [],
            expiring: [], // Items expiring in <= 7 days
            short: [],
            percentage: 0,
            hasExpiredRequired: false
        };

        recipe.ingredients.forEach(reqIng => {
            const reqVal = parseFloat(reqIng.quantity) || 0;
            
            // Find match in pantry
            const match = pantry.find(pantryItem => areIngredientsRelated(reqIng.name, pantryItem.name));

            if (match) {
                const daysRem = window.BhojInventory.calculateDaysRemaining(match.expiryDate);
                if (daysRem < 0) {
                    // Item exists but is expired. Treat as missing.
                    matchData.hasExpiredRequired = true;
                    matchData.missing.push(reqIng.name);
                    score -= 10;
                    return;
                }

                // Check Quantity
                let isShort = false;
                if (reqVal > 0 && match.quantity) {
                    const comp = compareQuantities(reqVal, reqIng.unit, match.quantity);
                    if (comp.status === 'short') {
                        isShort = true;
                    }
                }

                if (isShort) {
                    matchData.short.push(reqIng.name);
                    score -= 20; // Heavy penalty if explicitly short
                } else {
                    matchData.availableCount++;
                    matchData.matched.push(reqIng.name);
                    score += 20; // Standard available bonus
                }
                
                // Expiry scoring
                if (daysRem <= 7) {
                    matchData.expiring.push({
                        name: reqIng.name,
                        pantryName: match.name,
                        daysRemaining: daysRem
                    });
                    
                    if (daysRem === 0) score += 25;
                    else if (daysRem <= 1) score += 20;
                    else if (daysRem <= 3) score += 15;
                    else if (daysRem <= 7) score += 8;
                }
            } else {
                matchData.missing.push(reqIng.name);
                score -= 10;
            }
        });

        matchData.percentage = matchData.totalRequired > 0 ? (matchData.availableCount / matchData.totalRequired) : 0;
        
        // Bonus for having most ingredients
        if (matchData.percentage >= 0.7) {
            score += 10;
        }

        // Search relevance
        if (searchQuery) {
            const qNorm = normalizeIngredientName(searchQuery);
            if (normalizeIngredientName(recipe.title).includes(qNorm)) {
                score += 20;
            }
            if (recipe.ingredients.some(ing => areIngredientsRelated(ing.name, qNorm))) {
                score += 30;
            }
        }

        return { score, matchData };
    }


    // --- DATA FETCHERS ---
    
    function getAllScoredRecipes(pantry, searchQuery = "") {
        const recipes = window.BhojData.recipes;
        return recipes.map(recipe => {
            const { score, matchData } = calculateAdvancedRecipeScore(recipe, pantry, searchQuery);
            return { ...recipe, score, matchData };
        });
    }

    function searchRecipes(searchQuery, pantry) {
        const scored = getAllScoredRecipes(pantry, searchQuery);
        
        let results = scored;
        if (searchQuery) {
            const qNorm = normalizeIngredientName(searchQuery);
            results = scored.filter(r => {
                const matchesName = r.title.toLowerCase().includes(qNorm);
                const matchesDesc = r.description.toLowerCase().includes(qNorm);
                const matchesTags = r.tags.some(t => t.toLowerCase().includes(qNorm));
                const matchesIng = r.ingredients.some(ing => areIngredientsRelated(ing.name, qNorm));
                return matchesName || matchesDesc || matchesTags || matchesIng;
            });
        }
        
        return sortRecipes(results, 'recommended');
    }

    function sortRecipes(recipes, sortBy) {
        return recipes.sort((a, b) => {
            if (sortBy === 'recommended') {
                return b.score - a.score;
            } else if (sortBy === 'expiring') {
                const aExp = a.matchData && a.matchData.expiring.length > 0 ? Math.min(...a.matchData.expiring.map(e=>e.daysRemaining)) : 999;
                const bExp = b.matchData && b.matchData.expiring.length > 0 ? Math.min(...b.matchData.expiring.map(e=>e.daysRemaining)) : 999;
                if (aExp !== bExp) return aExp - bExp;
                return b.score - a.score;
            } else if (sortBy === 'pantry') {
                const aPct = a.matchData ? a.matchData.percentage : 0;
                const bPct = b.matchData ? b.matchData.percentage : 0;
                if (aPct !== bPct) return bPct - aPct;
                return b.score - a.score;
            } else if (sortBy === 'quickest') {
                return parseInt(a.time) - parseInt(b.time);
            }
            return b.score - a.score;
        });
    }

    function filterRecipesByCategory(recipes, category) {
        if (!category || category === 'all') return recipes;
        
        return recipes.filter(r => {
            const tags = r.tags.map(t => t.toLowerCase());
            if (category === 'quick') return parseInt(r.time) <= 30;
            if (category === 'vegetarian') return tags.includes('vegetarian');
            if (category === 'breakfast') return tags.includes('breakfast');
            if (category === 'lunch') return tags.includes('lunch') || tags.includes('main course');
            if (category === 'dinner') return tags.includes('dinner') || tags.includes('main course');
            if (category === 'snacks') return tags.includes('snack') || tags.includes('appetizer');
            if (category === 'desserts') return tags.includes('dessert') || tags.includes('sweet');
            if (category === 'drinks') return tags.includes('beverage') || tags.includes('drink') || tags.includes('smoothie');
            return true;
        });
    }

    function getUseSoonRecipes(recipes) {
        // Recipes that have highly urgent expiring items (<= 3 days)
        return recipes.filter(r => r.score > 0 && r.matchData && r.matchData.expiring.some(e => e.daysRemaining <= 3));
    }

    function getBestPantryRecipes(recipes) {
        // Recipes that use a lot of pantry items (percentage >= 50%) and aren't heavily penalized
        return recipes.filter(r => r.score > 0 && r.matchData && r.matchData.percentage >= 0.5);
    }

    function generateRecommendationReason(recipe) {
        if (!recipe.matchData) return "";
        
        const expiring = recipe.matchData.expiring.filter(e => e.daysRemaining <= 3);
        const matched = recipe.matchData.matched;
        
        if (expiring.length > 0) {
            // Sort by most urgent
            expiring.sort((a,b) => a.daysRemaining - b.daysRemaining);
            const urgent = expiring[0];
            const dayStr = urgent.daysRemaining === 1 ? "1 day" : `${urgent.daysRemaining} days`;
            
            let usesStr = "";
            if (matched.length > 1) {
                usesStr = ` and this recipe uses ${matched.length} ingredients from your pantry`;
            }
            
            return `🔥 ${urgent.pantryName} expires in ${dayStr}${usesStr}.`;
        } else if (matched.length > 0) {
            return `✓ Uses ${matched.length} ingredient${matched.length > 1 ? 's' : ''} already available in your pantry.`;
        }
        
        return "";
    }

    function generateRecipeFromPantry(pantryItems, searchTerm) {
        const activePantry = pantryItems.filter(p => window.BhojInventory.calculateDaysRemaining(p.expiryDate) >= 0);
        let mainIng = searchTerm ? searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1) : "Pantry";
        
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
            videoUrl: '',
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
            isGenerated: true
        };

        const { score, matchData } = calculateAdvancedRecipeScore(generatedRecipe, pantryItems, searchTerm);
        generatedRecipe.score = score;
        generatedRecipe.matchData = matchData;

        return generatedRecipe;
    }

    return {
        formatQuantity,
        parsePantryQuantity,
        normalizeUnit,
        compareQuantities,
        normalizeIngredientName,
        getIngredientAliases,
        areIngredientsRelated,
        getRelatedIngredients,
        calculateAdvancedRecipeScore,
        searchRecipes,
        sortRecipes,
        filterRecipesByCategory,
        getUseSoonRecipes,
        getBestPantryRecipes,
        generateRecommendationReason,
        generateRecipeFromPantry
    };
})();
