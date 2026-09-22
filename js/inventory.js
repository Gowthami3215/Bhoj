// LocalStorage Inventory Management

const INVENTORY_KEY = 'bhoj_inventory';

function getInventory() {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : [];
}

function saveInventory(items) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

function addInventoryItem(item) {
    const items = getInventory();
    
    // Add default image if none provided
    if (!item.image) {
        item.image = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"; // generic grocery image
    }
    
    items.push({
        ...item,
        id: Date.now().toString(),
        addedAt: new Date().toISOString()
    });
    saveInventory(items);
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
    
    saveInventory(newItems);
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
    loadDemo: loadDemoPantry,
    calculateDaysRemaining,
    getExpiryStatus
};
