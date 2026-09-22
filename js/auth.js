// User Authentication Module (Prototype)

window.BhojAuth = (function() {
    const USERS_KEY = 'bhoj_users';
    const CURRENT_USER_KEY = 'bhoj_current_user';

    function getUsers() {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        const id = localStorage.getItem(CURRENT_USER_KEY);
        if (!id) return null;
        const users = getUsers();
        return users.find(u => u.id === id) || null;
    }

    function isAuthenticated() {
        return getCurrentUser() !== null;
    }

    function registerUser(name, email, password) {
        const users = getUsers();
        
        // Basic duplicate check
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: "An account with this email already exists." };
        }

        const newUser = {
            id: 'user_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
            name: name,
            email: email,
            password: password // Plain-text strictly for prototype purposes
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login after registration
        localStorage.setItem(CURRENT_USER_KEY, newUser.id);
        
        // Trigger migration if legacy global pantry exists
        window.BhojInventory.migrateLegacyPantry(newUser.id);
        
        return { success: true, user: newUser };
    }

    function loginUser(email, password) {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, user.id);
            // Trigger migration if legacy global pantry exists and this is their first time
            window.BhojInventory.migrateLegacyPantry(user.id);
            return { success: true, user };
        } else {
            return { success: false, message: "Invalid email or password." };
        }
    }

    function logoutUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function requireAuthentication(redirectRoute = 'login') {
        if (!isAuthenticated()) {
            if (window.navigateTo) {
                window.navigateTo(redirectRoute);
            }
            return false;
        }
        return true;
    }

    return {
        registerUser,
        loginUser,
        logoutUser,
        getCurrentUser,
        isAuthenticated,
        requireAuthentication
    };
})();
