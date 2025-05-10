// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // --- Define Dynamic Data (Simulated API Responses) ---

    const userProfile = {
        name: "Dexter Okeke",
        greetingName: "Dexter", // Can be different from full name
        farmSize: 10,
        crops: ["Maize", "Cassava"],
        cooperative: "Wonders Cooperative, Abagana",
        profileImageUrl: "assets/farmer-image.jpg" // Path to the image
    };

    // Use current time context provided
    const currentHour = 12; // From context: April 4, 2025 at 12:00 PM
    const location = "Onitsha, Anambra";

    const currentWeather = {
        temperature: 37, // Celsius
        conditionCode: "PARTLY_CLOUDY", // Example condition code
        rainChance: 56, // Percentage
        windSpeed: 1.5, // km/hr
        location: location
    };

    const toolsData = [
        { id: "livestock", iconClass: "bi-calendar-check", text: "Livestock Planner", bgColorClass: "bg-green", url: "animal-records.html" },
        { id: "cropping", iconClass: "bi-flower1", text: "Cropping Planner", bgColorClass: "bg-green", url: "cropping-planner.html" },
        { id: "records", iconClass: "bi-journal-text", text: "Farm Records", bgColorClass: "bg-green", url: "farm-records.html" },
        { id: "receipts", iconClass: "bi-receipt", text: "Receipt Generator", bgColorClass: "bg-green", url: "receipt-generator.html" },
        { id: "expert", iconClass: "bi-telephone", text: "Call an Expert", bgColorClass: "bg-gray", url: "call-expert.html" },
        { id: "market", iconClass: "bi-graph-up", text: "Market Price Tracker", bgColorClass: "bg-yellow", url: "market-tracker.html" },
        { id: "pests", iconClass: "bi-bug", text: "Pest & Disease", bgColorClass: "bg-red", url: "pest-disease.html" },
        { id: "satellite", iconClass: "bi-broadcast-pin", text: "Satellite Data", bgColorClass: "bg-blue", url: "satellite-drone.html" },
        { id: "support", iconClass: "bi-building-check", text: "Gov/NGO Support", bgColorClass: "bg-purple", url: "support-programs.html" },
        { id: "store", iconClass: "bi-shop", text: "Store Management", bgColorClass: "bg-orange", url: "store-management.html" }
    ];

    // --- Render Dynamic Content ---
    renderGreeting(userProfile, currentHour);
    renderWeather(currentWeather);
    renderProfile(userProfile);
    renderTools(toolsData);

    // --- Initialize sidebar functionality ---
    initSidebar();
});

// --- Sidebar Logic ---
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle'); // Corrected ID
    const mainContent = document.getElementById('main-content');

    if (!sidebar || !sidebarToggle || !mainContent) {
        console.error("Sidebar elements not found!");
        return;
    }

    // Function to set the initial state and handle resize
    function setInitialState() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('hidden'); // Hide sidebar
            sidebarToggle.innerHTML = '<i class="bi bi-list"></i>'; // Hamburger icon
            mainContent.style.marginLeft = '0'; // Adjust main content
        } else {
            sidebar.classList.remove('hidden'); // Show sidebar
            sidebarToggle.innerHTML = ''; // Remove icon (or set to a close icon if desired)
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

// --- Header Logic ---
function renderGreeting(user, hour) {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    let timeOfDayGreeting;
    if (hour < 12) {
        timeOfDayGreeting = "Good Morning";
    } else if (hour < 18) {
        timeOfDayGreeting = "Good Afternoon";
    } else {
        timeOfDayGreeting = "Good Evening";
    }
    greetingElement.textContent = `${timeOfDayGreeting}, ${user.greetingName}`;
}

// --- Weather Card Logic ---
function renderWeather(weather) {
    const iconEl = document.getElementById('weather-icon');
    const tempEl = document.getElementById('temperature');
    const rainEl = document.getElementById('rain-chance');
    const windEl = document.getElementById('wind-speed');
    const locationEl = document.getElementById('weather-location');

    if (!iconEl || !tempEl || !rainEl || !windEl || !locationEl) return;

    // Set Icon (using helper function)
    const iconClass = getWeatherIcon(weather.conditionCode);
    iconEl.className = `bi ${iconClass} weather-icon`; // Reset classes and add new one

    // Set Text Content
    tempEl.textContent = `${weather.temperature}°C`;
    rainEl.textContent = `Chance of rain: ${weather.rainChance}%`;
    windEl.textContent = `Wind: ${weather.windSpeed}km/hr`;
    locationEl.textContent = weather.location;
}

function getWeatherIcon(conditionCode) {
    // Simple mapping - expand as needed
    switch (conditionCode) {
        case 'SUNNY': return 'bi-sun-fill';
        case 'PARTLY_CLOUDY': return 'bi-cloud-sun-fill';
        case 'CLOUDY': return 'bi-cloud-fill';
        case 'RAIN': return 'bi-cloud-rain-fill';
        case 'THUNDERSTORM': return 'bi-cloud-lightning-rain-fill';
        case 'WINDY': return 'bi-wind';
        default: return 'bi-thermometer-half'; // Default/unknown icon
    }
}

// --- Profile Card Logic ---
function renderProfile(user) {
    const imgEl = document.getElementById('profile-image');
    const nameEl = document.getElementById('profile-name');
    const detailsEl = document.getElementById('profile-details');
    const coopEl = document.getElementById('profile-coop');

    if (!imgEl || !nameEl || !detailsEl || !coopEl) return;

    imgEl.src = user.profileImageUrl;
    imgEl.alt = `Farmer ${user.name}`; // Update alt text
    nameEl.textContent = user.name;
    detailsEl.textContent = `${user.farmSize}Ha - ${user.crops.join('/')}`;
    coopEl.textContent = user.cooperative;
}

// --- Tools Section Logic ---
function renderTools(tools) {
    const gridEl = document.getElementById('tools-grid');
    if (!gridEl) return;

    gridEl.innerHTML = ''; // Clear existing tools

    // Loop through each tool defined in toolsData
    tools.forEach(tool => {

        // 1. IMPORTANT: Create an ANCHOR element (<a>), not a <div>.
        //    This is the fundamental element for creating links in HTML.
        const cardLink = document.createElement('a');

        // 2. Set the link's DESTINATION using the 'url' from the data.
        //    This tells the browser where to go when the link is clicked.
        cardLink.href = tool.url;

        // 3. Apply CSS classes to make the link LOOK like a styled card.
        //    This doesn't change its function as a link.
        cardLink.className = `card tool-card ${tool.bgColorClass}`;

        // (Optional) Add a data attribute if needed for other JS purposes
        cardLink.setAttribute('data-tool-id', tool.id);
        // (Optional) Uncomment to make links open in a new tab
        // cardLink.target = "_blank";

        // 4. Create the icon and text elements that go *inside* the link.
        const icon = document.createElement('i');
        icon.className = `bi ${tool.iconClass}`;
        const text = document.createTextNode(` ${tool.text}`);

        // 5. Add the icon and text to the link element.
        cardLink.appendChild(icon);
        cardLink.appendChild(text);

        // 6. Add the fully formed link (styled as a card) to the grid on the page.
        gridEl.appendChild(cardLink);

        // NOTE: We don't need a separate .addEventListener('click', ...) here
        //       just for navigation, because standard <a> tags with an href
        //       handle navigation automatically when clicked by the browser.
    });
}