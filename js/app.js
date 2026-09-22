// Main Application Logic for Bhoj Phase 1

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Routing ---
    const navLinks = document.querySelectorAll('[data-route]');
    const pageViews = document.querySelectorAll('.page-view');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });
    }

    // Dynamic Navigation UI
    window.updateNavigationUI = function() {
        const isAuth = window.BhojAuth.isAuthenticated();
        const profileLink = document.querySelector('.profile-link');
        const loginLink = document.querySelector('[data-route="login"]');
        const registerLink = document.querySelector('[data-route="register"]');
        const pantryLink = document.querySelector('[data-route="pantry"]');
        const logoutBtn = document.getElementById('nav-logout-btn');

        if (isAuth) {
            if (profileLink) profileLink.style.display = 'block';
            if (pantryLink) pantryLink.style.display = 'block';
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (profileLink) profileLink.style.display = 'none';
            if (pantryLink) pantryLink.style.display = 'none';
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    };

    // Routing function
    window.navigateTo = function(route, data = null) {
        // Protect Routes
        if ((route === 'pantry' || route === 'profile') && !window.BhojAuth.isAuthenticated()) {
            route = 'login'; // Force redirect
        }

        // Hide all views
        pageViews.forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(`view-${route}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update nav links active state
        navLinks.forEach(link => {
            if (link.getAttribute('data-route') === route && !link.classList.contains('logo')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('is-active');
            navMenu.classList.remove('active');
        }

        if (typeof data === 'string' && data.startsWith('?')) {
            window.history.pushState({}, '', `${route}.html${data}`);
        } else {
            window.history.pushState({}, '', `#${route}`);
        }

        // Trigger view-specific render functions if they exist
        if (route === 'home' && window.renderHome) window.renderHome();
        if (route === 'scan' && window.renderScan) window.renderScan();
        if (route === 'pantry' && window.renderPantry) window.renderPantry();
        if (route === 'recipes' && window.renderRecipes) window.renderRecipes(data);
        if (route === 'impact' && window.renderImpact) window.renderImpact();
        if (route === 'recipe-detail' && window.renderRecipeDetail) window.renderRecipeDetail(data);
        if (route === 'login' && window.renderLogin) window.renderLogin();
        if (route === 'register' && window.renderRegister) window.renderRegister();
        if (route === 'profile' && window.renderProfile) window.renderProfile();

        // Scroll to top
        window.scrollTo(0, 0);
        window.updateNavigationUI();
    };

    // Add click listeners to all routing links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = link.getAttribute('data-route');
            window.navigateTo(route);
        });
    });

    // Initialize first view
    window.updateNavigationUI();
    window.navigateTo('home');
});
