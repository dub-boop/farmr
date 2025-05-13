// js/components/cropping-planner.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    const toggleViewText = document.getElementById('toggleViewText');
    const tableView = document.getElementById('tableView');
    const calendarView = document.getElementById('calendarView');
    const addPlanBtn = document.getElementById('addPlanBtn');
    const cropPlanTableBody = document.getElementById('cropPlanTableBody');
    const cropPlanCalendar = document.getElementById('cropPlanCalendar');

    const filterFieldSelect = document.getElementById('filterField');
    const filterCropSelect = document.getElementById('filterCrop');
    const filterSeasonSelect = document.getElementById('filterSeason');

    // Modal elements
    const cropPlanModal = document.getElementById('cropPlanModal');
    const modalTitle = document.getElementById('modalTitle');
    const cropPlanForm = document.getElementById('cropPlanForm');
    const savePlanBtn = document.getElementById('savePlanBtn');
    const cancelPlanBtn = document.getElementById('cancelPlanBtn');
    const closeModalButton = cropPlanModal.querySelector('.close-button');
    const modalErrorMessageDiv = document.getElementById('modalErrorMessage');


    // Form input elements
    const modalFieldInput = document.getElementById('modalField');
    const modalCropInput = document.getElementById('modalCrop');
    const modalVarietyInput = document.getElementById('modalVariety');
    const modalPlantingDateInput = document.getElementById('modalPlantingDate');
    const modalHarvestDateInput = document.getElementById('modalHarvestDate');
    const modalDurationInput = document.getElementById('modalDuration');
    const modalWaterNeedsSelect = document.getElementById('modalWaterNeeds');
    const modalFertilizerInput = document.getElementById('modalFertilizer');
    const modalSeasonSelect = document.getElementById('modalSeason');


    // Initial dummy data (will be replaced by localStorage)
    let cropPlans = [
        {
            id: 1, field: "Field A", crop: "Maize", variety: "Hybrid 1", plantingDate: "2025-03-15", harvestDate: "2025-06-30", duration: "", // Duration will be calculated
            waterNeeds: "Moderate", fertilizer: ["2025-03-30", "2025-04-30"], season: "Dry"
        },
        {
            id: 2, field: "Field B", crop: "Cassava", variety: "Local", plantingDate: "2025-04-01", harvestDate: "2025-09-10", duration: "", // Duration will be calculated
            waterNeeds: "Low", fertilizer: ["2025-05-01"], season: "Rainy"
        }
    ];

    let currentView = 'table'; // 'table' or 'calendar'
    let modalMode = 'add'; // 'add', 'edit', or 'view'
    let selectedPlanId = null; // ID of the plan being edited/viewed

    // --- Local Storage ---
    const localStorageKey = 'croppingPlannerData';

    function loadFromLocalStorage() {
        const data = localStorage.getItem(localStorageKey);
        if (data) {
            try {
                 cropPlans = JSON.parse(data);
                 // Recalculate duration on load in case dates changed externally
                 cropPlans.forEach(plan => {
                     if (plan.plantingDate && plan.harvestDate) {
                         const start = new Date(plan.plantingDate);
                         const end = new Date(plan.harvestDate);
                         const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                         plan.duration = `${diff} days`;
                     } else {
                         plan.duration = '';
                     }
                 });
            } catch (e) {
                console.error("Failed to parse data from localStorage:", e);
                // Optionally reset to initial data if localStorage is invalid
                 // cropPlans = [...initialCropPlans];
            }
        }
         // Ensure duration is calculated for initial dummy data as well if localStorage is empty
         cropPlans.forEach(plan => {
             if (plan.plantingDate && plan.harvestDate && !plan.duration) {
                 const start = new Date(plan.plantingDate);
                 const end = new Date(plan.harvestDate);
                 const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                 plan.duration = `${diff} days`;
             }
         });

    }

    function saveToLocalStorage() {
        localStorage.setItem(localStorageKey, JSON.stringify(cropPlans));
    }

    // --- Status Calculation ---
    const getStatus = (plantingDate, harvestDate) => {
        if (!plantingDate || !harvestDate) return "Unknown";
        const today = new Date();
        const plantDate = new Date(plantingDate);
        const harvest = new Date(harvestDate);
        // Set times to midnight for accurate date comparison
        today.setHours(0,0,0,0);
        plantDate.setHours(0,0,0,0);
        harvest.setHours(0,0,0,0);


        if (today > harvest) return "Harvested";
        if (plantDate > today) return "Pending";
        return "Active";
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case "Active": return "status-active";
            case "Pending": return "status-pending";
            case "Harvested": return "status-harvested";
            default: return ""; // No specific class for unknown
        }
    };

    // --- Filtering ---
    function getUniqueValues(key) {
         // Use cropPlans directly, not filteredPlans, to get all unique values
         const allValues = cropPlans.map(p => p[key]);
         // Filter out empty strings or undefined if necessary
         const unique = Array.from(new Set(allValues.filter(value => value && value !== "")));
         return ["all", ...unique];
    }

    function populateFilterOptions() {
         const fields = getUniqueValues('field');
         const crops = getUniqueValues('crop');
         const seasons = ['all', 'Dry', 'Rainy']; // Seasons are fixed options

         filterFieldSelect.innerHTML = '';
         fields.forEach(field => {
             const option = document.createElement('option');
             option.value = field;
             option.textContent = field === 'all' ? 'All Fields' : field;
             filterFieldSelect.appendChild(option);
         });

         filterCropSelect.innerHTML = '';
         crops.forEach(crop => {
             const option = document.createElement('option');
             option.value = crop;
             option.textContent = crop === 'all' ? 'All Crops' : crop;
             filterCropSelect.appendChild(option);
         });

         // Season options are static in HTML, just ensure default is selected
         filterSeasonSelect.value = 'all';
    }


    function getFilteredPlans() {
        const filterField = filterFieldSelect.value;
        const filterCrop = filterCropSelect.value;
        const filterSeason = filterSeasonSelect.value;

        return cropPlans.filter(plan => {
            return (
                (filterField === "all" || plan.field === filterField) &&
                (filterCrop === "all" || plan.crop === filterCrop) &&
                (filterSeason === "all" || plan.season === filterSeason)
            );
        });
    }


    // --- Rendering Views ---
    function renderTable(plans) {
        cropPlanTableBody.innerHTML = '';
        if (plans.length === 0) {
             cropPlanTableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No crop plans found matching filters.</td></tr>';
             return;
        }

        plans.forEach(plan => {
            const row = cropPlanTableBody.insertRow();
            const status = getStatus(plan.plantingDate, plan.harvestDate);
            const statusClass = getStatusColorClass(status);

            row.innerHTML = `
                <td>${plan.field}</td>
                <td>${plan.crop}</td>
                <td>${plan.variety || ''}</td>
                <td>${plan.plantingDate}</td>
                <td>${plan.harvestDate}</td>
                <td>${plan.duration || ''}</td>
                <td>${plan.waterNeeds || ''}</td>
                <td>${Array.isArray(plan.fertilizer) ? plan.fertilizer.join(", ") : plan.fertilizer || ''}</td>
                <td class="${statusClass}">${status}</td>
                <td class="cropping-planner-page__table .actions-cell">
                    <button class="action-btn view-plan-btn" data-id="${plan.id}" title="View"><i class="fa-solid fa-eye"></i></button>
                    <button class="action-btn edit-plan-btn" data-id="${plan.id}" title="Edit"><i class="fa-solid fa-pencil-alt"></i></button>
                    <button class="action-btn delete-plan-btn" data-id="${plan.id}" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
        });
    }

    function renderCalendar(plans) {
        cropPlanCalendar.innerHTML = '';
         if (plans.length === 0) {
             cropPlanCalendar.innerHTML = '<p style="text-align:center;">No crop plans found matching filters.</p>';
             return;
        }

        plans.forEach(plan => {
             const status = getStatus(plan.plantingDate, plan.harvestDate);
             const statusClass = getStatusColorClass(status);
            const cardHtml = `
                <div class="cropping-planner-page__calendar-card card">
                    <h2>${plan.field}: ${plan.crop} (${plan.variety || ''})</h2>
                    <p><strong>Schedule:</strong> ${plan.plantingDate} &rarr; ${plan.harvestDate} (${plan.duration || ''})</p>
                    <p><strong>Water Needs:</strong> ${plan.waterNeeds || ''}</p>
                    <p><strong>Fertilizer Plan:</strong> ${Array.isArray(plan.fertilizer) ? plan.fertilizer.join(", ") : plan.fertilizer || ''}</p>
                    <p><strong>Status:</strong> <span class="${statusClass}">${status}</span></p>
                     <div class="cropping-planner-page__table .actions-cell" style="margin-top: 10px; justify-content: flex-end;">
                         <button class="action-btn view-plan-btn" data-id="${plan.id}" title="View"><i class="fa-solid fa-eye"></i></button>
                         <button class="action-btn edit-plan-btn" data-id="${plan.id}" title="Edit"><i class="fa-solid fa-pencil-alt"></i></button>
                         <button class="action-btn delete-plan-btn" data-id="${plan.id}" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                     </div>
                </div>
            `;
            cropPlanCalendar.innerHTML += cardHtml; // Append card HTML
        });
         // Add event listeners for buttons inside calendar cards after rendering
         attachCalendarCardButtonListeners();
    }

     function attachCalendarCardButtonListeners() {
         cropPlanCalendar.querySelectorAll('.action-btn').forEach(button => {
             button.addEventListener('click', (event) => {
                 const id = parseInt(button.dataset.id);
                 const type = button.classList.contains('view-plan-btn') ? 'view' :
                              button.classList.contains('edit-plan-btn') ? 'edit' :
                              button.classList.contains('delete-plan-btn') ? 'delete' : null;
                 if (type) {
                     handleActionClick(type, id);
                 }
             });
         });
     }


    function renderCurrentView() {
        const filteredPlans = getFilteredPlans();
        if (currentView === 'table') {
            tableView.style.display = 'block';
            calendarView.style.display = 'none';
            renderTable(filteredPlans);
        } else {
            tableView.style.display = 'none';
            calendarView.style.display = 'grid'; // Or 'block' depending on your CSS for calendar grid
            renderCalendar(filteredPlans);
        }
         // Re-attach table action button listeners after rendering table
         if (currentView === 'table') {
            attachTableActionButtonListeners();
         }
    }

     function attachTableActionButtonListeners() {
         cropPlanTableBody.querySelectorAll('.action-btn').forEach(button => {
             button.addEventListener('click', (event) => {
                 const id = parseInt(button.dataset.id);
                 const type = button.classList.contains('view-plan-btn') ? 'view' :
                              button.classList.contains('edit-plan-btn') ? 'edit' :
                              button.classList.contains('delete-plan-btn') ? 'delete' : null;
                  if (type) {
                     handleActionClick(type, id);
                 }
             });
         });
     }


    // --- Modal Functionality ---

    function openModal(mode, plan = null) {
        modalMode = mode;
        selectedPlanId = plan ? plan.id : null;
        modalErrorMessageDiv.style.display = 'none'; // Hide previous error

        if (mode === 'add') {
            modalTitle.textContent = 'Add Crop Plan';
            savePlanBtn.textContent = 'Add Plan';
            resetModalForm(); // Clear form for add mode
             // Enable all fields for adding
             modalFieldInput.disabled = false;
             modalCropInput.disabled = false;
             modalVarietyInput.disabled = false;
             modalPlantingDateInput.disabled = false;
             modalHarvestDateInput.disabled = false;
             modalWaterNeedsSelect.disabled = false;
             modalFertilizerInput.disabled = false;
             modalSeasonSelect.disabled = false;
             savePlanBtn.style.display = 'inline-block'; // Show save button
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Edit Crop Plan';
            savePlanBtn.textContent = 'Save Changes';
            populateModalForm(plan); // Populate form for edit mode
             // Enable all fields for editing
             modalFieldInput.disabled = false;
             modalCropInput.disabled = false;
             modalVarietyInput.disabled = false;
             modalPlantingDateInput.disabled = false;
             modalHarvestDateInput.disabled = false;
             modalWaterNeedsSelect.disabled = false;
             modalFertilizerInput.disabled = false;
             modalSeasonSelect.disabled = false;
             savePlanBtn.style.display = 'inline-block'; // Show save button
        } else if (mode === 'view') {
            modalTitle.textContent = 'Crop Plan Details';
             // Disable all fields for viewing
             modalFieldInput.disabled = true;
             modalCropInput.disabled = true;
             modalVarietyInput.disabled = true;
             modalPlantingDateInput.disabled = true;
             modalHarvestDateInput.disabled = true;
             modalDurationInput.disabled = true; // Duration is always disabled as it's calculated
             modalWaterNeedsSelect.disabled = true;
             modalFertilizerInput.disabled = true;
             modalSeasonSelect.disabled = true;
            populateModalForm(plan); // Populate form for view mode
            savePlanBtn.style.display = 'none'; // Hide save button in view mode
             // You might want to add separate View/Edit/Delete buttons in the modal footer for view mode
             // For simplicity, we'll just hide the save button here.
        }

        cropPlanModal.style.display = 'block';
    }

    function closeModal() {
        cropPlanModal.style.display = 'none';
        selectedPlanId = null;
        modalErrorMessageDiv.style.display = 'none'; // Hide error on close
        resetModalForm(); // Reset form when closing
         // Re-enable fields when closing the modal in case it was in view mode
         modalFieldInput.disabled = false;
         modalCropInput.disabled = false;
         modalVarietyInput.disabled = false;
         modalPlantingDateInput.disabled = false;
         modalHarvestDateInput.disabled = false;
         modalDurationInput.disabled = true; // Duration remains disabled
         modalWaterNeedsSelect.disabled = false;
         modalFertilizerInput.disabled = false;
         modalSeasonSelect.disabled = false;
    }

     function resetModalForm() {
         modalFieldInput.value = '';
         modalCropInput.value = '';
         modalVarietyInput.value = '';
         modalPlantingDateInput.value = '';
         modalHarvestDateInput.value = '';
         modalDurationInput.value = '';
         modalWaterNeedsSelect.value = '';
         modalFertilizerInput.value = '';
         modalSeasonSelect.value = '';
     }

     function populateModalForm(plan) {
         modalFieldInput.value = plan.field || '';
         modalCropInput.value = plan.crop || '';
         modalVarietyInput.value = plan.variety || '';
         modalPlantingDateInput.value = plan.plantingDate || '';
         modalHarvestDateInput.value = plan.harvestDate || '';
         modalDurationInput.value = plan.duration || '';
         modalWaterNeedsSelect.value = plan.waterNeeds || '';
         modalFertilizerInput.value = Array.isArray(plan.fertilizer) ? plan.fertilizer.join(", ") : plan.fertilizer || '';
         modalSeasonSelect.value = plan.season || '';
     }


    // --- Action Handling (View, Edit, Delete) ---
    function handleActionClick(type, planId) {
        const plan = cropPlans.find(p => p.id === planId);
        if (!plan) return;

        if (type === "view") {
            openModal('view', plan);
        } else if (type === "edit") {
            openModal('edit', plan);
        } else if (type === "delete") {
            if (confirm(`Are you sure you want to delete the crop plan for "${plan.field}: ${plan.crop}"?`)) {
                cropPlans = cropPlans.filter(p => p.id !== planId);
                saveToLocalStorage(); // Save after deleting
                renderCurrentView(); // Re-render the current view
                 populateFilterOptions(); // Update filter options after deletion
            }
        }
    }


    // --- Form Submission Handling ---
    cropPlanForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = {
            field: modalFieldInput.value.trim(),
            crop: modalCropInput.value.trim(),
            variety: modalVarietyInput.value.trim(),
            plantingDate: modalPlantingDateInput.value,
            harvestDate: modalHarvestDateInput.value,
            duration: modalDurationInput.value, // This will be recalculated
            waterNeeds: modalWaterNeedsSelect.value,
            fertilizer: modalFertilizerInput.value.split(",").map(date => date.trim()).filter(date => date !== ""), // Split and clean, remove empty
            season: modalSeasonSelect.value,
        };

         // --- Validation ---
         if (!formData.field || !formData.crop || !formData.plantingDate || !formData.harvestDate || !formData.season || !formData.waterNeeds) {
             modalErrorMessageDiv.textContent = "Please fill in all required fields (Field, Crop, Planting Date, Harvest Date, Season, Water Needs).";
             modalErrorMessageDiv.style.display = 'block';
             return;
         }

         const plantDate = new Date(formData.plantingDate);
         const harvestDate = new Date(formData.harvestDate);

         if (plantDate > harvestDate) {
              modalErrorMessageDiv.textContent = "Harvest Date cannot be before Planting Date.";
              modalErrorMessageDiv.style.display = 'block';
              return;
         }

         // Validate fertilizer dates format if needed (optional)
         // formData.fertilizer.forEach(dateStr => {
         //      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
         //           modalErrorMessageDiv.textContent = "Invalid date format in Fertilizer Plan. Use YYYY-MM-DD.";
         //           modalErrorMessageDiv.style.display = 'block';
         //           return; // Stop validation
         //      }
         // });
         // if (modalErrorMessageDiv.style.display === 'block') return; // Stop if fertilizer format is bad


         // Recalculate duration based on submitted dates
         const diff = Math.ceil((harvestDate - plantDate) / (1000 * 60 * 60 * 24));
         formData.duration = `${diff} days`;
         // Add status
         formData.status = getStatus(formData.plantingDate, formData.harvestDate);

         // --- Add or Edit ---
        if (modalMode === "add") {
            const newPlan = {
                ...formData,
                id: Date.now() // Simple unique ID
            };
            cropPlans.push(newPlan);
            alert("Crop plan added successfully!");
        } else if (modalMode === "edit" && selectedPlanId !== null) {
            cropPlans = cropPlans.map(plan =>
                plan.id === selectedPlanId ? { ...formData, id: selectedPlanId } : plan // Keep original ID
            );
             alert("Crop plan updated successfully!");
        }

        saveToLocalStorage(); // Save changes to localStorage
        renderCurrentView(); // Re-render the current view
        closeModal(); // Close the modal
         populateFilterOptions(); // Update filter options after adding/editing
    });

    // --- Duration Calculation in Modal Form ---
    modalPlantingDateInput.addEventListener('change', updateDuration);
    modalHarvestDateInput.addEventListener('change', updateDuration);

    function updateDuration() {
        const plantingDate = modalPlantingDateInput.value;
        const harvestDate = modalHarvestDateInput.value;

        if (plantingDate && harvestDate) {
            const start = new Date(plantingDate);
            const end = new Date(harvestDate);
             if (start > end) {
                 modalDurationInput.value = "Invalid Dates";
                  // Optionally show an error message to the user here
             } else {
                 const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                 if (!isNaN(diff)) {
                     modalDurationInput.value = `${diff} days`;
                 } else {
                     modalDurationInput.value = ''; // Handle invalid date inputs
                 }
             }
        } else {
            modalDurationInput.value = ''; // Clear duration if dates are incomplete
        }
    }


    // --- Event Listeners ---

    // Toggle view button
    toggleViewBtn.addEventListener('click', () => {
        currentView = currentView === 'table' ? 'calendar' : 'table';
        toggleViewText.textContent = currentView === 'table' ? 'Calendar View' : 'Table View';
        toggleViewBtn.querySelector('i').classList.replace(
            currentView === 'table' ? 'fa-solid fa-table' : 'fa-solid fa-calendar-days',
            currentView === 'table' ? 'fa-solid fa-calendar-days' : 'fa-solid fa-table'
        );
        renderCurrentView(); // Render the new view
    });

    // Filter change listeners
    filterFieldSelect.addEventListener('change', renderCurrentView);
    filterCropSelect.addEventListener('change', renderCurrentView);
    filterSeasonSelect.addEventListener('change', renderCurrentView);

    // Add plan button
    addPlanBtn.addEventListener('click', () => openModal('add'));

    // Modal close buttons
    closeModalButton.addEventListener('click', closeModal);
    cancelPlanBtn.addEventListener('click', closeModal);

    // Close modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target === cropPlanModal) {
            closeModal();
        }
    });


    // --- Initial Load ---
    loadFromLocalStorage(); // Load data from localStorage first
    populateFilterOptions(); // Populate filters based on loaded data
    renderCurrentView(); // Render the initial view (default is table)
});