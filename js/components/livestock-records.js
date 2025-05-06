// js/components/livestock-records.js
document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('.livestock-records-page__title');
    const recordsTable = document.getElementById('recordsTable');
    const recordsTableBody = document.getElementById('recordsTableBody');
    const loadingRecordsMessage = document.getElementById('loadingRecords');
    const noRecordsMessage = document.getElementById('noRecordsMessage');
    const addNewRecordBtn = document.getElementById('addNewRecordBtn'); // Get the new button

    // Modal elements
    const editRecordModal = document.getElementById('editRecordModal');
    const closeModalButton = editRecordModal.querySelector('.close-button');
    const cancelEditButton = document.getElementById('cancelEditBtn');
    const saveRecordButton = document.getElementById('saveRecordBtn');
    const modalTitle = document.getElementById('modalTitle');
    const editRecordIdInput = document.getElementById('editRecordId');
    const modalIdField = document.getElementById('modalIdField'); // Get the ID field container
    const formFieldsContainer = editRecordModal.querySelector('.form-fields-container');


    let allRecords = []; // Store all records for the current livestock type
    let editingRecordId = null; // Track the ID of the record being edited
    let currentFormFields = []; // Store the form field definitions for the current livestock type


    // Function to get query parameters from the URL
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get the livestock type from the URL
    const livestockType = getQueryParameter('type');

    // Update the page title
    if (livestockType) {
        pageTitle.textContent = `${livestockType} Records`;
        loadLivestockRecords(livestockType);
    } else {
        pageTitle.textContent = 'Livestock Records';
        noRecordsMessage.textContent = 'No livestock type specified.';
        noRecordsMessage.style.display = 'block';
    }

    // Function to load and display records based on livestock type
    function loadLivestockRecords(type) {
        loadingRecordsMessage.style.display = 'block';
        recordsTable.style.display = 'none';
        noRecordsMessage.style.display = 'none';
        recordsTableBody.innerHTML = ''; // Clear previous records
        allRecords = []; // Clear previous records data
        currentFormFields = []; // Clear previous form field definitions

        // Simulate fetching data (replace with actual data loading logic)
        setTimeout(() => {
            loadingRecordsMessage.style.display = 'none';

            let records = [];
            let tableHeaders = [];
            let formFields = []; // Define form fields for the modal

            // Dummy data based on livestock type
            if (type === 'Cattle') {
                records = [
                    { id: 101, tag: 'C001', breed: 'Holstein', dob: '2023-05-10', gender: 'Female', weight: '500' }, // Weight as number
                    { id: 102, tag: 'C002', breed: 'Angus', dob: '2024-01-20', gender: 'Male', weight: '300' }, // Weight as number
                ];
                tableHeaders = ["Tag", "Breed", "Date of Birth", "Gender", "Weight"];
                formFields = [
                    { name: 'tag', label: 'Tag', type: 'text' },
                    { name: 'breed', label: 'Breed', type: 'text' },
                    { name: 'dob', label: 'Date of Birth', type: 'date' },
                    { name: 'gender', label: 'Gender', type: 'text' }, // Could be a select
                    { name: 'weight', label: 'Weight (kg)', type: 'number' }, // Changed type and label
                ];
            } else if (type === 'Chicken') {
                 records = [
                    { id: 201, batch: 'Batch A', breed: 'Broiler', hatchDate: '2025-03-01', count: 100, mortality: 5 }, // Mortality as number
                    { id: 202, batch: 'Batch B', breed: 'Layer', hatchDate: '2025-02-15', count: 150, mortality: 3 }, // Mortality as number
                 ];
                 tableHeaders = ["Batch", "Breed", "Hatch Date", "Count", "Mortality (%)"]; // Updated header
                 formFields = [
                    { name: 'batch', label: 'Batch', type: 'text' },
                    { name: 'breed', label: 'Breed', type: 'text' },
                    { name: 'hatchDate', label: 'Hatch Date', type: 'date' },
                    { name: 'count', label: 'Count', type: 'number' },
                    { name: 'mortality', label: 'Mortality (%)', type: 'number' }, // Changed type and label
                 ];
            }
             // Add more conditions for other livestock types

            allRecords = records; // Store the fetched records
            currentFormFields = formFields; // Store form field definitions

            if (allRecords.length > 0) {
                renderRecordsTable(allRecords, tableHeaders);
                 renderModalFormFields(currentFormFields); // Render modal form fields
            } else {
                noRecordsMessage.textContent = `No records found for ${type}.`;
                noRecordsMessage.style.display = 'block';
            }

        }, 1000); // Simulate 1 second loading time
    }

     // Function to render the modal form fields dynamically
     function renderModalFormFields(fields) {
         formFieldsContainer.innerHTML = ''; // Clear previous fields
         fields.forEach(field => {
             const formGroup = document.createElement('div');
             formGroup.classList.add('form-group');
             const label = document.createElement('label');
             label.setAttribute('for', `editRecord${capitalizeFirstLetter(field.name)}`);
             label.textContent = field.label + ':';
             const input = document.createElement('input');
             input.setAttribute('type', field.type);
             input.setAttribute('id', `editRecord${capitalizeFirstLetter(field.name)}`);
             input.dataset.fieldName = field.name; // Store field name for easy access
             if (field.type === 'number') {
                 input.setAttribute('step', 'any'); // Allow decimal if needed, adjust as per data
             }

             formGroup.appendChild(label);
             formGroup.appendChild(input);
             formFieldsContainer.appendChild(formGroup);
         });
     }

    // Helper function to capitalize the first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    // Function to render the table with data and headers
    function renderRecordsTable(records, headers) {
        // Render headers
        const theadRow = recordsTable.querySelector('thead tr');
        theadRow.innerHTML = ''; // Clear existing headers
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            theadRow.appendChild(th);
        });
         // Add Actions header
         const actionsTh = document.createElement('th');
         actionsTh.textContent = 'Actions';
         theadRow.appendChild(actionsTh);


        // Render body rows
        recordsTableBody.innerHTML = ''; // Clear existing rows
        records.forEach(record => {
            const row = recordsTableBody.insertRow();
            // Assuming the order of properties in record objects matches the headers
            headers.forEach(headerText => {
                 const cell = row.insertCell();
                 // Simple mapping based on header text (needs refinement for complex objects)
                 const propertyName = currentFormFields.find(field => field.label === headerText || field.label + ':' === headerText)?.name || headerText.toLowerCase().replace(/[\s()%]/g, ''); // More robust property name finding
                 cell.textContent = record[propertyName] !== undefined ? record[propertyName] : '';
            });
            // Add an actions column
             const actionsCell = row.insertCell();
             actionsCell.classList.add('actions-cell');
             actionsCell.innerHTML = `<button class="edit-btn button button--primary button--small" data-id="${record.id}"><i class="fa-solid fa-pencil-alt"></i> Edit</button>`;
        });

        recordsTable.style.display = 'table';
    }

    // --- Modal Functionality ---

    // Function to clear the modal form fields
    function clearModalForm() {
        editRecordIdInput.value = '';
         formFieldsContainer.querySelectorAll('input, select').forEach(fieldElement => {
             fieldElement.value = '';
         });
    }

    // Function to open the modal (for both add and edit)
    function openRecordModal(record = null) { // record is optional
        if (record) { // Edit mode
            editingRecordId = record.id;
            modalTitle.textContent = `Edit ${livestockType} Record (ID: ${record.id})`;
            editRecordIdInput.value = record.id;
            modalIdField.style.display = 'block'; // Show ID field

            // Populate dynamic form fields
            formFieldsContainer.querySelectorAll('input, select').forEach(fieldElement => {
                const fieldName = fieldElement.dataset.fieldName;
                if (fieldName && record[fieldName] !== undefined) {
                     fieldElement.value = record[fieldName];
                }
            });
             saveRecordButton.textContent = 'Save Changes';

        } else { // Add mode
            editingRecordId = null; // No ID yet for a new record
            modalTitle.textContent = `Add New ${livestockType} Record`;
            modalIdField.style.display = 'none'; // Hide ID field
            clearModalForm(); // Clear fields for a new record
            saveRecordButton.textContent = 'Add Record';
        }

        editRecordModal.style.display = 'block';
    }


    function closeEditModal() {
        editRecordModal.style.display = 'none';
        editingRecordId = null; // Reset editing ID
        clearModalForm(); // Clear form fields on close
    }

    // Event listener for "Edit" buttons (using delegation on the table body)
    recordsTableBody.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
             const editButton = target.classList.contains('edit-btn') ? target : target.closest('.edit-btn');
             const recordId = parseInt(editButton.dataset.id);
             const recordToEdit = allRecords.find(record => record.id === recordId);
             if (recordToEdit) {
                 openRecordModal(recordToEdit); // Open modal in edit mode
             }
        }
    });

    // Event listener for "Add New Record" button
    if (addNewRecordBtn) {
        addNewRecordBtn.addEventListener('click', () => {
            openRecordModal(); // Open modal in add mode
        });
    }


    // Event listeners for modal close buttons
    closeModalButton.addEventListener('click', closeEditModal);
    cancelEditButton.addEventListener('click', closeEditModal);

    // Close modal if clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === editRecordModal) {
            closeEditModal();
        }
    });

    // Event listener for "Save Changes" / "Add Record" button in the modal
    saveRecordButton.addEventListener('click', () => {
         const isAdding = editingRecordId === null;

         // Get data from modal form
         const recordData = {};
         formFieldsContainer.querySelectorAll('input, select').forEach(fieldElement => {
             const fieldName = fieldElement.dataset.fieldName;
              if (fieldName) {
                 // Basic type conversion (needs refinement based on actual data types)
                 if (fieldElement.type === 'number') {
                      recordData[fieldName] = parseFloat(fieldElement.value) || 0;
                 } else if (fieldElement.type === 'date') {
                      recordData[fieldName] = fieldElement.value;
                 } else {
                     recordData[fieldName] = fieldElement.value;
                 }
             }
         });

        if (isAdding) {
            // *** Add New Record Logic ***
            const newRecordId = Date.now(); // Generate a simple unique ID
            const newRecord = { id: newRecordId, ...recordData };

            // Add the new record to the allRecords array
            allRecords.push(newRecord);

            alert(`New ${livestockType} record added with ID: ${newRecordId}`);

        } else {
            // *** Edit Existing Record Logic ***
            const recordIdToUpdate = editingRecordId;
            allRecords = allRecords.map(record => {
                if (record.id === recordIdToUpdate) {
                    return { ...record, ...recordData }; // Merge updated fields
                }
                return record;
            });
            alert(`Record with ID ${recordIdToUpdate} updated.`);
        }


        // Re-render the table with updated data
        const currentHeaders = Array.from(recordsTable.querySelectorAll('thead th')).map(th => th.textContent).filter(header => header !== 'Actions');
        renderRecordsTable(allRecords, currentHeaders);

        // Close the modal
        closeEditModal();

        // In a real application, you would also send the new/updated record to your backend API
    });

    // Initial load logic based on URL parameter is handled at the top
});