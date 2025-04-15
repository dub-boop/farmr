// js/components/inputs-management.js
document.addEventListener('DOMContentLoaded', () => {
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const addNewBtn = document.getElementById('addNewBtn');
    const searchInput = document.getElementById('searchInput');
    const stockOutModal = document.getElementById('stockOutModal');
    const closeStockOutModalBtn = document.getElementById('closeStockOutModalBtn');
    const confirmStockOutBtn = document.getElementById('confirmStockOutBtn');
    const stockOutQuantityInput = document.getElementById('stockOutQuantity');
    const removalReasonSelect = document.getElementById('removalReason');
    const movementTypeSelect = document.getElementById('movementType');
    const invoiceOrReceiptNumberInput = document.getElementById('invoiceOrReceiptNumber');
    const movementDateInput = document.getElementById('movementDate');

    let inventory = [
        { id: 1, item: "Maize Seeds", quantity: 50, unit: "kg", dateOfReceipt: "2025-03-15", bestBefore: "2025-09-15" },
        { id: 2, item: "Fertilizer", quantity: 20, unit: "bags", dateOfReceipt: "2025-03-10", bestBefore: "2026-03-10" },
        { id: 3, item: "Pesticides", quantity: 15, unit: "liters", dateOfReceipt: "2025-03-20", bestBefore: "2026-03-20" }
    ];
    let selectedItem = null;
    let isAddingNew = false;

    function renderInventory() {
        inventoryTableBody.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const filteredInventory = inventory.filter(item => item.item.toLowerCase().includes(searchTerm));

        filteredInventory.forEach(item => {
            const row = inventoryTableBody.insertRow();

            const itemCell = row.insertCell();
            const quantityCell = row.insertCell();
            const unitCell = row.insertCell();
            const dateOfReceiptCell = row.insertCell();
            const bestBeforeCell = row.insertCell();
            const actionsCell = row.insertCell();

            if (item.isNew) {
                itemCell.innerHTML = `<input type="text" class="inputs-management-page__input-field" value="${item.item || ''}" data-id="${item.id}" data-field="item" placeholder="Item Name">`;
                quantityCell.innerHTML = `<input type="number" class="inputs-management-page__input-field" value="${item.quantity || ''}" data-id="${item.id}" data-field="quantity" placeholder="Quantity">`;
                unitCell.innerHTML = `
                    <select class="inputs-management-page__select-field" data-id="${item.id}" data-field="unit">
                        <option value="">Select unit</option>
                        <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="bags" ${item.unit === 'bags' ? 'selected' : ''}>bags</option>
                        <option value="liters" ${item.unit === 'liters' ? 'selected' : ''}>liters</option>
                        <option value="cartons" ${item.unit === 'cartons' ? 'selected' : ''}>cartons</option>
                    </select>`;
                dateOfReceiptCell.innerHTML = `<input type="date" class="inputs-management-page__input-field" value="${item.dateOfReceipt || ''}" data-id="${item.id}" data-field="dateOfReceipt">`;
                bestBeforeCell.innerHTML = `<input type="date" class="inputs-management-page__input-field" value="${item.bestBefore || ''}" data-id="${item.id}" data-field="bestBefore">`;
                actionsCell.innerHTML = `
                    <button class="inputs-management-page__button inputs-management-page__button--primary save-new-btn" data-id="${item.id}">Save</button>
                    <button class="inputs-management-page__delete-button delete-new-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                `;
            } else {
                itemCell.textContent = item.item;
                quantityCell.textContent = item.quantity;
                unitCell.textContent = item.unit;
                dateOfReceiptCell.textContent = item.dateOfReceipt;
                bestBeforeCell.textContent = item.bestBefore;
                actionsCell.innerHTML = `<button class="inputs-management-page__button inputs-management-page__button--primary stock-out-btn" data-item-id="${item.id}">Stock Out</button>`;
            }
        });

        // Event listeners for new item actions
        document.querySelectorAll('.save-new-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const row = Array.from(inventoryTableBody.rows).find(row => {
                    const input = row.querySelector(`input[data-id="${id}"]`);
                    return input !== null;
                });
                if (row) {
                    const itemInput = row.querySelector(`input[data-field="item"]`);
                    const quantityInput = row.querySelector(`input[data-field="quantity"]`);
                    const unitSelect = row.querySelector(`select[data-field="unit"]`);
                    const dateOfReceiptInput = row.querySelector(`input[data-field="dateOfReceipt"]`);
                    const bestBeforeInput = row.querySelector(`input[data-field="bestBefore"]`);

                    inventory = inventory.map(invItem => {
                        if (invItem.id === id) {
                            return {
                                ...invItem,
                                item: itemInput.value,
                                quantity: parseInt(quantityInput.value),
                                unit: unitSelect.value,
                                dateOfReceipt: dateOfReceiptInput.value,
                                bestBefore: bestBeforeInput.value,
                                isNew: false
                            };
                        }
                        return invItem;
                    });
                    isAddingNew = false;
                    renderInventory();
                }
            });
        });

        document.querySelectorAll('.delete-new-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                inventory = inventory.filter(item => item.id !== id);
                isAddingNew = false;
                renderInventory();
            });
        });

        // Event listeners for stock out buttons
        document.querySelectorAll('.stock-out-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.dataset.itemId);
                selectedItem = inventory.find(item => item.id === itemId);
                if (selectedItem) {
                    stockOutQuantityInput.value = '';
                    removalReasonSelect.value = '';
                    movementTypeSelect.value = '';
                    invoiceOrReceiptNumberInput.value = '';
                    movementDateInput.value = '';
                    stockOutModal.style.display = 'block';
                }
            });
        });
    }

    addNewBtn.addEventListener('click', () => {
        if (!isAddingNew) {
            inventory = [...inventory, { id: Date.now(), item: "", quantity: "", unit: "", dateOfReceipt: "", bestBefore: "", isNew: true }];
            isAddingNew = true;
            renderInventory();
        }
    });

    searchInput.addEventListener('input', renderInventory);

    closeStockOutModalBtn.addEventListener('click', () => {
        stockOutModal.style.display = 'none';
        selectedItem = null;
    });

    confirmStockOutBtn.addEventListener('click', () => {
        if (selectedItem) {
            const quantityToRemove = parseInt(stockOutQuantityInput.value);
            const currentQuantity = selectedItem.quantity;
            if (!isNaN(quantityToRemove) && quantityToRemove > 0 && quantityToRemove <= currentQuantity) {
                // In a real application, you would handle the stock out logic here
                alert(`Stocked out ${quantityToRemove} of ${selectedItem.item}`);
                stockOutModal.style.display = 'none';
                // For this example, we won't update the inventory quantity
            } else {
                alert('Please enter a valid quantity to remove.');
            }
        }
    });

    renderInventory();
});