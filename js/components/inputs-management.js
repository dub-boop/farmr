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
    const stockOutErrorDiv = document.getElementById('stockOutError');
    const newItemErrorDiv = document.getElementById('newItemError');

    let inventory = [
        { id: 1, item: "Maize Seeds", quantity: 50, unit: "kg", dateOfReceipt: "2025-03-15", productionDate: "2024-12-01", bestBefore: "2025-09-15" },
        { id: 2, item: "Fertilizer", quantity: 20, unit: "bags", dateOfReceipt: "2025-03-10", productionDate: "2025-01-15", bestBefore: "2026-03-10" },
        { id: 3, item: "Pesticides", quantity: 15, unit: "liters", dateOfReceipt: "2025-03-20", productionDate: "2025-02-20", bestBefore: "2026-03-20" }
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
            const productionDateCell = row.insertCell();
            const bestBeforeCell = row.insertCell();
            const actionsCell = row.insertCell();

            if (item.isNew) {
                itemCell.innerHTML = `<input type="text" class="inputs-management-page__input-field new-item-input" value="${item.item || ''}" data-id="${item.id}" data-field="item" placeholder="Item Name">`;
                quantityCell.innerHTML = `<input type="number" class="inputs-management-page__input-field new-item-input" value="${item.quantity || ''}" data-id="${item.id}" data-field="quantity" placeholder="Quantity">`;
                unitCell.innerHTML = `
                    <select class="inputs-management-page__select-field new-item-input" data-id="${item.id}" data-field="unit">
                        <option value="">Select unit</option>
                        <option value="kg" ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                        <option value="bags" ${item.unit === 'bags' ? 'selected' : ''}>bags</option>
                        <option value="liters" ${item.unit === 'liters' ? 'selected' : ''}>liters</option>
                        <option value="cartons" ${item.unit === 'cartons' ? 'selected' : ''}>cartons</option>
                    </select>`;
                dateOfReceiptCell.innerHTML = `<input type="date" class="inputs-management-page__input-field new-item-input" value="${item.dateOfReceipt || ''}" data-id="${item.id}" data-field="dateOfReceipt">`;
                productionDateCell.innerHTML = `<input type="date" class="inputs-management-page__input-field new-item-input" value="${item.productionDate || ''}" data-id="${item.id}" data-field="productionDate">`;
                bestBeforeCell.innerHTML = `<input type="date" class="inputs-management-page__input-field new-item-input" value="${item.bestBefore || ''}" data-id="${item.id}" data-field="bestBefore">`;
                actionsCell.innerHTML = `
                    <button class="inputs-management-page__button inputs-management-page__button--primary save-new-btn" data-id="${item.id}">Save</button>
                    <button class="inputs-management-page__delete-button delete-new-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                `;
            } else {
                itemCell.textContent = item.item;
                quantityCell.textContent = item.quantity;
                unitCell.textContent = item.unit;
                dateOfReceiptCell.textContent = item.dateOfReceipt;
                productionDateCell.textContent = item.productionDate;
                bestBeforeCell.textContent = item.bestBefore;
                actionsCell.innerHTML = `<button class="inputs-management-page__button inputs-management-page__button--primary stock-out-btn" data-item-id="${item.id}">Stock Out</button>`;
            }
        });

        inventoryTableBody.addEventListener('click', function(event) {
            if (event.target.classList.contains('save-new-btn')) {
                const id = parseInt(event.target.dataset.id);
                const row = event.target.closest('tr');
                if (row) {
                    const itemInput = row.querySelector(`input[data-field="item"]`);
                    const quantityInput = row.querySelector(`input[data-field="quantity"]`);
                    const unitSelect = row.querySelector(`select[data-field="unit"]`);
                    const dateOfReceiptInput = row.querySelector(`input[data-field="dateOfReceipt"]`);
                    const productionDateInput = row.querySelector(`input[data-field="productionDate"]`);
                    const bestBeforeInput = row.querySelector(`input[data-field="bestBefore"]`);

                    const itemValue = itemInput.value.trim();
                    const quantityValue = quantityInput.value.trim();
                    const unitValue = unitSelect.value;
                    const dateOfReceiptValue = dateOfReceiptInput.value;
                    const productionDateValue = productionDateInput.value;
                    const bestBeforeValue = bestBeforeInput.value;

                    if (!itemValue || !quantityValue || !unitValue || !dateOfReceiptValue || !productionDateValue || !bestBeforeValue) {
                        newItemErrorDiv.textContent = 'Please fill in all the fields.';
                        newItemErrorDiv.style.display = 'block';
                        return;
                    }

                    if (new Date(bestBeforeValue) <= new Date(productionDateValue)) {
                        newItemErrorDiv.textContent = 'Best Before date must be after Production Date.';
                        newItemErrorDiv.style.display = 'block';
                        return;
                    }

                    if (new Date(productionDateValue) > new Date(dateOfReceiptValue)) {
                        newItemErrorDiv.textContent = 'Production Date cannot be after Date of Receipt.';
                        newItemErrorDiv.style.display = 'block';
                        return;
                    }

                    newItemErrorDiv.style.display = 'none';
                    inventory = inventory.map(invItem => {
                        if (invItem.id === id) {
                            return {
                                ...invItem,
                                item: itemValue,
                                quantity: parseInt(quantityValue) || 0,
                                unit: unitValue,
                                dateOfReceipt: dateOfReceiptValue,
                                productionDate: productionDateValue,
                                bestBefore: bestBeforeValue,
                                isNew: false
                            };
                        }
                        return invItem;
                    });
                    isAddingNew = false;
                    renderInventory();
                }
            } else if (event.target.classList.contains('delete-new-btn')) {
                const id = parseInt(event.target.dataset.id);
                inventory = inventory.filter(item => item.id !== id);
                isAddingNew = false;
                renderInventory();
            } else if (event.target.classList.contains('stock-out-btn')) {
                const itemId = parseInt(event.target.dataset.itemId);
                selectedItem = inventory.find(item => item.id === itemId);
                if (selectedItem) {
                    stockOutQuantityInput.value = '';
                    removalReasonSelect.value = '';
                    movementTypeSelect.value = '';
                    invoiceOrReceiptNumberInput.value = '';
                    movementDateInput.value = '';
                    stockOutErrorDiv.style.display = 'none';
                    stockOutModal.style.display = 'block';
                }
            }
        });
    }

    addNewBtn.addEventListener('click', () => {
        if (!isAddingNew) {
            inventory = [...inventory, { id: Date.now(), item: "", quantity: 0, unit: "", dateOfReceipt: "", productionDate: "", bestBefore: "", isNew: true }];
            isAddingNew = true;
            renderInventory();
        }
    });

    searchInput.addEventListener('input', renderInventory);

    closeStockOutModalBtn.addEventListener('click', () => {
        stockOutModal.style.display = 'none';
        selectedItem = null;
        stockOutErrorDiv.style.display = 'none';
    });

    confirmStockOutBtn.addEventListener('click', () => {
        if (selectedItem) {
            const quantityToRemove = stockOutQuantityInput.value;
            const removalReason = removalReasonSelect.value;
            const movementType = movementTypeSelect.value;
            const invoiceOrReceiptNumber = invoiceOrReceiptNumberInput.value;
            const movementDate = movementDateInput.value;

            if (!quantityToRemove || !removalReason || !movementType || !invoiceOrReceiptNumber || !movementDate) {
                stockOutErrorDiv.style.display = 'block';
                return;
            }

            const quantityToRemoveInt = parseInt(quantityToRemove);
            const currentQuantity = selectedItem.quantity;

            if (!isNaN(quantityToRemoveInt) && quantityToRemoveInt > 0 && quantityToRemoveInt <= currentQuantity) {
                // In a real application, you would handle the stock out logic here
                alert(`Stocked out ${quantityToRemoveInt} of ${selectedItem.item}`);
                stockOutModal.style.display = 'none';
                stockOutErrorDiv.style.display = 'none';
                // For this example, we won't update the inventory quantity
            } else {
                alert('Please enter a valid quantity to remove.');
            }
        }
    });

    renderInventory();
});