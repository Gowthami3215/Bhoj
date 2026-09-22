// Register Page View
window.renderRegister = function() {
    const container = document.getElementById('view-register');
    
    // Redirect if already logged in
    if (window.BhojAuth.isAuthenticated()) {
        window.navigateTo('pantry');
        return;
    }

    container.innerHTML = `
        <div class="container section-padding" style="max-width: 500px; margin: 0 auto;">
            <div class="card" style="padding: 40px;">
                <h2 style="text-align: center; margin-bottom: 20px;">Create an Account</h2>
                <div id="register-error" style="color: var(--color-danger); background: var(--color-danger-bg); padding: 10px; border-radius: 4px; margin-bottom: 20px; display: none; text-align: center; font-size: 0.9rem;"></div>
                
                <form id="register-form">
                    <div style="margin-bottom: 20px;">
                        <label for="reg-name" style="display: block; margin-bottom: 5px; font-weight: 500;">Full Name</label>
                        <input type="text" id="reg-name" class="form-input" style="width: 100%;" required>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="reg-email" style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
                        <input type="email" id="reg-email" class="form-input" style="width: 100%;" required>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="reg-password" style="display: block; margin-bottom: 5px; font-weight: 500;">Password</label>
                        <input type="password" id="reg-password" class="form-input" style="width: 100%;" required minlength="6">
                        <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">Must contain at least 6 characters.</div>
                    </div>
                    <div style="margin-bottom: 25px;">
                        <label for="reg-confirm" style="display: block; margin-bottom: 5px; font-weight: 500;">Confirm Password</label>
                        <input type="password" id="reg-confirm" class="form-input" style="width: 100%;" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Register</button>
                </form>
                
                <div style="text-align: center; margin-top: 25px; color: #666;">
                    Already have an account? <a href="#login" data-route="login" style="color: var(--color-primary); font-weight: 600;">Login</a>
                </div>
            </div>
        </div>
    `;

    // Attach local link listener because dynamically injected
    const loginLink = container.querySelector('[data-route="login"]');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.navigateTo('login');
        });
    }

    const form = document.getElementById('register-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const errDiv = document.getElementById('register-error');
        
        if (!name) {
            errDiv.innerText = "Name cannot be empty.";
            errDiv.style.display = 'block';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errDiv.innerText = "Please enter a valid email.";
            errDiv.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errDiv.innerText = "Password must contain at least 6 characters.";
            errDiv.style.display = 'block';
            return;
        }

        if (password !== confirm) {
            errDiv.innerText = "Passwords do not match.";
            errDiv.style.display = 'block';
            return;
        }
        
        const result = window.BhojAuth.registerUser(name, email, password);
        
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
