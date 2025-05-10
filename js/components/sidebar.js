const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarNav = document.getElementById('sidebarNav');

const navigationItems = [
    { icon: 'fa-solid fa-tractor', text: 'Dashboard' },
    { icon: 'fa-solid fa-cloud-sun', text: 'My Farm' },
    { icon: 'fa-solid fa-bell', text: 'Weather' },
    { icon: 'fa-solid fa-gear', text: 'Cooperatives' },
];

function renderSidebarNav() {
    const navItemsHTML = navigationItems.map(item => `
        <button class="sidebar__nav-item">
            <i class="<span class="math-inline">\{item\.icon\}"\></i\> <span\></span>{item.text}</span>
        </button>
    `).join('');
    sidebarNav.innerHTML = navItemsHTML;
}

export function initializeSidebar() {
    renderSidebarNav();

    sidebarToggleBtn.addEventListener('click', () => {
        console.log('Sidebar toggle button clicked!');
        sidebar.classList.toggle('sidebar--collapsed');
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('sidebar--open');
            const isOpen = sidebar.classList.contains('sidebar--open');
            sidebarToggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        } else {
            const isCollapsed = sidebar.classList.contains('sidebar--collapsed');
            sidebarToggleBtn.innerHTML = isCollapsed ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
        }
    });

    // Initial mobile setup
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('sidebar--collapsed');
        sidebarToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.querySelector('.header__icons .header__icon:last-child').addEventListener('click', () => {
            sidebar.classList.toggle('sidebar--open');
        });
    } else {
        sidebar.classList.add('sidebar--open'); // Ensure open on desktop initially
    }

    document.addEventListener("DOMContentLoaded", () => {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
        const isOpen = !sidebar.classList.contains("hidden");
        sidebarToggle.innerHTML = isOpen ? '<i class="bi bi-x"></i>' : '<i class="bi bi-list"></i>';
    });
});
}