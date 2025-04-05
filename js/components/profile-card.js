const profileCardElement = document.getElementById('profileCard');

export function renderProfileCard(data) {
    profileCardElement.innerHTML = `
        <img src="${data.image}" alt="Farmer" class="profile-card__image">
        <h3 class="profile-card__name">${data.name}</h3>
        <p class="profile-card__details">${data.details}</p>
        <p class="profile-card__cooperative">${data.cooperative}</p>
        <button class="view-button">View</button>
    `;
}