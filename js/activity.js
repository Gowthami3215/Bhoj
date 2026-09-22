// Activity Tracking Module for Impact Dashboard

window.BhojActivity = (function() {
    
    function getActivityKey() {
        const user = window.BhojAuth ? window.BhojAuth.getCurrentUser() : null;
        if (user) {
            return 'bhoj_activity_' + user.id;
        }
        return 'bhoj_activity_guest';
    }

    function getActivities() {
        const key = getActivityKey();
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    function saveActivities(activities) {
        const key = getActivityKey();
        localStorage.setItem(key, JSON.stringify(activities));
    }

    function trackEvent(type, payload = {}) {
        const user = window.BhojAuth ? window.BhojAuth.getCurrentUser() : null;
        if (!user) return; // Only track for authenticated users

        const activities = getActivities();
        activities.push({
            id: 'evt_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
            type: type,
            timestamp: new Date().toISOString(),
            ...payload
        });
        saveActivities(activities);
    }

    function getImpactStats() {
        const activities = getActivities();
        
        let foodAdded = 0;
        let foodUsed = 0;
        let foodExpired = 0;
        let foodSaved = 0; // marked used before expiry
        let recipesCooked = 0;
        let uniqueIngredients = new Set();
        let weeklyUsage = { 'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0 };
        let mostUsedCounts = {};

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        activities.forEach(evt => {
            const evtDate = new Date(evt.timestamp);

            if (evt.type === 'food_added') {
                foodAdded++;
            }
            else if (evt.type === 'food_used') {
                foodUsed++;
                
                // Was it saved before expiry?
                if (evt.expiryDate) {
                    const expDate = new Date(evt.expiryDate);
                    expDate.setHours(0,0,0,0);
                    const actionDate = new Date(evt.timestamp);
                    actionDate.setHours(0,0,0,0);
                    if (actionDate <= expDate) {
                        foodSaved++;
                    }
                }

                // Add to unique ingredients
                if (evt.itemName) {
                    const norm = window.BhojRecommendation ? window.BhojRecommendation.normalizeIngredientName(evt.itemName) : evt.itemName.toLowerCase();
                    uniqueIngredients.add(norm);
                    
                    mostUsedCounts[norm] = (mostUsedCounts[norm] || 0) + 1;
                }

                // Weekly stats (only if within last 7 days)
                if (evtDate >= oneWeekAgo) {
                    const dayName = evtDate.toLocaleDateString('en-US', { weekday: 'long' });
                    weeklyUsage[dayName]++;
                }
            }
            else if (evt.type === 'food_expired') {
                foodExpired++;
            }
            else if (evt.type === 'recipe_cooked') {
                recipesCooked++;
            }
        });

        // Sort most used ingredients
        const mostUsedArr = Object.keys(mostUsedCounts)
            .map(name => ({ name, count: mostUsedCounts[name] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // top 5

        
        // Monthly trend: Saved vs Expired
        const monthlyTrend = {};
        activities.forEach(evt => {
            const evtDate = new Date(evt.timestamp);
            const monthYear = evtDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            if (!monthlyTrend[monthYear]) {
                monthlyTrend[monthYear] = { saved: 0, expired: 0 };
            }
            
            if (evt.type === 'food_expired') {
                monthlyTrend[monthYear].expired++;
            }
            else if (evt.type === 'food_used' && evt.expiryDate) {
                const expDate = new Date(evt.expiryDate);
                expDate.setHours(0,0,0,0);
                const actionDate = new Date(evt.timestamp);
                actionDate.setHours(0,0,0,0);
                if (actionDate <= expDate) {
                    monthlyTrend[monthYear].saved++;
                }
            }
        });

        const trendArray = Object.keys(monthlyTrend).map(month => ({
            month,
            saved: monthlyTrend[month].saved,
            expired: monthlyTrend[month].expired
        }));

        return {
            hasActivity: activities.length > 0,
            monthlyTrend: trendArray,
            foodAdded,
            foodUsed,
            foodExpired,
            foodSaved,
            recipesCooked,
            uniqueIngredientsCount: uniqueIngredients.size,
            weeklyUsage,
            mostUsedIngredients: mostUsedArr
        };
    }

    return {
        trackEvent,
        getActivities,
        getImpactStats
    };
})();
