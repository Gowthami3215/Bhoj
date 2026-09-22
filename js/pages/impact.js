// Impact Page View
window.renderImpact = function() {
    if (!window.BhojAuth.requireAuthentication('login')) return;

    const container = document.getElementById('view-impact');
    const stats = window.BhojActivity.getImpactStats();

    if (!stats.hasActivity) {
        container.innerHTML = `
            <div class="container section-padding text-center">
                <div style="width: 80px; height: 80px; background-color: var(--color-success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2.5rem; color: var(--color-success);">
                    <i class="fa-solid fa-earth-americas"></i>
                </div>
                <h1 style="margin-bottom: 10px;">Your Bhoj Impact</h1>
                <p style="color: var(--color-text-light); max-width: 600px; margin: 0 auto 30px; font-size: 1.1rem;">
                    Small actions in your kitchen can help reduce food waste.
                </p>
                <div class="card" style="padding: 60px 20px; max-width: 600px; margin: 0 auto; background: white; border: 2px dashed #ddd;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🌱</div>
                    <h2>Your impact journey starts here.</h2>
                    <p style="color: var(--color-text-light); margin-bottom: 30px;">Add food to your pantry and start using Bhoj to track your progress.</p>
                    <button class="btn btn-primary" onclick="window.navigateTo('scan')">Scan Food to Start</button>
                </div>
            </div>
        `;
        return;
    }

    // Determine max for bar chart
    const maxVal = Math.max(...Object.values(stats.weeklyUsage), 1);
    
    // Most Used Ingredients HTML
    let mostUsedHtml = '';
    if (stats.mostUsedIngredients.length > 0) {
        mostUsedHtml = `
            <div class="card" style="padding: 30px;">
                <h3 style="margin-bottom: 20px;">Most Used Ingredients</h3>
                <ol style="padding-left: 20px; line-height: 1.8;">
                    ${stats.mostUsedIngredients.map(ing => `<li><strong style="text-transform: capitalize;">${ing.name}</strong> (${ing.count} times)</li>`).join('')}
                </ol>
            </div>
        `;
    }

    // Use Soon HTML
    const activeItems = window.BhojInventory.get();
    const useSoonItems = activeItems.filter(item => {
        const days = window.BhojInventory.calculateDaysRemaining(item.expiryDate);
        return days >= 0 && days <= 3;
    });

    let useSoonHtml = '';
    if (useSoonItems.length > 0) {
        useSoonHtml = `
            <div class="card" style="padding: 30px;">
                <h3 style="margin-bottom: 20px; color: var(--color-danger);"><i class="fa-solid fa-fire"></i> Use These Soon</h3>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 15px;">
                    ${useSoonItems.map(item => `
                        <li style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                            <div>
                                <strong style="display: block;">${item.name}</strong>
                                <span style="font-size: 0.85rem; color: var(--color-warning);">Expires in ${window.BhojInventory.calculateDaysRemaining(item.expiryDate)} days</span>
                            </div>
                            <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.85rem;" onclick="window.navigateTo('recipes', '?ingredient=${encodeURIComponent(item.name)}')">Find Recipes</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="container section-padding">
            <div style="text-align: center; margin-bottom: 50px;">
                <div style="width: 80px; height: 80px; background-color: var(--color-success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2.5rem; color: var(--color-success);">
                    <i class="fa-solid fa-earth-americas"></i>
                </div>
                <h1 style="margin-bottom: 10px;">Your Bhoj Impact</h1>
                <p style="color: var(--color-text-light); max-width: 600px; margin: 0 auto 20px; font-size: 1.1rem;">
                    Small actions in your kitchen can help reduce food waste.
                </p>
                
                <div style="background-color: var(--color-primary-bg); color: var(--color-primary-dark); padding: 15px 30px; border-radius: var(--radius-pill); display: inline-block; font-weight: 600;">
                    You have used ${stats.foodSaved} food items before expiry.
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 2rem; color: var(--color-text-light); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-text);">${stats.foodAdded}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Total Items Added</p>
                </div>

                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-utensils" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-text);">${stats.foodUsed}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Items Used</p>
                </div>

                <div class="card" style="padding: 30px; text-align: center; background-color: var(--color-success); color: white;">
                    <i class="fa-solid fa-leaf" style="font-size: 2rem; color: white; margin-bottom: 15px; opacity: 0.8;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: white;">${stats.foodSaved}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: rgba(255,255,255,0.9);">Items Saved</p>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="card" style="padding: 30px; text-align: center; border-left: 5px solid var(--color-danger);">
                    <i class="fa-solid fa-trash" style="font-size: 2rem; color: var(--color-danger); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-danger);">${stats.foodExpired}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Items Expired</p>
                </div>
                
                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-fire-burner" style="font-size: 2rem; color: var(--color-warning); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-text);">${stats.recipesCooked}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Recipes Cooked</p>
                </div>
                
                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-carrot" style="font-size: 2rem; color: var(--color-accent); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-text);">${stats.uniqueIngredientsCount}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Unique Ingredients</p>
                </div>
            </div>

            <!-- Visualization / Chart -->
            <div class="card" style="padding: 40px; margin-top: 40px;">
                <h3 style="margin-bottom: 30px; text-align: center;">Food Used This Week</h3>
                
                <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 250px; padding-bottom: 30px; border-bottom: 2px solid #eee; position: relative;">
                    ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                        const count = stats.weeklyUsage[day];
                        const heightPct = maxVal > 0 ? (count / maxVal) * 100 : 0;
                        return `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%; height: 100%; justify-content: flex-end;">
                            <span style="font-weight: bold; color: var(--color-primary); font-size: 0.9rem; ${count === 0 ? 'opacity:0;' : ''}">${count}</span>
                            <div style="width: 100%; background-color: var(--color-primary); height: ${heightPct}%; border-radius: 4px 4px 0 0; transition: height 1s ease; min-height: ${heightPct > 0 ? '5px' : '0'}"></div>
                            <span style="font-size: 0.85rem; color: #666;">${day.substring(0,3)}</span>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Monthly Waste Trend -->
            ${stats.monthlyTrend && stats.monthlyTrend.length > 0 ? `
            <div class="card" style="padding: 40px; margin-top: 40px;">
                <h3 style="margin-bottom: 30px; text-align: center;">Waste Trend</h3>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${stats.monthlyTrend.map(trend => `
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                            <strong style="font-size: 1.1rem;">${trend.month}</strong>
                            <div style="display: flex; gap: 20px;">
                                <div style="text-align: right;">
                                    <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Saved</span>
                                    <div style="color: var(--color-success); font-weight: bold; font-size: 1.2rem;">${trend.saved}</div>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Expired</span>
                                    <div style="color: var(--color-danger); font-weight: bold; font-size: 1.2rem;">${trend.expired}</div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Side by side lists -->
            <div class="grid grid-cols-2 gap-3" style="margin-top: 40px;">
                ${mostUsedHtml}
                ${useSoonHtml}
            </div>
        </div>
    `;
};
