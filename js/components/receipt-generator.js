document.addEventListener('DOMContentLoaded', () => {
    const documentTypeSelect = document.getElementById('documentType');
    const documentNumberInput = document.getElementById('documentNumber');
    const categorySelect = document.getElementById('category');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const amountPaidInput = document.getElementById('amountPaid');
    const subtotalAmountSpan = document.getElementById('subtotalAmount');
    const discountRateInput = document.getElementById('discountRate');
    const discountAmountSpan = document.getElementById('discountAmount');
    const taxRateInput = document.getElementById('taxRate');
    const taxAmountSpan = document.getElementById('taxAmount');
    const totalAmountSpan = document.getElementById('totalAmount');
    const balanceAmountSpan = document.getElementById('balanceAmount');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemsContainer = document.getElementById('itemsContainer');
    const generateBtn = document.getElementById('generateBtn');
    const receiptDateInput = document.getElementById('receiptDate');
    const headerTitle = document.querySelector('.receipt-generator-page__title');
    const headerIcon = document.querySelector('.receipt-generator-page__icon');

    let items = [];

    // Function to generate document number
    const generateDocumentNumber = () => {
        const prefix = documentTypeSelect.value === "Receipt" ? "REC" : "INV";
        const timestamp = Date.now().toString().slice(-6);
        const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        documentNumberInput.value = `${prefix}-${timestamp}-${randomNumber}`;
    };

    // Function to update header based on document type
    const updateHeader = () => {
        const docType = documentTypeSelect.value;
        headerTitle.textContent = `${docType} Generator`;
        headerIcon.className = `fa-solid fa-${docType === "Receipt" ? "receipt" : "file-text"} receipt-generator-page__icon`;
    };

    // Function to calculate subtotal
    const calculateSubtotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    };

    // Function to calculate discount
    const calculateDiscount = (subtotal) => {
        const discountRate = parseFloat(discountRateInput.value) || 0;
        return (discountRate / 100) * subtotal;
    };

    // Function to calculate tax
    const calculateTax = (subtotalAfterDiscount) => {
        const taxRate = parseFloat(taxRateInput.value) || 0;
        return (taxRate / 100) * subtotalAfterDiscount;
    };

    // Function to calculate total
    const calculateTotal = (subtotal, discount, tax) => {
        return subtotal - discount + tax;
    };

    // Function to calculate balance
    const calculateBalance = (total) => {
        return parseFloat(amountPaidInput.value) - total;
    };

    // Function to update and display totals
    const updateTotals = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount(subtotal);
        const subtotalAfterDiscount = subtotal - discount;
        const tax = calculateTax(subtotalAfterDiscount);
        const total = calculateTotal(subtotal, discount, tax);
        const balance = calculateBalance(total);

        subtotalAmountSpan.textContent = `₦${subtotal.toFixed(2)}`;
        discountAmountSpan.textContent = `₦${discount.toFixed(2)}`;
        taxAmountSpan.textContent = `₦${tax.toFixed(2)}`;
        totalAmountSpan.textContent = `₦${total.toFixed(2)}`;
        balanceAmountSpan.textContent = `₦${balance.toFixed(2)}`;
    };

    // Function to render items
    const renderItems = () => {
        itemsContainer.innerHTML = '';
        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('receipt-generator-card__items-grid');
            itemDiv.innerHTML = `
                <input type="text" class="receipt-generator-card__input item-name" value="${item.name}">
                <select class="receipt-generator-card__select item-unit">
                    <option ${item.unit === 'kg' ? 'selected' : ''}>kg</option>
                    <option ${item.unit === 'liters' ? 'selected' : ''}>liters</option>
                    <option ${item.unit === 'pieces' ? 'selected' : ''}>pieces</option>
                    <option ${item.unit === 'bags' ? 'selected' : ''}>bags</option>
                </select>
                <input type="number" class="receipt-generator-card__input item-unit-price" value="${item.unitPrice}">
                <input type="number" class="receipt-generator-card__input item-quantity" value="${item.quantity}">
                <span class="receipt-generator-card__item-price">₦${(item.quantity * item.unitPrice).toFixed(2)}</span>
                <button class="receipt-generator-card__remove-button" data-index="${index}">
                    <i class="fa-solid fa-trash-can receipt-generator-card__remove-icon"></i>
                </button>
            `;
            itemsContainer.appendChild(itemDiv);
        });

        // Add event listeners to the new remove buttons
        document.querySelectorAll('.receipt-generator-card__remove-button').forEach(button => {
            button.addEventListener('click', function() {
                const indexToRemove = parseInt(this.dataset.index);
                items = items.filter((_, index) => index !== indexToRemove);
                renderItems();
                updateTotals();
            });
        });

        // Add event listeners for input changes in items
        itemsContainer.querySelectorAll('.item-name').forEach((input, index) => {
            input.addEventListener('change', (e) => {
                items[index].name = e.target.value;
            });
        });
        itemsContainer.querySelectorAll('.item-unit').forEach((select, index) => {
            select.addEventListener('change', (e) => {
                items[index].unit = e.target.value;
            });
        });
        itemsContainer.querySelectorAll('.item-unit-price').forEach((input, index) => {
            input.addEventListener('change', (e) => {
                items[index].unitPrice = parseFloat(e.target.value) || 0;
                renderItems(); // Re-render to update price display
                updateTotals();
            });
        });
        itemsContainer.querySelectorAll('.item-quantity').forEach((input, index) => {
            input.addEventListener('change', (e) => {
                items[index].quantity = parseInt(e.target.value) || 1;
                renderItems(); // Re-render to update price display
                updateTotals();
            });
        });
    };

    // Event listener for adding a new item
    addItemBtn.addEventListener('click', () => {
        const itemNameInputs = itemsContainer.querySelectorAll('.item-name');
        const itemUnitSelects = itemsContainer.querySelectorAll('.item-unit');

        if (itemNameInputs.length > 0 && itemNameInputs[itemNameInputs.length - 1].value.trim() === '') {
            alert('Please fill in the item name for the previous item.');
            return;
        }
        if (itemUnitSelects.length > 0 && itemUnitSelects[itemUnitSelects.length - 1].value === '') {
            alert('Please select a unit for the previous item.');
            return;
        }

        items.push({ name: '', unit: 'kg', unitPrice: 0, quantity: 1 });
        renderItems();
        updateTotals();
    });

    // Event listeners for discount and tax rate changes
    discountRateInput.addEventListener('input', updateTotals);
    taxRateInput.addEventListener('input', updateTotals);

    // Event listener for amount paid input
    amountPaidInput.addEventListener('input', updateTotals);

    // Event listener for document type change
    documentTypeSelect.addEventListener('change', () => {
        updateHeader();
        generateDocumentNumber();
    });

// Event listener for generate button
generateBtn.addEventListener('click', () => {
    const docType = documentTypeSelect.value;
    const transactionData = {
        documentType: docType,
        documentNumber: documentNumberInput.value,
        category: categorySelect.value,
        customerName: customerNameInput.value,
        customerPhone: customerPhoneInput.value,
        paymentMethod: paymentMethodSelect.value,
        date: receiptDateInput.value,
        items: items,
        subtotalAmount: calculateSubtotal(),
        discountRate: parseFloat(discountRateInput.value) || 0,
        discountAmount: calculateDiscount(calculateSubtotal()),
        taxRate: parseFloat(taxRateInput.value) || 0,
        taxAmount: calculateTax(calculateSubtotal() - calculateDiscount(calculateSubtotal())),
        totalAmount: parseFloat(totalAmountSpan.textContent.replace('₦', '')) || 0,
        amountPaid: parseFloat(amountPaidInput.value),
        balance: parseFloat(balanceAmountSpan.textContent.replace('₦', '')) || 0
    };
    console.log('Generating Document Data:', transactionData);

    // Store the generated transaction data in local storage
    let pendingTransactions = localStorage.getItem('pendingTransactions');
    pendingTransactions = pendingTransactions ? JSON.parse(pendingTransactions) : [];
    pendingTransactions.push(transactionData);
    localStorage.setItem('pendingTransactions', JSON.stringify(pendingTransactions));

    // Provide feedback to the cashier
    alert(`${docType} generated successfully and is awaiting confirmation.`);

    // Remove the redirection line
    // window.location.href = 'awaiting-confirmation.html';
});

    // Initial setup
    updateHeader();
    generateDocumentNumber();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    receiptDateInput.value = formattedDate;
    renderItems(); // Render initial empty item
    updateTotals();
});