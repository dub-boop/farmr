document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.awaiting-confirmation-page__tab-button');
    const tabContents = document.querySelectorAll('.awaiting-confirmation-page__tab-content');
    const receiptTableBody = document.getElementById('receiptTableBody');
    const invoiceTableBody = document.getElementById('invoiceTableBody');
    const receiptCountSpan = document.getElementById('receiptCount');
    const invoiceCountSpan = document.getElementById('invoiceCount');
    const noReceiptsDiv = document.getElementById('noReceipts');
    const noInvoicesDiv = document.getElementById('noInvoices');
    const detailsModal = document.getElementById('detailsModal');
    const detailsModalClose = document.querySelector('.awaiting-confirmation-page__modal-close');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsModalBody = document.getElementById('detailsModalBody');

    // Retrieve the pending transaction from local storage
    const storedTransaction = localStorage.getItem('pendingTransactions');
    let pendingTransactions = [];
    const storedTransactions = localStorage.getItem('pendingTransactions');
    if (storedTransactions) {
        try {
            pendingTransactions = JSON.parse(storedTransactions);
        } catch (error) {
            console.error("Error parsing pending transactions from local storage:", error);
        }
    }

    let currentTransactions = [...pendingTransactions];

    // Function to update the display of pending transactions
    const updateTransactionDisplay = () => {
        const pendingReceipts = currentTransactions.filter(t => t.documentType === "Receipt");
        const pendingInvoices = currentTransactions.filter(t => t.documentType === "Invoice");

        receiptCountSpan.textContent = pendingReceipts.length;
        invoiceCountSpan.textContent = pendingInvoices.length;

        renderTransactions("receipts", pendingReceipts);
        renderTransactions("invoices", pendingInvoices);
    };

    // Function to render transactions in the table
    const renderTransactions = (type, transactions) => {
        const tableBody = type === "receipts" ? receiptTableBody : invoiceTableBody;
        const noRecordsDiv = type === "receipts" ? noReceiptsDiv : noInvoicesDiv;
        tableBody.innerHTML = '';

        if (transactions.length === 0) {
            noRecordsDiv.style.display = 'block';
        } else {
            noRecordsDiv.style.display = 'none';
            transactions.forEach(transaction => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = transaction.documentType;
                row.insertCell().textContent = transaction.category;
                row.insertCell().textContent = transaction.customerName; // Assuming customerName is the 'Name' field
                row.insertCell().textContent = transaction.date;
                row.insertCell().textContent = `₦${transaction.totalAmount.toLocaleString()}`; // Assuming totalAmount is the 'Total' field
                row.insertCell().textContent = transaction.status;

                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <button class="awaiting-confirmation-page__action-button" data-id="${transaction.id}" data-action="view"><i class="fa-solid fa-eye"></i> View</button>
                    <button class="awaiting-confirmation-page__action-button" data-id="${transaction.id}" data-action="confirm">Confirm</button>
                    <button class="awaiting-confirmation-page__action-button awaiting-confirmation-page__action-button--reject" data-id="${transaction.id}" data-action="reject">Reject</button>
                `;
            });
        }
    };

    // Event listener for tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Event listener for action buttons (View, Confirm, Reject)
    document.querySelectorAll('.awaiting-confirmation-page__table tbody').forEach(tbody => {
        tbody.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'BUTTON' || target.tagName === 'I') {
                const button = target.tagName === 'I' ? target.parentElement : target;
                const action = button.dataset.action;
                const id = parseInt(button.dataset.id);
                const transaction = currentTransactions.find(t => t.id === id);

                if (action === 'view' && transaction) {
                    openDetailsModal(transaction);
                } else if (action === 'confirm' && transaction) {
                    confirmTransaction(id);
                } else if (action === 'reject' && transaction) {
                    rejectTransaction(id);
                }
            }
        });
    });

    // Function to open the details modal
    const openDetailsModal = (transaction) => {
        detailsModalTitle.textContent = `Details for ${transaction.type} - ${transaction.name}`;
        let detailsHtml = '<ul>';
        for (const key in transaction.details) {
            if (typeof transaction.details[key] === 'object' && Array.isArray(transaction.details[key])) {
                detailsHtml += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> <ul>`;
                transaction.details[key].forEach(item => {
                    detailsHtml += `<li>${item.name} (${item.quantity})</li>`;
                });
                detailsHtml += '</ul></li>';
            } else {
                detailsHtml += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${transaction.details[key]}</li>`;
            }
        }
        detailsHtml += '</ul>';
        detailsModalBody.innerHTML = detailsHtml;
        detailsModal.style.display = "block";
    };

    // Function to close the details modal
    detailsModalClose.addEventListener('click', () => {
        detailsModal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === detailsModal) {
            detailsModal.style.display = "none";
        }
    });

// Function to simulate confirming a transaction
const confirmTransaction = (id) => {
    const confirmedTransaction = currentTransactions.find(t => t.id === id);
    if (confirmedTransaction) {
        if (confirmedTransaction.documentType === "Receipt") {
            // Retrieve existing income records from local storage
            const storedIncomeRecords = localStorage.getItem('incomeRecords');
            let incomeRecords = storedIncomeRecords ? JSON.parse(storedIncomeRecords) : [];

            // Add the confirmed transaction to the income records
            incomeRecords.push(confirmedTransaction);

            // Store the updated income records back in local storage
            localStorage.setItem('incomeRecords', JSON.stringify(incomeRecords));

            // Remove the transaction from current pending transactions
            currentTransactions = currentTransactions.filter(t => t.id !== id);
            updateTransactionDisplay();
            alert(`Receipt with ID ${id} confirmed and moved to income.`);
        } else if (confirmedTransaction.documentType === "Invoice") {
            // You would handle confirmed invoices differently (e.g., move to expenditure)
            alert(`Invoice with ID ${id} confirmed (handling not fully implemented).`);
            currentTransactions = currentTransactions.filter(t => t.id !== id);
            updateTransactionDisplay();
        }
    }
};

    // Function to simulate rejecting a transaction
    const rejectTransaction = (id) => {
        const rejectedTransaction = currentTransactions.find(t => t.id === id);
        if (rejectedTransaction) {
            const reason = prompt("Enter the reason for rejection:");
            if (reason) {
                rejectedTransaction.rejectionReason = reason;
                let rejectedTransactions = JSON.parse(localStorage.getItem('rejectedTransactions')) || [];
                rejectedTransactions.push(rejectedTransaction);
                localStorage.setItem('rejectedTransactions', JSON.stringify(rejectedTransactions));

                currentTransactions = currentTransactions.filter(t => t.id !== id);
                updateTransactionDisplay();
                alert(`Transaction with ID ${id} rejected. Reason stored.`);
            } else {
                alert("Rejection reason is required.");
            }
        }
    };

    // Initial display
    updateTransactionDisplay();
});