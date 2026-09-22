// Login Page View
window.renderLogin = function() {
    const container = document.getElementById('view-login');
    
    // Redirect if already logged in
    if (window.BhojAuth.isAuthenticated()) {
        window.navigateTo('pantry');
        return;
    }

    container.innerHTML = `
        <div class="container section-padding" style="max-width: 500px; margin: 0 auto;">
            <div class="card" style="padding: 40px;">
                <h2 style="text-align: center; margin-bottom: 20px;">Welcome Back</h2>
                <div id="login-error" style="color: var(--color-danger); background: var(--color-danger-bg); padding: 10px; border-radius: 4px; margin-bottom: 20px; display: none; text-align: center; font-size: 0.9rem;"></div>
                
                <form id="login-form">
                    <div style="margin-bottom: 20px;">
                        <label for="login-email" style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
                        <input type="email" id="login-email" class="form-input" style="width: 100%;" required>
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label for="login-password" style="display: block; margin-bottom: 5px; font-weight: 500;">Password</label>
                        <input type="password" id="login-password" class="form-input" style="width: 100%;" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                </form>
                
                <div style="text-align: center; margin-top: 25px; color: #666;">
                    Don't have an account? <a href="#register" data-route="register" style="color: var(--color-primary); font-weight: 600;">Register</a>
                </div>
            </div>
        </div>
    `;

    // Attach local link listener because dynamically injected
    const regLink = container.querySelector('[data-route="register"]');
    if (regLink) {
        regLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.navigateTo('register');
        });
    }

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const errDiv = document.getElementById('login-error');
        
        const result = window.BhojAuth.loginUser(email, password);
        
        if (result.success) {
            errDiv.style.display = 'none';
            if (window.updateNavigationUI) window.updateNavigationUI();
            window.navigateTo('pantry');
        } else {
            errDiv.innerText = result.message;
            errDiv.style.display = 'block';
        }
    });
};
