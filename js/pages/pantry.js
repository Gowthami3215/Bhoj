// Pantry Page View

window.renderPantry = function() {
    const container = document.getElementById('view-pantry');
    
    // State
    let currentFilter = 'all';
    let currentSort = 'expiry';
    let searchQuery = '';
    
    // Render function
    const updateView = () => {
        const pantryData = window.BhojInventory.get();
        
        // Calculate days remaining and status for all items
        const enhancedData = pantryData.map(item => {
            const daysRemaining = window.BhojInventory.calculateDaysRemaining(item.expiryDate);
            const statusInfo = window.BhojInventory.getExpiryStatus(daysRemaining);
            return {
                ...item,
                daysRemaining,
                ...statusInfo // adds status, label, message, cssClass
            };
        });

        // Calculate summary
        let freshItems = 0;
        let expiringSoon = 0;
        let expiredItems = 0;

        enhancedData.forEach(item => {
            if (item.status === 'fresh') freshItems++;
            if (item.status === 'use-soon') expiringSoon++;
            if (item.status === 'expired' || item.status === 'expiring-today') expiredItems++;
        });

        if (enhancedData.length === 0) {
            // Empty State
            container.innerHTML = `
                <div class="container section-padding text-center">
                    <h1 style="margin-bottom: 20px;">My Pantry</h1>
                    <div class="empty-state">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🍽️</div>
                        <h2>Your pantry is empty.</h2>
                        <p style="color: var(--color-text-light); margin-bottom: 30px;">Start adding food by scanning a package.</p>
                        <div style="display: flex; gap: 15px; justify-content: center;">
                            <button class="btn btn-primary" onclick="window.navigateTo('scan')">Scan Food</button>
                            <button class="btn btn-outline" id="btn-load-demo">Load Demo Pantry</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('btn-load-demo').addEventListener('click', () => {
                window.BhojInventory.loadDemo();
                updateView();
            });
            return;
        }

        // Apply filters
        let filteredData = enhancedData.filter(item => {
            if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            
            if (currentFilter === 'fresh' && item.status !== 'fresh') return false;
            if (currentFilter === 'soon' && item.status !== 'use-soon') return false;
            if (currentFilter === 'today' && item.status !== 'expiring-today') return false;
            if (currentFilter === 'expired' && item.status !== 'expired') return false;
            
            return true;
        });

        // Apply sorting
        filteredData.sort((a, b) => {
            if (currentSort === 'expiry') {
                return a.daysRemaining - b.daysRemaining;
            } else if (currentSort === 'recent') {
                return new Date(b.addedAt) - new Date(a.addedAt);
            } else if (currentSort === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

        // Separate active and expired items for rendering
        const activeItems = filteredData.filter(item => item.status !== 'expired');
        const expiredFilteredItems = filteredData.filter(item => item.status === 'expired');

        // Generate UI
        container.innerHTML = `
            <div class="container section-padding">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <h1 style="margin-bottom: 5px;">My Pantry</h1>
                        <p style="color: var(--color-text-light);">Track and manage your ingredients.</p>
                    </div>
                    <button class="btn btn-primary" onclick="window.navigateTo('scan')">
                        <i class="fa-solid fa-plus"></i> Add Item
                    </button>
                </div>

                <!-- Summary Cards -->
                <div class="grid grid-cols-4 gap-3 mb-4">
                    <div class="card" style="padding: 20px; text-align: center;">
                        <h2 style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: 5px;">${enhancedData.length}</h2>
                        <p style="color: var(--color-text-light); font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Total Items</p>
                    </div>
                    <div class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid var(--color-success);">
                        <h2 style="font-size: 2.5rem; color: var(--color-success); margin-bottom: 5px;">${freshItems}</h2>
                        <p style="color: var(--color-text-light); font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Fresh</p>
                    </div>
                    <div class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid var(--color-warning);">
                        <h2 style="font-size: 2.5rem; color: var(--color-warning); margin-bottom: 5px;">${expiringSoon}</h2>
                        <p style="color: var(--color-text-light); font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Use Soon</p>
                    </div>
                    <div class="card" style="padding: 20px; text-align: center; border-bottom: 4px solid var(--color-danger);">
                        <h2 style="font-size: 2.5rem; color: var(--color-danger); margin-bottom: 5px;">${expiredItems}</h2>
                        <p style="color: var(--color-text-light); font-size: 0.9rem; font-weight: 600; text-transform: uppercase;">Expired</p>
                    </div>
                </div>

                <!-- Controls -->
                <div style="display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn btn-outline ${currentFilter === 'all' ? 'active' : ''}" data-action="filter" data-val="all">All</button>
                        <button class="btn btn-outline ${currentFilter === 'fresh' ? 'active' : ''}" data-action="filter" data-val="fresh">Fresh</button>
                        <button class="btn btn-outline ${currentFilter === 'soon' ? 'active' : ''}" data-action="filter" data-val="soon">Use Soon</button>
                        <button class="btn btn-outline ${currentFilter === 'today' ? 'active' : ''}" data-action="filter" data-val="today">Expiring Today</button>
                        <button class="btn btn-outline ${currentFilter === 'expired' ? 'active' : ''}" data-action="filter" data-val="expired">Expired</button>
                    </div>
                    
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <input type="text" class="form-input pantry-search" placeholder="Search your pantry..." value="${searchQuery}" id="pantry-search-input" aria-label="Search pantry">
                        <select class="form-input" style="width: 200px;" id="pantry-sort-select" aria-label="Sort pantry">
                            <option value="expiry" ${currentSort === 'expiry' ? 'selected' : ''}>Expiring Soonest</option>
                            <option value="recent" ${currentSort === 'recent' ? 'selected' : ''}>Recently Added</option>
                            <option value="name" ${currentSort === 'name' ? 'selected' : ''}>Name</option>
                        </select>
                    </div>
                </div>

                <!-- Active Pantry Grid -->
                ${activeItems.length > 0 ? `
                <div class="grid grid-cols-4 gap-3 mb-4">
                    ${activeItems.map(item => generateCardHTML(item)).join('')}
                </div>` : (currentFilter !== 'expired' ? `<p style="text-align: center; color: #999; margin: 40px 0;">No active items match your criteria.</p>` : '')}

                <!-- Expired Section -->
                ${expiredFilteredItems.length > 0 ? `
                <h3 style="margin-top: 40px; margin-bottom: 20px; border-top: 1px solid #ddd; padding-top: 20px; color: var(--color-danger);">Expired Items</h3>
                <div class="grid grid-cols-4 gap-3" style="opacity: 0.8;">
                    ${expiredFilteredItems.map(item => generateCardHTML(item, true)).join('')}
                </div>` : ''}
            </div>

            <!-- Edit Modal -->
            <div class="modal-overlay" id="edit-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Edit Food Item</h3>
                        <button class="modal-close" id="edit-close">&times;</button>
                    </div>
                    <form id="edit-form">
                        <input type="hidden" id="edit-id">
                        <div class="form-group">
                            <label class="form-label">Food Name</label>
                            <input type="text" class="form-input" id="edit-name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quantity</label>
                            <input type="text" class="form-input" id="edit-quantity">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Manufacturing Date</label>
                            <input type="date" class="form-input" id="edit-mfg">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Expiry Date</label>
                            <input type="date" class="form-input" id="edit-exp" required>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                            <button type="button" class="btn btn-outline" id="edit-cancel">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal-overlay" id="delete-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Remove Item</h3>
                        <button class="modal-close" id="delete-close">&times;</button>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <p id="delete-message">Are you sure you want to remove this item from your pantry?</p>
                    </div>
                    <input type="hidden" id="delete-id">
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" class="btn btn-outline" id="delete-cancel">Cancel</button>
                        <button type="button" class="btn btn-primary" id="delete-confirm" style="background-color: var(--color-danger);">Remove</button>
                    </div>
                </div>
            </div>
        `;

        attachEventListeners(enhancedData);
    };

    const generateCardHTML = (item, isExpired = false) => {
        
        // Format dates nicely
        const formatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const mfgDisplay = item.manufacturingDate ? new Date(item.manufacturingDate).toLocaleDateString('en-GB', formatOptions) : 'Unknown';
        const expDisplay = item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-GB', formatOptions) : 'Unknown';

        let badgeIcon = '';
        if (item.status === 'use-soon') badgeIcon = '⚠️ ';
        if (item.status === 'expiring-today') badgeIcon = '🔴 ';
        if (item.status === 'expired') badgeIcon = '⚫ ';

        return `
            <div class="card" style="display: flex; flex-direction: column;">
                <div style="position: relative;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 160px; object-fit: cover; ${isExpired ? 'filter: grayscale(100%);' : ''}">
                    <div style="position: absolute; top: 10px; right: 10px;">
                        <span class="badge badge-${item.cssClass}">${badgeIcon}${item.label}</span>
                    </div>
                </div>
                <div style="padding: 20px; flex-grow: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <h3 style="margin: 0; font-size: 1.2rem;">${item.name}</h3>
                        <span style="color: var(--color-text-light); font-weight: 600; font-size: 0.9rem;">${item.quantity || ''}</span>
                    </div>
                    
                    <div style="font-size: 0.85rem; color: #666; margin-bottom: 15px;">
                        <div style="margin-bottom: 3px;">Manufactured: <strong style="color:#333;">${mfgDisplay}</strong></div>
                        <div>Expires: <strong style="color:#333;">${expDisplay}</strong></div>
                    </div>
                    
                    <p style="font-size: 0.85rem; font-weight: 600; color: var(--color-${item.cssClass}); margin-bottom: 20px;">
                        ${item.message}
                    </p>
                    
                    ${isExpired ? `
                        <p style="font-size: 0.8rem; color: #666; margin-bottom: 20px; background: #eee; padding: 10px; border-radius: 4px;">
                            Please check the product label and food-safety guidance before consuming.
                        </p>
                    ` : ''}

                    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
                        ${!isExpired ? `
                        <button class="btn btn-outline" style="width: 100%; padding: 8px;" onclick="window.navigateTo('recipes', '?ingredient=${encodeURIComponent(item.name)}')">
                            Find Recipes
                        </button>
                        ` : ''}
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-outline" style="flex: 1; padding: 6px; font-size: 0.9rem;" data-action="edit" data-id="${item.id}">Edit</button>
                            <button class="btn btn-outline" style="flex: 1; padding: 6px; font-size: 0.9rem; color: var(--color-danger); border-color: #fca5a5;" data-action="delete" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const attachEventListeners = (data) => {
        // Filter buttons
        document.querySelectorAll('button[data-action="filter"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = e.target.getAttribute('data-val');
                updateView();
            });
        });

        // Search
        const searchInput = document.getElementById('pantry-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                updateView();
            });
            // Focus at the end of text
            searchInput.focus();
            const val = searchInput.value;
            searchInput.value = '';
            searchInput.value = val;
        }

        // Sort
        const sortSelect = document.getElementById('pantry-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                updateView();
            });
        }

        // Use event delegation on container for Edit and Delete to ensure reliability
        // Remove previous listener using a named property on the container to avoid duplicates
        if (container._pantryClickHandler) {
            container.removeEventListener('click', container._pantryClickHandler);
        }

        container._pantryClickHandler = function(e) {
            const editBtn = e.target.closest('button[data-action="edit"]');
            const deleteBtn = e.target.closest('button[data-action="delete"]');

            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                // Use loose equality or toString() because old items might have integer IDs!
                const item = data.find(i => i.id.toString() === id);
                if (item) {
                    document.getElementById('edit-id').value = item.id;
                    document.getElementById('edit-name').value = item.name;
                    document.getElementById('edit-quantity').value = item.quantity || '';
                    document.getElementById('edit-mfg').value = item.manufacturingDate || '';
                    document.getElementById('edit-exp').value = item.expiryDate || '';
                    
                    document.getElementById('edit-modal').classList.add('active');
                }
            }

            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                const item = data.find(i => i.id.toString() === id);
                if (item) {
                    document.getElementById('delete-id').value = item.id;
                    document.getElementById('delete-message').innerText = `Are you sure you want to remove ${item.name} from your pantry?`;
                    document.getElementById('delete-modal').classList.add('active');
                }
            }
        };
        
        container.addEventListener('click', container._pantryClickHandler);

        // Edit form logic
        const editModal = document.getElementById('edit-modal');
        const closeEditModal = () => editModal.classList.remove('active');
        
        if (document.getElementById('edit-close')) {
            document.getElementById('edit-close').addEventListener('click', closeEditModal);
            document.getElementById('edit-cancel').addEventListener('click', closeEditModal);
            
            document.getElementById('edit-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('edit-id').value;
                const updatedData = {
                    name: document.getElementById('edit-name').value,
                    quantity: document.getElementById('edit-quantity').value,
                    manufacturingDate: document.getElementById('edit-mfg').value,
                    expiryDate: document.getElementById('edit-exp').value
                };
                
                window.BhojInventory.update(id, updatedData);
                closeEditModal();
                updateView();
            });
        }

        // Delete logic
        const deleteModal = document.getElementById('delete-modal');
        const closeDeleteModal = () => deleteModal.classList.remove('active');

        if (document.getElementById('delete-close')) {
            document.getElementById('delete-close').addEventListener('click', closeDeleteModal);
            document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);

            document.getElementById('delete-confirm').addEventListener('click', () => {
                const id = document.getElementById('delete-id').value;
                window.BhojInventory.remove(id);
                closeDeleteModal();
                updateView();
            });
        }
    };

    // Initial render
    updateView();
};

