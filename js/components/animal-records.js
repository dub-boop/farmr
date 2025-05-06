// js/components/animal-records.js
document.addEventListener('DOMContentLoaded', () => {
    const livestockDropdownButton = document.getElementById('livestockDropdownButton');
    const livestockDropdownList = document.getElementById('livestockDropdownList');
    const selectedLivestockText = document.getElementById('selectedLivestockText');

    const poultryRecordsSection = document.querySelector('.poultry-records-section');
    const eggProductionSection = document.querySelector('.egg-production-section');
    const livestockRecordsSection = document.querySelector('.livestock-records-section');
    const breedingHealthSection = document.querySelector('.breeding-health-section');

    // Get button references
    const viewPoultryRecordsBtn = document.getElementById('viewPoultryRecordsBtn');
    const viewEggProductionBtn = document.getElementById('viewEggProductionBtn');
    const viewLivestockRecordsBtn = document.getElementById('viewLivestockRecordsBtn');
    const manageHealthBreedingBtn = document.getElementById('manageHealthBreedingBtn');


    const livestockTypes = ["All", "Cattle", "Chicken", "Turkey", "Goats", "Sheep", "Pig"];

    let selectedLivestock = "All";
    let isDropdownOpen = false;

    // Function to render the dropdown list items
    function renderDropdownList() {
        livestockDropdownList.innerHTML = '';
        livestockTypes.forEach(type => {
            const listItem = document.createElement('li');
            listItem.textContent = type;
            listItem.classList.add('animal-records-page__dropdown-list-item'); // Add a class for styling and events
            listItem.dataset.type = type; // Store the livestock type in a data attribute
            livestockDropdownList.appendChild(listItem);
        });
    }

    // Function to update the displayed cards based on selected livestock
    function updateDisplayedCards() {
        // Hide all sections first
        poultryRecordsSection.style.display = 'none';
        eggProductionSection.style.display = 'none';
        livestockRecordsSection.style.display = 'none';
        breedingHealthSection.style.display = 'none';

        if (selectedLivestock === "Chicken" || selectedLivestock === "Turkey") {
            // Show poultry sections
            poultryRecordsSection.style.display = 'block'; // Or 'flex', 'grid' as per your CSS
            eggProductionSection.style.display = 'block'; // Or 'flex', 'grid' as per your CSS
        } else if (selectedLivestock !== "All") {
             // Show general livestock sections if a specific type (not poultry) is selected
            livestockRecordsSection.style.display = 'block'; // Or 'flex', 'grid'
            breedingHealthSection.style.display = 'block'; // Or 'flex', 'grid'
        } else {
             // Show both livestock and poultry sections if "All" is selected
             livestockRecordsSection.style.display = 'block'; // Or 'flex', 'grid'
             breedingHealthSection.style.display = 'block'; // Or 'flex', 'grid'
             poultryRecordsSection.style.display = 'block'; // Also show poultry sections for "All"
             eggProductionSection.style.display = 'block';
        }
         // Note: The grid layout in HTML will handle positioning of visible cards.
    }

    // --- Event Listeners ---

    // Toggle dropdown visibility
    livestockDropdownButton.addEventListener('click', (event) => {
         event.stopPropagation(); // Prevent click from immediately closing dropdown via document listener
         isDropdownOpen = !isDropdownOpen;
         livestockDropdownList.style.display = isDropdownOpen ? 'block' : 'none';
    });

    // Select livestock type from dropdown list (using event delegation)
    livestockDropdownList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'LI') {
            const type = target.dataset.type;
            selectedLivestock = type;
            selectedLivestockText.textContent = type;
            isDropdownOpen = false;
            livestockDropdownList.style.display = 'none';
            updateDisplayedCards(); // Update cards when selection changes
        }
    });

     // Close dropdown if clicked outside
     document.addEventListener('click', (event) => {
         const isClickInsideDropdown = livestockDropdownButton.contains(event.target) || livestockDropdownList.contains(event.target);
         if (!isClickInsideDropdown && isDropdownOpen) {
             isDropdownOpen = false;
             livestockDropdownList.style.display = 'none';
         }
     });

    // Event listener for "View Poultry Records" button
    if (viewPoultryRecordsBtn) {
        viewPoultryRecordsBtn.addEventListener('click', () => {
            window.location.href = `livestock-records.html?type=${selectedLivestock}`;
        });
    }

     // Event listener for "Monitor Egg Production" button (optional, link to a specific page or handle differently)
    if (viewEggProductionBtn) {
        viewEggProductionBtn.addEventListener('click', () => {
             window.location.href = `livestock-records.html?type=${selectedLivestock}&section=egg-production`; // Example: pass type and section
        });
    }

    // Event listener for "View Livestock Records" button
    if (viewLivestockRecordsBtn) {
        viewLivestockRecordsBtn.addEventListener('click', () => {
            window.location.href = `livestock-records.html?type=${selectedLivestock}`;
        });
    }

     // Event listener for "Manage Health & Breeding" button (optional, link to a specific page or handle differently)
    if (manageHealthBreedingBtn) {
        manageHealthBreedingBtn.addEventListener('click', () => {
             window.location.href = `livestock-records.html?type=${selectedLivestock}&section=health-breeding`; // Example: pass type and section
        });
    }


    // --- Initial Load ---
    renderDropdownList(); // Render the dropdown list items on page load
    updateDisplayedCards(); // Display initial cards based on default selection ("All")
});