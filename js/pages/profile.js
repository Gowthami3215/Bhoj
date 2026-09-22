// Profile Page View
window.renderProfile = function() {
    if (!window.BhojAuth.requireAuthentication('login')) return;
    
    const container = document.getElementById('view-profile');
    const user = window.BhojAuth.getCurrentUser();
    
    const pantryCount = window.BhojInventory.get().length;

    container.innerHTML = `
        <div class="container section-padding" style="max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="margin-bottom: 10px;">My Profile</h1>
            </div>
            
            <div class="card" style="padding: 40px; text-align: center;">
                <div style="width: 100px; height: 100px; background-color: var(--color-primary-bg); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: bold; margin: 0 auto 20px;">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                
                <h2 style="margin-bottom: 5px;">${user.name}</h2>
                <p style="color: #666; margin-bottom: 30px;">${user.email}</p>
                
                <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                    <div>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--color-primary);">${pantryCount}</div>
                        <div style="font-size: 0.85rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">Pantry Items</div>
                    </div>
                </div>
                
                <button id="logout-btn" class="btn btn-outline" style="color: var(--color-danger); border-color: var(--color-danger);">
                    <i class="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.BhojAuth.logoutUser();
            if (window.updateNavigationUI) window.updateNavigationUI();
            window.navigateTo('home');
        });
    }
};
