const headerElement = document.getElementById('header');

export function renderHeader(title) {
    headerElement.innerHTML = `
        <h2 class="header__title">${title}</h2>
        <div class="header__icons">
            <i class="fa-solid fa-bell header__icon"></i>
            <i class="fa-solid fa-gear header__icon"></i>
        </div>
    `;
}