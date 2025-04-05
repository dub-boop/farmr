// income.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const filterButton = document.getElementById('filterButton');
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    const incomeTableBody = document.getElementById('incomeTableBody');
    const totalIncomeSpan = document.getElementById('totalIncome');
    const noDataMessage = document.getElementById('noDataMessage');
    const exportButton = document.getElementById('exportButton');
    const tableHeaders = document.querySelectorAll('.income-page__table th[data-sort]');

    // Load income records from local storage
    const storedIncomeRecords = localStorage.getItem('incomeRecords');
    let allTransactions = storedIncomeRecords ? JSON.parse(storedIncomeRecords) : [];
    let filteredTransactions = [...allTransactions];
    let sortColumn = null;
    let sortDirection = 'asc';

    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const calculateTotalIncome = (transactions) => {
        return transactions.reduce((acc, t) => acc + t.total, 0).toFixed(2);
    };

    const renderTable = (transactions) => {
        incomeTableBody.innerHTML = '';
        totalIncomeSpan.textContent = formatCurrency(calculateTotalIncome(transactions));

        if (transactions.length === 0) {
            noDataMessage.style.display = 'block';
            return;
        } else {
            noDataMessage.style.display = 'none';
        }

        transactions.forEach(transaction => {
            const row = incomeTableBody.insertRow();
            row.insertCell().textContent = transaction.date;
            row.insertCell().textContent = transaction.customer;
            row.insertCell().textContent = formatCurrency(transaction.total);
            row.insertCell().textContent = transaction.payment;
            const itemsCell = row.insertCell();
            itemsCell.textContent = transaction.items ? transaction.items.map(item => `${item.item} (${item.quantity} ${item.unit})`).join(', ') : ''; // Handle cases where items might be undefined
            const actionsCell = row.insertCell();
            actionsCell.classList.add('actions-cell');
            actionsCell.innerHTML = `
                <i class="fa-solid fa-eye" title="View Details"></i>
                <i class="fa-solid fa-print" title="Print"></i>
            `;
        });
    };

    const filterTransactions = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        filteredTransactions = allTransactions.filter(t => {
            const searchMatch =
                t.customer.toLowerCase().includes(searchTerm) ||
                t.payment.toLowerCase().includes(searchTerm) ||
                (t.items && t.items.some(item => item.item.toLowerCase().includes(searchTerm))); // Handle cases where items might be undefined

            const dateMatch = (!startDate || new Date(t.date) >= new Date(startDate)) &&
                              (!endDate || new Date(t.date) <= new Date(endDate));

            return searchMatch && dateMatch;
        });

        renderTable(filteredTransactions);
    };

    const clearFilters = () => {
        searchInput.value = '';
        startDateInput.value = '';
        endDateInput.value = '';
        filteredTransactions = [...allTransactions];
        renderTable(filteredTransactions);
    };

    const sortTable = (column) => {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        tableHeaders.forEach(th => th.classList.remove('sorted', 'asc', 'desc'));
        const currentHeader = document.querySelector(`.income-page__table th[data-sort="${column}"]`);
        if (currentHeader) {
            currentHeader.classList.add('sorted', sortDirection);
        }

        filteredTransactions.sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            if (typeof aValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });

        renderTable(filteredTransactions);
    };

    const exportCSV = () => {
        const header = ["Date", "Customer", "Total Paid", "Payment Method", "Items"];
        const csvRows = [header.join(',')];

        filteredTransactions.forEach(transaction => {
            const items = transaction.items ? transaction.items.map(item => `${item.item} (${item.quantity} ${item.unit})`).join('; ') : ''; // Handle cases where items might be undefined
            const row = [transaction.date, transaction.customer, transaction.total, transaction.payment, items];
            csvRows.push(row.join(','));
        });

        const csvData = csvRows.join('\n');
        const filename = 'income_records.csv';
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Event listeners
    searchInput.addEventListener('input', filterTransactions);
    filterButton.addEventListener('click', filterTransactions);
    clearFiltersButton.addEventListener('click', clearFilters);
    exportButton.addEventListener('click', exportCSV);
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => sortTable(header.dataset.sort));
    });

    // Initial render
    renderTable(filteredTransactions);
});