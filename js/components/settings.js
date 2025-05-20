// js/components/settings.js
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Profile
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userPasswordInput = document.getElementById('userPassword');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    // Business Profile
    const businessNameInput = document.getElementById('businessName');
    const businessEmailInput = document.getElementById('businessEmail');
    const businessPhoneInput = document.getElementById('businessPhone');
    const businessAddressInput = document.getElementById('businessAddress');
    const businessLogoInput = document.getElementById('businessLogo');
    const saveBusinessBtn = document.getElementById('saveBusinessBtn');

    // Farm Preferences
    const farmLocationInput = document.getElementById('farmLocation');
    const measurementUnitsInput = document.getElementById('measurementUnits');
    const savePreferencesBtn = document.getElementById('savePreferencesBtn');

    // Notifications
    const emailAlertsSwitch = document.getElementById('emailAlertsSwitch');
    const smsAlertsSwitch = document.getElementById('smsAlertsSwitch');

    // Theme
    const darkModeSwitch = document.getElementById('darkModeSwitch');

    // Team Management
    const teamMemberEmailInput = document.getElementById('teamMemberEmail');
    const teamMemberRoleSelect = document.getElementById('teamMemberRole');
    const permissionsCheckboxesDiv = document.getElementById('permissionsCheckboxes');
    const addTeamMemberBtn = document.getElementById('addTeamMemberBtn');
    const teamMembersListUl = document.getElementById('teamMembersList');

    // Account Actions
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- Data and State ---
    const APP_SECTIONS = [
        "Cropping Planner", "Livestock Planner", "Settings", "Receipt Generator",
        "Pest & Disease", "Satellite Data", "Store Management", "Call Expert",
        "Market Price Tracker", "Gov/NGO Support"
    ];

    const ROLE_ACCESS = {
        Admin: [...APP_SECTIONS],
        "Field Officer": ["Cropping Planner", "Livestock Planner", "Pest & Disease"],
        Agronomist: ["Cropping Planner", "Pest & Disease", "Satellite Data"],
        Cashier: ["Receipt Generator"],
        "Livestock-Officer": ["Livestock Planner"],
        "Store-Manager": ["Store Management"]
    };

    let settingsState = {
        profile: { name: "", email: "", password: "" },
        business: { name: "", address: "", phone: "", email: "", logo: null },
        preferences: { location: "", units: "" },
        notifications: { emailAlerts: true, smsAlerts: false },
        theme: { darkMode: false },
        team: {
            teamMembers: [],
            teamMemberForm: { email: "", role: "Field Officer", customAccess: [] } // Form state for adding new member
        }
    };

    // --- Local Storage ---
    const localStorageKey = 'farmAppSettings';

    function loadSettingsFromLocalStorage() {
        const data = localStorage.getItem(localStorageKey);
        if (data) {
            try {
                settingsState = JSON.parse(data);
                // Handle non-string values if necessary (like boolean toggles)
                 settingsState.notifications.emailAlerts = Boolean(settingsState.notifications.emailAlerts);
                 settingsState.notifications.smsAlerts = Boolean(settingsState.notifications.smsAlerts);
                 settingsState.theme.darkMode = Boolean(settingsState.theme.darkMode);
                 // Ensure team.teamMembers is an array
                 if (!Array.isArray(settingsState.team.teamMembers)) {
                     settingsState.team.teamMembers = [];
                 }
                  // Initialize custom access for the form based on the default role
                 settingsState.team.teamMemberForm.customAccess = ROLE_ACCESS[settingsState.team.teamMemberForm.role] || [];

            } catch (e) {
                console.error("Failed to load settings from localStorage:", e);
                // Optionally reset to default state if localStorage is invalid
                 // settingsState = { ...defaultSettingsState };
            }
        } else {
             // Initialize custom access for the form if no data in local storage
             settingsState.team.teamMemberForm.customAccess = ROLE_ACCESS["Field Officer"] || [];
        }
         applySettingsToUI(); // Apply loaded settings to the UI
    }

    function saveSettingsToLocalStorage() {
        localStorage.setItem(localStorageKey, JSON.stringify(settingsState));
    }

    // --- Apply Settings to UI ---
    function applySettingsToUI() {
        // Profile
        userNameInput.value = settingsState.profile.name;
        userEmailInput.value = settingsState.profile.email;
        // Password is not usually pre-filled

        // Business Profile
        businessNameInput.value = settingsState.business.name;
        businessEmailInput.value = settingsState.business.email;
        businessPhoneInput.value = settingsState.business.phone;
        businessAddressInput.value = settingsState.business.address;
        // Logo file input cannot be pre-filled for security reasons

        // Farm Preferences
        farmLocationInput.value = settingsState.preferences.location;
        measurementUnitsInput.value = settingsState.preferences.units;

        // Notifications
        emailAlertsSwitch.checked = settingsState.notifications.emailAlerts;
        smsAlertsSwitch.checked = settingsState.notifications.smsAlerts;

        // Theme
        darkModeSwitch.checked = settingsState.theme.darkMode;
        // Apply dark mode class to body or relevant element
        if (settingsState.theme.darkMode) {
            document.body.classList.add('dark-mode'); // Assuming you have a dark-mode CSS class
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Team Management
        teamMemberEmailInput.value = settingsState.team.teamMemberForm.email;
        teamMemberRoleSelect.value = settingsState.team.teamMemberForm.role;
        renderPermissionsCheckboxes(); // Render checkboxes based on current form role/custom access
        renderTeamMembersList(); // Render the list of current team members
    }


    // --- Team Management Functions ---
    function populateRoleSelect() {
        teamMemberRoleSelect.innerHTML = '';
        Object.keys(ROLE_ACCESS).forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            teamMemberRoleSelect.appendChild(option);
        });
    }

    function renderPermissionsCheckboxes() {
        permissionsCheckboxesDiv.innerHTML = '';
        APP_SECTIONS.forEach(section => {
            const label = document.createElement('label');
            label.classList.add('settings-page__permission-label'); // Add class for styling
            label.innerHTML = `
                <input type="checkbox" class="permission-checkbox" value="${section}" ${settingsState.team.teamMemberForm.customAccess.includes(section) ? 'checked' : ''}>
                ${section}
            `;
            permissionsCheckboxesDiv.appendChild(label);
        });
         attachPermissionCheckboxListeners(); // Attach listeners after rendering
    }

    function attachPermissionCheckboxListeners() {
         permissionsCheckboxesDiv.querySelectorAll('.permission-checkbox').forEach(checkbox => {
             checkbox.addEventListener('change', (event) => {
                 const section = event.target.value;
                 toggleAccess(section); // Update state
             });
         });
    }


    function toggleAccess(section) {
        const currentAccess = settingsState.team.teamMemberForm.customAccess;
        if (currentAccess.includes(section)) {
            settingsState.team.teamMemberForm.customAccess = currentAccess.filter(s => s !== section);
        } else {
            settingsState.team.teamMemberForm.customAccess = [...currentAccess, section];
        }
         // Note: In React, setting state triggers re-render. Here, we need to manually update the UI if needed,
         // but since we re-render checkboxes after role change, this might be enough for custom selection UI feedback.
         // If you need real-time checkbox update when toggleAccess is called outside of role change,
         // you might need to call renderPermissionsCheckboxes() again.
         console.log("Custom Access:", settingsState.team.teamMemberForm.customAccess); // For debugging
    }


    function renderTeamMembersList() {
        teamMembersListUl.innerHTML = '';
        if (settingsState.team.teamMembers.length === 0) {
            teamMembersListUl.innerHTML = '<li>No team members added yet.</li>';
            return;
        }

        settingsState.team.teamMembers.forEach((member, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                 <div class="settings-page__team-member-header">
                     <span class="settings-page__team-member-email">${member.email}</span>
                     <span class="settings-page__team-member-role">${member.role}</span>
                 </div>
                 ${member.access && member.access.length > 0 ?
                    `<ul class="settings-page__team-access-list">
                         ${member.access.map(section => `<li>${section}</li>`).join('')}
                     </ul>`
                    : '<p class="ml-4 text-sm text-gray-600">No specific access assigned.</p>'
                 }
                 ${/* Optional: Add delete button */ ''}
                 <button class="settings-page__button settings-page__button--destructive settings-page__button--small delete-member-btn" data-index="${index}" style="margin-top: 10px;">Delete</button>

            `;
            teamMembersListUl.appendChild(listItem);
        });
         attachDeleteMemberButtonListeners(); // Attach listeners
    }

    function attachDeleteMemberButtonListeners() {
         teamMembersListUl.querySelectorAll('.delete-member-btn').forEach(button => {
             button.addEventListener('click', (event) => {
                 const index = parseInt(event.target.dataset.index);
                 deleteTeamMember(index);
             });
         });
    }

    function deleteTeamMember(index) {
        if (confirm(`Are you sure you want to remove ${settingsState.team.teamMembers[index].email} from the team?`)) {
            settingsState.team.teamMembers.splice(index, 1); // Remove member at index
            saveSettingsToLocalStorage(); // Save changes
            renderTeamMembersList(); // Re-render the list
        }
    }


    // --- Event Listeners ---

    // Profile Save
    saveProfileBtn.addEventListener('click', () => {
        settingsState.profile.name = userNameInput.value;
        settingsState.profile.email = userEmailInput.value;
        settingsState.profile.password = userPasswordInput.value; // Note: Saving password in localStorage is insecure
        saveSettingsToLocalStorage();
        alert("Profile saved!");
    });

    // Business Save
    saveBusinessBtn.addEventListener('click', () => {
        settingsState.business.name = businessNameInput.value;
        settingsState.business.email = businessEmailInput.value;
        settingsState.business.phone = businessPhoneInput.value;
        settingsState.business.address = businessAddressInput.value;
        // Handle logo file (e.g., upload to server) - not saving file object to localStorage directly
        // if (businessLogoInput.files.length > 0) {
        //    settingsState.business.logo = businessLogoInput.files[0].name; // Example: save filename
        //    // Implement file upload logic here
        // } else {
        //     settingsState.business.logo = null; // Or keep existing if not uploading new
        // }

        saveSettingsToLocalStorage();
        alert("Business info saved!");
    });

    // Preferences Save
    savePreferencesBtn.addEventListener('click', () => {
        settingsState.preferences.location = farmLocationInput.value;
        settingsState.preferences.units = measurementUnitsInput.value;
        saveSettingsToLocalStorage();
        alert("Preferences saved!");
    });

    // Notifications Toggle
    emailAlertsSwitch.addEventListener('change', (event) => {
        settingsState.notifications.emailAlerts = event.target.checked;
        saveSettingsToLocalStorage();
        console.log("Email Alerts:", settingsState.notifications.emailAlerts);
    });
    smsAlertsSwitch.addEventListener('change', (event) => {
        settingsState.notifications.smsAlerts = event.target.checked;
        saveSettingsToLocalStorage();
        console.log("SMS Alerts:", settingsState.notifications.smsAlerts);
    });

    // Theme Toggle (Dark Mode)
    darkModeSwitch.addEventListener('change', (event) => {
        settingsState.theme.darkMode = event.target.checked;
        if (settingsState.theme.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        saveSettingsToLocalStorage();
        console.log("Dark Mode:", settingsState.theme.darkMode);
    });

    // Team Member Form Input Changes (Manual binding)
    teamMemberEmailInput.addEventListener('input', (event) => {
        settingsState.team.teamMemberForm.email = event.target.value;
    });
    teamMemberRoleSelect.addEventListener('change', (event) => {
        settingsState.team.teamMemberForm.role = event.target.value;
        // Update custom access based on the selected role's default permissions
        settingsState.team.teamMemberForm.customAccess = ROLE_ACCESS[settingsState.team.teamMemberForm.role] || [];
        renderPermissionsCheckboxes(); // Re-render checkboxes to reflect default access for the new role
    });

    // Add Team Member Button
    addTeamMemberBtn.addEventListener('click', () => {
        const email = settingsState.team.teamMemberForm.email.trim();
        const role = settingsState.team.teamMemberForm.role;
        const access = [...settingsState.team.teamMemberForm.customAccess]; // Copy access array

        if (!email) {
            alert("Please enter a team member email.");
            return;
        }

        const newMember = { email, role, access };
        settingsState.team.teamMembers.push(newMember); // Add to team members array

        // Reset form state
        settingsState.team.teamMemberForm.email = "";
        settingsState.team.teamMemberForm.role = "Field Officer"; // Reset role to default
         settingsState.team.teamMemberForm.customAccess = ROLE_ACCESS["Field Officer"] || []; // Reset custom access

        saveSettingsToLocalStorage(); // Save changes
        applySettingsToUI(); // Re-render necessary parts of the UI (form and list)
        alert(`${email} added to the team.`);
    });


    // Delete Account (Placeholder)
    deleteAccountBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deletion initiated (placeholder).");
            // Implement actual account deletion logic (API call)
        }
    });

    // Log Out (Placeholder)
    logoutBtn.addEventListener('click', () => {
        alert("Logging out (placeholder).");
        // Implement actual logout logic (clear session, redirect)
    });


    // --- Initial Load ---
    populateRoleSelect(); // Populate roles dropdown first
    loadSettingsFromLocalStorage(); // Load settings and apply to UI
    
});