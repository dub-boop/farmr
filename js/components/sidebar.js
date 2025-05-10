const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle'); // Corrected ID
const mainContent = document.getElementById('main-content'); // Added mainContent
const sidebarNav = document.getElementById('sidebarNav');

const navigationItems = [
    { icon: 'bi bi-house', text: 'Farm House' }, // Updated icon class
    { icon: 'bi bi-person-circle', text: 'User Profile' }, // Updated icon class
    { icon: 'bi bi-cloud-sun', text: 'Weather' }, // Updated icon class
    { icon: 'bi bi-people', text: 'Cooperatives' }, // Updated icon class
];

function renderSidebarNav() {
    const navItemsHTML = navigationItems.map(item => `
        <a href="#" class="nav-link">
            <i class="${item.icon}"></i> <span>${item.text}</span>
        </a>
    `).join('');
    sidebarNav.innerHTML = navItemsHTML;
}

function initializeSidebar() {
    renderSidebarNav();


    // Set initial state on page load
    setInitialState();

    // Handle sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        const isOpen = !sidebar.classList.contains('hidden');
        sidebarToggle.innerHTML = isOpen ? (isOpen ? '<i class="bi bi-list"></i>' : '<i class="bi bi-x"></i>') : (isOpen ? '<i class="bi bi-list"></i>' : '<i class="bi bi-x"></i>');

        // Adjust main content margin dynamically
        if (isOpen) {
            mainContent.style.marginLeft = '0';
        } else {
            mainContent.style.marginLeft = '0';
        }
    });

    // Handle window resize
    window.addEventListener('resize', setInitialState);
}

// Initialize the sidebar
document.addEventListener('DOMContentLoaded', initializeSidebar);