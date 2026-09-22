// Home Page View
window.renderHome = function() {
    const container = document.getElementById('view-home');
    
    // Get 3 featured recipes
    const featuredRecipes = window.BhojData.recipes.slice(0, 3);
    
    let recipesHTML = '';
    featuredRecipes.forEach(recipe => {
        recipesHTML += `
            <div class="card recipe-card" onclick="window.navigateTo('recipe-detail', ${recipe.id})" style="cursor:pointer;">
                <img src="${recipe.image}" alt="${recipe.title}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding: 20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span class="badge ${recipe.priority === 'High' ? 'badge-danger' : 'badge-success'}">
                            ${recipe.priority === 'High' ? 'Uses Expiring Items' : 'Fresh'}
                        </span>
                        <span style="font-size:0.9rem; color:#666;"><i class="fa-regular fa-clock"></i> ${recipe.time}</span>
                    </div>
                    <h3 style="margin-bottom:10px;">${recipe.title}</h3>
                    <p style="color:#666; font-size:0.95rem; margin-bottom:15px;">${recipe.description}</p>
                    <button class="btn btn-outline" style="width:100%;">View Recipe</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <!-- Hero Section -->
        <section style="background-color: var(--color-primary); color: white; padding: 100px 20px; text-align: center;">
            <div class="container">
                <h1 style="color: white; font-size: 3.5rem; margin-bottom: 20px;">Eat Smart. Waste Less.</h1>
                <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto 40px; color: #e2f3f1;">
                    Bhoj helps you track food expiry and discover delicious recipes before your ingredients go to waste.
                </p>
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-accent" onclick="window.navigateTo('scan')">Scan Your Food</button>
                    <button class="btn btn-outline" style="color:var(--color-primary); border-color:transparent" onclick="window.navigateTo('pantry')">View My Pantry</button>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section class="section-padding" style="background-color: var(--color-bg);">
            <div class="container text-center">
                <h2 style="margin-bottom: 50px;">How Bhoj Works</h2>
                <div class="grid grid-cols-3 gap-3">
                    <div class="card" style="padding: 40px 20px; background: transparent; box-shadow: none;">
                        <div style="width: 80px; height: 80px; background-color: var(--color-accent-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: var(--color-accent);">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                        <h3>1. Scan Your Food</h3>
                        <p style="color: var(--color-text-light);">Take a photo of your groceries. We identify the items and their expiry dates automatically.</p>
                    </div>
                    <div class="card" style="padding: 40px 20px; background: transparent; box-shadow: none;">
                        <div style="width: 80px; height: 80px; background-color: var(--color-success-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: var(--color-success);">
                            <i class="fa-solid fa-calendar-check"></i>
                        </div>
                        <h3>2. Track Expiry</h3>
                        <p style="color: var(--color-text-light);">Your pantry dashboard keeps you updated on what needs to be used soon.</p>
                    </div>
                    <div class="card" style="padding: 40px 20px; background: transparent; box-shadow: none;">
                        <div style="width: 80px; height: 80px; background-color: var(--color-danger-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: var(--color-danger);">
                            <i class="fa-solid fa-utensils"></i>
                        </div>
                        <h3>3. Cook Before It Expires</h3>
                        <p style="color: var(--color-text-light);">Get personalized recipe recommendations to use up expiring ingredients.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Recipes Section -->
        <section class="section-padding" style="background-color: white;">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                    <h2>Featured Recipes</h2>
                    <a href="#" onclick="window.navigateTo('recipes'); return false;" style="color: var(--color-primary); font-weight: 600;">View All <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    ${recipesHTML}
                </div>
            </div>
        </section>

        <!-- Impact Section Teaser -->
        <section class="section-padding" style="background-color: var(--color-primary-dark); color: white;">
            <div class="container text-center">
                <h2 style="color: white; margin-bottom: 20px;">Make an Impact</h2>
                <p style="max-width: 600px; margin: 0 auto 40px; color: #a1b0ab;">
                    Every meal you cook with expiring ingredients reduces global food waste and saves you money. Join the movement.
                </p>
                <button class="btn btn-primary" style="background-color: var(--color-accent); color: white;" onclick="window.navigateTo('impact')">View Your Impact</button>
            </div>
        </section>
    `;
};
