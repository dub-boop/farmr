const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle'); // Corrected ID
const mainContent = document.getElementById('main-content'); // Added mainContent
const sidebarNav = document.getElementById('sidebarNav');

const navigationItems = [
    { icon: 'bi bi-grid-1x2-fill', text: 'Dashboard' }, // Updated icon class
    { icon: 'bi bi-tractor', text: 'My Farm' }, // Updated icon class
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

    // Function to set the initial state and handle resize
    function setInitialState() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden'); // Hide sidebar
            sidebarToggle.innerHTML = '<i class="bi bi-list"></i>'; // Hamburger icon
            mainContent.style.marginLeft = '0'; // Adjust main content
        } else {
            sidebar.classList.remove('hidden'); // Show sidebar
            sidebarToggle.innerHTML = '<i class="bi bi-x"></i>'; // Close icon (optional)
            mainContent.style.marginLeft = 'var(--sidebar-width-expanded)'; // Adjust main content
        }
    }

    // Set initial state on page load
    setInitialState();

    // Handle sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        const isOpen = !sidebar.classList.contains('hidden');
        sidebarToggle.innerHTML = isOpen ? '<i class="bi bi-x"></i>' : '<i class="bi bi-list"></i>';

        // Adjust main content margin dynamically
        if (isOpen) {
            mainContent.style.marginLeft = 'var(--sidebar-width-expanded)';
        } else {
            mainContent.style.marginLeft = '0';
        }
    });

    // Handle window resize
    window.addEventListener('resize', setInitialState);
}

// Initialize the sidebar
document.addEventListener('DOMContentLoaded', initializeSidebar);