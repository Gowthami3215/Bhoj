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

    // Routing function
    window.navigateTo = function(route, data = null) {
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

        // Update browser URL if navigating with query params
        if (typeof data === 'string' && data.startsWith('?')) {
            window.history.pushState({}, '', `${route}.html${data}`);
        } else {
            // just a simple hash or path for SPA, keep it clean
            window.history.pushState({}, '', `#${route}`);
        }

        // Trigger view-specific render functions if they exist
        if (route === 'home' && window.renderHome) window.renderHome();
        if (route === 'scan' && window.renderScan) window.renderScan();
        if (route === 'pantry' && window.renderPantry) window.renderPantry();
        if (route === 'recipes' && window.renderRecipes) window.renderRecipes(data);
        if (route === 'impact' && window.renderImpact) window.renderImpact();
        
        if (route === 'recipe-detail' && window.renderRecipeDetail) {
            window.renderRecipeDetail(data); // Pass data (recipe ID) to detail page
        }

        // Scroll to top
        window.scrollTo(0, 0);
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
    window.navigateTo('home');
});
