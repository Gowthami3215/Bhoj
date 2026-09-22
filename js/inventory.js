// LocalStorage Inventory Management

function getInventoryKey() {
    const user = window.BhojAuth ? window.BhojAuth.getCurrentUser() : null;
    if (user) {
        return 'bhoj_inventory_' + user.id;
    }
    return 'bhoj_inventory_guest'; // Fallback just in case
}

function autoExpireItems(items) {
    let changed = false;
    const activeItems = [];
    
    items.forEach(item => {
        const daysRemaining = calculateDaysRemaining(item.expiryDate);
        if (daysRemaining < 0) {
            // It expired! Track it and remove it.
            if (window.BhojActivity) {
                window.BhojActivity.trackEvent('food_expired', { itemId: item.id, itemName: item.name });
            }
            changed = true;
        } else {
            activeItems.push(item);
        }
    });

    if (changed) {
        const key = getInventoryKey();
        localStorage.setItem(key, JSON.stringify(activeItems));
    }
    return activeItems;
}

function getInventory() {
    const key = getInventoryKey();
    const data = localStorage.getItem(key);
    let items = data ? JSON.parse(data) : [];
    
    // Check for auto-expiry
    items = autoExpireItems(items);
    return items;
}

function saveInventory(items) {
    const key = getInventoryKey();
    localStorage.setItem(key, JSON.stringify(items));
}

function addInventoryItem(item) {
    const items = getInventory();
    
    if (!item.image) {
        item.image = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
    }
    
    const newItem = {
        ...item,
        id: Date.now().toString(),
        addedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    saveInventory(items);

    if (window.BhojActivity) {
        window.BhojActivity.trackEvent('food_added', { itemId: newItem.id, itemName: newItem.name });
    }
}

function updateInventoryItem(id, updatedData) {
    const items = getInventory();
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedData };
        saveInventory(items);
    }
}

function removeInventoryItem(id) {
    let items = getInventory();
    items = items.filter(item => item.id != id);
    saveInventory(items);
}

function markItemAsUsed(id) {
    let items = getInventory();
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        const item = items[index];
        
        // Track the usage
        if (window.BhojActivity) {
            window.BhojActivity.trackEvent('food_used', { 
                itemId: item.id, 
                itemName: item.name,
                expiryDate: item.expiryDate 
            });
        }
        
        // Remove from active pantry
        items.splice(index, 1);
        saveInventory(items);
    }
}

function migrateLegacyPantry(userId) {
    const legacyData = localStorage.getItem('bhoj_inventory');
    if (legacyData) {
        try {
            const items = JSON.parse(legacyData);
            if (items && items.length > 0) {
                const newKey = 'bhoj_inventory_' + userId;
                const existingNewData = localStorage.getItem(newKey);
                
                if (!existingNewData || JSON.parse(existingNewData).length === 0) {
                    localStorage.setItem(newKey, legacyData);
                    localStorage.removeItem('bhoj_inventory');
                }
            }
        } catch (e) {
            console.error("Migration failed", e);
        }
    }
}

function loadDemoPantry() {
    const today = new Date();
    
    const demoItems = [
        { name: "Milk", quantity: "1L", daysRemaining: 2, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80" },
        { name: "Bread", quantity: "1 loaf", daysRemaining: 1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80" },
        { name: "Tomatoes", quantity: "500g", daysRemaining: 5, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
        { name: "Paneer", quantity: "200g", daysRemaining: 0, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc3?auto=format&fit=crop&w=300&q=80" },
        { name: "Yogurt", quantity: "400g", daysRemaining: -2, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80" }
    ];

    const newItems = demoItems.map((item, index) => {
        const expDate = new Date(today);
        expDate.setDate(today.getDate() + item.daysRemaining);
        
        const mfgDate = new Date(expDate);
        mfgDate.setDate(expDate.getDate() - 7); 
        
        return {
            id: (Date.now() + index).toString(),
            name: item.name,
            quantity: item.quantity,
            manufacturingDate: mfgDate.toISOString().split('T')[0],
            expiryDate: expDate.toISOString().split('T')[0],
            addedAt: today.toISOString(),
            image: item.image
        };
    });
    
    // Add directly so we trigger the activity hooks
    newItems.forEach(item => addInventoryItem(item));
}

function calculateDaysRemaining(expiryDateStr) {
    if (!expiryDateStr) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDateStr);
    expDate.setHours(0, 0, 0, 0);
    
    const diffTime = expDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function getExpiryStatus(daysRemaining) {
    if (daysRemaining < 0) {
        return { status: 'expired', label: 'Expired', message: `Expired ${Math.abs(daysRemaining)} days ago`, cssClass: 'danger' };
    } else if (daysRemaining === 0) {
        return { status: 'expiring-today', label: 'Expiring Today', message: 'Use today if appropriate according to the product\'s label and storage conditions.', cssClass: 'danger' };
    } else if (daysRemaining <= 3) {
        return { status: 'use-soon', label: 'Use Soon', message: `Expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`, cssClass: 'warning' };
    } else {
        return { status: 'fresh', label: 'Fresh', message: `Expires in ${daysRemaining} days`, cssClass: 'success' };
    }
}

// Export functions to global scope
window.BhojInventory = {
    get: getInventory,
    add: addInventoryItem,
    update: updateInventoryItem,
    remove: removeInventoryItem,
    markItemAsUsed: markItemAsUsed,
    loadDemo: loadDemoPantry,
    calculateDaysRemaining,
    getExpiryStatus,
    migrateLegacyPantry
};
