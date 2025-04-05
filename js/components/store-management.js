document.addEventListener('DOMContentLoaded', () => {
    const manageInputsBtn = document.getElementById('manageInputsBtn');
    const manageToolsBtn = document.getElementById('manageToolsBtn');
    const manageProduceBtn = document.getElementById('manageProduceBtn');
    // const viewPendingBtn = document.getElementById('viewPendingBtn'); // Removed as it's now an <a> tag
    const pendingCountBadge = document.getElementById('pendingCountBadge');

    // Function to get the number of pending transactions (replace with your actual logic)
    const getPendingCount = () => {
        // For demonstration, let's assume we have 4 pending transactions
        // In a real application, you would fetch this from your data source
        return 4;
    };

    // Update the badge with the pending count
    const updatePendingCountBadge = () => {
        const pendingCount = getPendingCount();
        pendingCountBadge.textContent = pendingCount > 0 ? pendingCount : ''; // Show count if > 0
        // Optionally, you can also hide the badge if the count is zero
        pendingCountBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    };

    // Call the function to update the badge when the page loads
    updatePendingCountBadge();

    manageInputsBtn.addEventListener('click', () => {
        console.log('Navigate to Inputs Inventory Management');
        // In a real application, you would handle navigation here.
    });

    manageToolsBtn.addEventListener('click', () => {
        console.log('Navigate to Tools & Equipment Management');
        // In a real application, you would handle navigation here.
    });

    manageProduceBtn.addEventListener('click', () => {
        console.log('Navigate to Produce Inventory Management');
        // In a real application, you would handle navigation here.
    });

    // Removed the event listener for viewPendingBtn
    // viewPendingBtn.addEventListener('click', () => {
    //     console.log('Navigate to Awaiting Confirmation');
    //     alert('Navigating to Awaiting Confirmation (Simulated)');
    //     // In a real application, you would handle navigation here, likely to the awaiting-confirmation.html page.
    // });
});