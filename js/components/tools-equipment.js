// Data Management Module
let inventory = [
    { id: 1, item: "Tractor", quantity: 2, purchaseValue: 50000, usefulLife: 10, dateOfPurchase: "2018-03-15" },
    { id: 2, item: "Irrigation Pump", quantity: 5, purchaseValue: 10000, usefulLife: 8, dateOfPurchase: "2020-05-10" }
];
let newItem = {};
let nextId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;

function generateId() {
    return nextId++;
}

function getInventory() {
    return inventory;
}

function updateInventory(newInventory) {
    inventory = newInventory;
}

// Calculation Module
function calculateDepreciation(item) {
    const purchaseYear = new Date(item.dateOfPurchase).getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsInUse = currentYear - purchaseYear;
    const annualDepreciation = item.purchaseValue / item.usefulLife;
    const depreciatedValue = Math.max(item.purchaseValue - (yearsInUse * annualDepreciation), 0);
    return depreciatedValue.toFixed(2);
}

// Rendering Module
function renderInventory() {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = '';
    getInventory().forEach(item => {
        const row = inventoryBody.insertRow();
        row.insertCell().textContent = item.item;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.dateOfPurchase;
        row.insertCell().textContent = `₦${item.purchaseValue}`;
        row.insertCell().textContent = `₦${calculateDepreciation(item)}`;
        row.insertCell().textContent = item.usefulLife;
        row.insertCell().textContent = new Date().getFullYear() - new Date(item.dateOfPurchase).getFullYear();
        const actionsCell = row.insertCell();
        createDeleteButton(item.id, actionsCell);
    });
}

function createDeleteButton(itemId, parentElement) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️ Delete';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => deleteItemHandler(itemId);
    parentElement.appendChild(deleteButton);
}

function displayAddNewItemRow() {
    newItem = {};
    document.getElementById('add-new-item-row').style.display = 'table-row';
    document.getElementById('newItem-item').value = '';
    document.getElementById('newItem-quantity').value = '';
    document.getElementById('newItem-dateOfPurchase').value = '';
    document.getElementById('newItem-purchaseValue').value = '';
    document.getElementById('newItem-usefulLife').value = '';
    resetValidationErrors();
}

function hideAddNewItemRow() {
    document.getElementById('add-new-item-row').style.display = 'none';
    resetValidationErrors();
}

// Event Handling Module
function addItemHandler() {
    displayAddNewItemRow();
}

function cancelAddItemHandler() {
    hideAddNewItemRow();
}

function confirmAddItemHandler() {
    const item = document.getElementById('newItem-item').value;
    const quantity = parseInt(document.getElementById('newItem-quantity').value);
    const dateOfPurchase = document.getElementById('newItem-dateOfPurchase').value;
    const purchaseValue = parseFloat(document.getElementById('newItem-purchaseValue').value);
    const usefulLife = parseInt(document.getElementById('newItem-usefulLife').value);

    if (validateNewItem(item, quantity, dateOfPurchase, purchaseValue, usefulLife)) {
        const newItemToAdd = {
            id: generateId(),
            item: item,
            quantity: quantity,
            dateOfPurchase: dateOfPurchase,
            purchaseValue: purchaseValue,
            usefulLife: usefulLife
        };
        updateInventory([...getInventory(), newItemToAdd]);
        hideAddNewItemRow();
        renderInventory();
    }
}

function deleteItemHandler(id) {
    const updatedInventory = getInventory().filter(item => item.id !== id);
    updateInventory(updatedInventory);
    renderInventory();
}

// Validation Module
function validateNewItem(item, quantity, dateOfPurchase, purchaseValue, usefulLife) {
    let hasErrors = false;
    resetValidationErrors();

    if (!item) {
        displayValidationError('item', 'Item name is required.');
        hasErrors = true;
    }
    if (isNaN(quantity) || quantity <= 0) {
        displayValidationError('quantity', 'Quantity must be a number greater than zero.');
        hasErrors = true;
    }
    if (!dateOfPurchase) {
        displayValidationError('dateOfPurchase', 'Date of purchase is required.');
        hasErrors = true;
    }
    if (isNaN(purchaseValue) || purchaseValue <= 0) {
        displayValidationError('purchaseValue', 'Purchase value must be a number greater than zero.');
        hasErrors = true;
    }
    if (isNaN(usefulLife) || usefulLife <= 0) {
        displayValidationError('usefulLife', 'Expected useful life must be a number greater than zero.');
        hasErrors = true;
    }

    return !hasErrors;
}

function displayValidationError(fieldId, message) {
    document.getElementById(`error-${fieldId}`).textContent = message;
}

function resetValidationErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

// Initial rendering
renderInventory();