document.addEventListener('DOMContentLoaded', () => {
    const viewIncomeBtn = document.getElementById('viewIncomeBtn');

    if (viewIncomeBtn) {
        viewIncomeBtn.addEventListener('click', () => {
            window.location.href = 'income.html';
        });
    } else {
        console.error("The 'View Income' button with ID 'viewIncomeBtn' was not found.");
    }
});