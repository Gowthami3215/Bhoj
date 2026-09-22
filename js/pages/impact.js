// Impact Page View
window.renderImpact = function() {
    const container = document.getElementById('view-impact');
    const impactData = window.BhojData.impact;

    container.innerHTML = `
        <div class="container section-padding">
            <div style="text-align: center; margin-bottom: 50px;">
                <div style="width: 80px; height: 80px; background-color: var(--color-success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2.5rem; color: var(--color-success);">
                    <i class="fa-solid fa-earth-americas"></i>
                </div>
                <h1 style="margin-bottom: 10px;">Your Impact</h1>
                <p style="color: var(--color-text-light); max-width: 600px; margin: 0 auto; font-size: 1.1rem;">
                    See how your smart cooking choices are helping to reduce global food waste and save you money.
                </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-4 gap-3 mb-4">
                <div class="card" style="padding: 30px; text-align: center; background-color: var(--color-primary); color: white;">
                    <i class="fa-solid fa-basket-shopping" style="font-size: 2rem; color: var(--color-accent); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: white;">${impactData.itemsConsumed}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: rgba(255,255,255,0.8);">Items Consumed Before Expiry</p>
                </div>
                
                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-scale-balanced" style="font-size: 2rem; color: var(--color-success); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-primary-dark);">${impactData.foodSavedLbs}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Lbs of Food Saved</p>
                </div>

                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-fire-burner" style="font-size: 2rem; color: var(--color-warning); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-primary-dark);">${impactData.recipesCooked}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Recipes Cooked</p>
                </div>

                <div class="card" style="padding: 30px; text-align: center;">
                    <i class="fa-solid fa-sack-dollar" style="font-size: 2rem; color: var(--color-success); margin-bottom: 15px;"></i>
                    <h2 style="font-size: 3rem; margin-bottom: 5px; color: var(--color-primary-dark);">$${impactData.moneySaved}</h2>
                    <p style="font-size: 0.95rem; font-weight: 500; text-transform: uppercase; margin: 0; color: var(--color-text-light);">Estimated Money Saved</p>
                </div>
            </div>

            <!-- Visualization / Chart Placeholder -->
            <div class="card" style="padding: 40px; margin-top: 40px;">
                <h3 style="margin-bottom: 30px; text-align: center;">Waste Avoided Over Time</h3>
                
                <!-- Simple CSS Bar Chart -->
                <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 250px; padding-bottom: 30px; border-bottom: 2px solid #eee; position: relative;">
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%;">
                        <div style="width: 100%; background-color: var(--color-primary-light); height: 40%; border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                        <span style="font-size: 0.85rem; color: #666;">May</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%;">
                        <div style="width: 100%; background-color: var(--color-primary-light); height: 60%; border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                        <span style="font-size: 0.85rem; color: #666;">Jun</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%;">
                        <div style="width: 100%; background-color: var(--color-primary-light); height: 50%; border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                        <span style="font-size: 0.85rem; color: #666;">Jul</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%;">
                        <div style="width: 100%; background-color: var(--color-primary-light); height: 85%; border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                        <span style="font-size: 0.85rem; color: #666;">Aug</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; width: 10%;">
                        <div style="width: 100%; background-color: var(--color-accent); height: 100%; border-radius: 4px 4px 0 0; transition: height 1s ease;"></div>
                        <span style="font-size: 0.85rem; font-weight: bold; color: var(--color-primary);">Sep</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};
