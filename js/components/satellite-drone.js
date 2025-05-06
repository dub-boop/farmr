// js/components/satellite-drone-enhanced.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing DOM element selections and initial variable declarations) ...

    const tabsList = document.querySelector('.tabs__list');
    const tabsTriggers = document.querySelectorAll('.tabs__trigger');
    const tabsContents = document.querySelectorAll('.tabs__content');

    const imageryItemsContainer = document.querySelector('.satellite-drone-page__imagery-items');
    const showRequestFormBtn = document.getElementById('showRequestFormBtn');
    const flyoverRequestForm = document.getElementById('flyoverRequestForm');
    const submitFlyoverRequestBtn = document.getElementById('submitFlyoverRequestBtn');
    const requestDateInput = document.getElementById('requestDate');
    const requestReasonInput = document.getElementById('requestReason');
    const requestLocationInput = document.getElementById('requestLocation');
    const requestSubmissionMessageDiv = document.getElementById('requestSubmissionMessage');
    const requestSubmissionErrorDiv = document.getElementById('requestSubmissionError');
    const requestSubmissionLoadingDiv = document.getElementById('requestSubmissionLoading');
    const submittedRequestDisplayDiv = document.getElementById('submittedRequestDisplay');

    const sensorTableBody = document.getElementById('sensorTableBody');
    const addSensorBtn = document.getElementById('addSensorBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const sensorErrorDiv = document.getElementById('sensorError');
    const sensorLoadingDiv = document.getElementById('sensorLoading');
    const noSensorDataDiv = document.getElementById('noSensorData');

    let analyzedResults = [null, null, null];
    let sensorData = []; // Sensor data will be fetched or added

    // --- Tab Functionality ---
    tabsList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('tabs__trigger')) {
            const tab = target.dataset.tab;

            tabsTriggers.forEach(trigger => trigger.classList.remove('active'));
            target.classList.add('active');

            tabsContents.forEach(content => {
                if (content.id === tab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Optional: Load data when a tab becomes active
            // if (tab === 'probes' && sensorData.length === 0) { // Only fetch if no data
            //     fetchSensorData();
            // } else if (tab === 'probes') {
            //      renderSensorTable(); // Re-render if data exists but tab was inactive
            // }
             if (tab === 'probes') {
                 fetchSensorData(); // Always refetch or ensure data is current
             }
        }
    });

    // --- Imagery Analysis Section ---
    const renderImageryItems = () => {
        imageryItemsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('satellite-drone-page__imagery-item');
            itemDiv.innerHTML = `
                 <div class="satellite-drone-page__image-placeholder">
                    <i class="fa-solid fa-image text-gray"></i>
                </div>
                <p class="satellite-drone-page__image-title">Aerial Image ${i + 1}</p>
                <div class="satellite-drone-page__analysis-result" data-index="${i}" style="display: none;">
                    <p><strong>Vegetation Health:</strong> <span data-field="vegetationHealth"></span></p>
                    <p><strong>Dry Patches:</strong> <span data-field="dryPatches"></span></p>
                    <p><strong>Pest Indicators:</strong> <span data-field="pestIndicators"></span></p>
                    <p><strong>Soil Anomalies:</strong> <span data-field="soilAnomalies"></span></p>
                </div>
                <p class="satellite-drone-page__loading-text" data-index="${i}" style="display: none;">Analyzing...</p>
                <button class="satellite-drone-page__button satellite-drone-page__button--analyze" data-index="${i}">Analyze</button>
            `;
            imageryItemsContainer.appendChild(itemDiv);
        }
    };

    const handleAnalyze = (index) => {
        const loadingElement = imageryItemsContainer.querySelector(`.satellite-drone-page__loading-text[data-index="${index}"]`);
        const resultElement = imageryItemsContainer.querySelector(`.satellite-drone-page__analysis-result[data-index="${index}"]`);
        const analyzeButton = imageryItemsContainer.querySelector(`.satellite-drone-page__button--analyze[data-index="${index}"]`);

        if (loadingElement) loadingElement.style.display = 'block';
        if (resultElement) resultElement.style.display = 'none';
        if (analyzeButton) {
            analyzeButton.textContent = 'Analyzing...';
            analyzeButton.disabled = true;
        }

        // Simulate analysis
        setTimeout(() => {
            if (loadingElement) loadingElement.style.display = 'none';

            const dummyData = {
                vegetationHealth: "Moderate",
                dryPatches: "Low",
                pestIndicators: "None",
                soilAnomalies: "Minimal"
            };
            analyzedResults[index] = dummyData; // Update our data array

            if (resultElement) {
                resultElement.querySelector('[data-field="vegetationHealth"]').textContent = dummyData.vegetationHealth;
                resultElement.querySelector('[data-field="dryPatches"]').textContent = dummyData.dryPatches;
                resultElement.querySelector('[data-field="pestIndicators"]').textContent = dummyData.pestIndicators;
                resultElement.querySelector('[data-field="soilAnomalies"]').textContent = dummyData.soilAnomalies;
                resultElement.style.display = 'block';
            }
             if (analyzeButton) {
                analyzeButton.textContent = 'Re-analyze';
                analyzeButton.disabled = false;
            }

        }, 2000); // Simulate 2-second delay
    };

    // Event delegation for analyze buttons
    imageryItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('satellite-drone-page__button--analyze')) {
            const index = parseInt(target.dataset.index);
            handleAnalyze(index);
        }
    });


    // --- Drone Flyover Request Section ---
    showRequestFormBtn.addEventListener('click', () => {
        flyoverRequestForm.style.display = 'block';
        showRequestFormBtn.style.display = 'none';
        submittedRequestDisplayDiv.style.display = 'none';
        requestSubmissionErrorDiv.style.display = 'none';
        requestSubmissionMessageDiv.style.display = 'none';
    });

    submitFlyoverRequestBtn.addEventListener('click', async () => {
        const date = requestDateInput.value;
        const reason = requestReasonInput.value;
        const location = requestLocationInput.value;

        if (!date || !reason || !location) {
            requestSubmissionErrorDiv.textContent = 'Please fill in all fields.';
            requestSubmissionErrorDiv.style.display = 'block';
            requestSubmissionMessageDiv.style.display = 'none';
            return;
        }

        requestSubmissionErrorDiv.style.display = 'none';
        requestSubmissionLoadingDiv.style.display = 'block';

        // Simulate API call
        setTimeout(() => {
             requestSubmissionLoadingDiv.style.display = 'none';
             const success = Math.random() < 0.8; // 80% success rate

             if (success) {
                 const submittedRequest = { date, reason, location };
                 submittedRequestDisplayDiv.textContent = `Request submitted successfully for ${submittedRequest.date} at ${submittedRequest.location}.`;
                 submittedRequestDisplayDiv.style.display = 'block';
                 flyoverRequestForm.style.display = 'none';
                 requestDateInput.value = '';
                 requestReasonInput.value = '';
                 requestLocationInput.value = '';
                 // Optionally, hide the show form button again: showRequestFormBtn.style.display = 'none';
             } else {
                 requestSubmissionErrorDiv.textContent = 'Failed to submit request. Please try again later.';
                 requestSubmissionErrorDiv.style.display = 'block';
             }
        }, 2000); // Simulate 2-second delay
    });


    // --- Sensor Probe Insights Section ---
    // Simulate fetching data (replace with actual fetch to your API)
    const fetchSensorData = () => {
        sensorLoadingDiv.style.display = 'block';
        sensorErrorDiv.style.display = 'none';
        noSensorDataDiv.style.display = 'none';
        sensorTableBody.innerHTML = ''; // Clear table while loading

        setTimeout(() => {
            sensorLoadingDiv.style.display = 'none';

            // Simulate API success or failure
            if (Math.random() < 0.9) { // 90% chance of success
                 // Dummy data based on React component structure
                 sensorData = [
                    { id: 1, location: "Field A", moisture: (25 + Math.random() * 10).toFixed(1), nutrients: `N: ${40 + Math.floor(Math.random() * 20)}, P: ${15 + Math.floor(Math.random() * 10)}, K: ${10 + Math.floor(Math.random() * 10)}`, temperature: (20 + Math.random() * 10).toFixed(1), pH: (5 + Math.random() * 2).toFixed(1), timestamp: new Date().toISOString() },
                    { id: 2, location: "Field B", moisture: (25 + Math.random() * 10).toFixed(1), nutrients: `N: ${40 + Math.floor(Math.random() * 20)}, P: ${15 + Math.floor(Math.random() * 10)}, K: ${10 + Math.floor(Math.random() * 10)}`, temperature: (20 + Math.random() * 10).toFixed(1), pH: (5 + Math.random() * 2).toFixed(1), timestamp: new Date().toISOString() },
                 ];
                 renderSensorTable();
            } else {
                 sensorErrorDiv.textContent = 'Failed to load sensor data. Please try again later.';
                 sensorErrorDiv.style.display = 'block';
                 renderSensorTable(); // Render empty table or 'no data' message
            }
        }, 1500); // Simulate 1.5-second loading time
    };

    const renderSensorTable = () => {
         sensorTableBody.innerHTML = '';
         if (sensorData.length === 0) {
             noSensorDataDiv.style.display = 'block';
             return;
         } else {
             noSensorDataDiv.style.display = 'none';
         }

         sensorData.forEach(sensor => {
             const row = sensorTableBody.insertRow();
             row.insertCell().textContent = sensor.location;
             row.insertCell().textContent = `${sensor.moisture}%`;
             row.insertCell().textContent = sensor.nutrients;
             row.insertCell().textContent = `${sensor.temperature}°C`;
             row.insertCell().textContent = sensor.pH;
             row.insertCell().textContent = new Date(sensor.timestamp).toLocaleString(); // Format timestamp
             const actionsCell = row.insertCell();
             actionsCell.classList.add('sensor-actions');
             actionsCell.innerHTML = `
                  <i class="fa-solid fa-rotate-right" data-id="${sensor.id}" title="Refresh Data"></i>
                  <i class="fa-solid fa-trash-can" data-id="${sensor.id}" title="Delete Sensor"></i>
             `;
         });

         // Add event listener for delete and refresh icons using delegation
         sensorTableBody.addEventListener('click', (event) => {
             const target = event.target;
             const sensorId = parseInt(target.dataset.id);

             if (target.classList.contains('fa-trash-can')) {
                 deleteSensor(sensorId);
             } else if (target.classList.contains('fa-rotate-right')) {
                 refreshSensor(sensorId);
             }
         });
    };

    const addSensor = () => {
        const newId = Date.now(); // Use timestamp for a unique ID
        const newSensor = {
            id: newId,
            location: `Field ${String.fromCharCode(65 + sensorData.length)}`, // Simple location naming
            moisture: (25 + Math.random() * 10).toFixed(1),
            nutrients: `N: ${40 + Math.floor(Math.random() * 20)}, P: ${15 + Math.floor(Math.random() * 10)}, K: ${10 + Math.floor(Math.random() * 10)}`,
            temperature: (20 + Math.random() * 10).toFixed(1),
            pH: (5 + Math.random() * 2).toFixed(1),
            timestamp: new Date().toISOString()
        };
        sensorData.push(newSensor);
        renderSensorTable(); // Re-render the table
        // Note: In a real app, you'd also likely persist this change (e.g., send to API)
    };

    const deleteSensor = (id) => {
        sensorData = sensorData.filter(sensor => sensor.id !== id);
        renderSensorTable(); // Re-render the table
        // Note: In a real app, you'd also likely persist this change (e.g., send to API)
    };

    const refreshSensor = (id) => {
        // Simulate fetching updated data for a specific sensor
        sensorLoadingDiv.style.display = 'block'; // Show loading indicator
        sensorErrorDiv.style.display = 'none';

        setTimeout(() => {
             sensorLoadingDiv.style.display = 'none';

             const updatedSensorData = sensorData.map(sensor => {
                 if (sensor.id === id) {
                     // Generate new dummy data for this sensor
                     return {
                         ...sensor,
                         moisture: (25 + Math.random() * 10).toFixed(1),
                         nutrients: `N: ${40 + Math.floor(Math.random() * 20)}, P: ${15 + Math.floor(Math.random() * 10)}, K: ${10 + Math.floor(Math.random() * 10)}`,
                         temperature: (20 + Math.random() * 10).toFixed(1),
                         pH: (5 + Math.random() * 2).toFixed(1),
                         timestamp: new Date().toISOString() // Update timestamp
                     };
                 }
                 return sensor;
             });
             sensorData = updatedSensorData; // Update the main sensorData array
             renderSensorTable(); // Re-render the table to show updated data
              alert(`Data for Sensor ID ${id} refreshed.`); // Optional: Provide feedback
        }, 1000); // Simulate 1-second refresh time
    };


    const exportPdf = () => {
        // Requires jsPDF and jspdf-autotable libraries
        alert("PDF export functionality requires including and using jsPDF library.");
        // Example (if libraries are included):
        // const doc = new jsPDF();
        // autoTable(doc, {
        //   head: [["Location", "Moisture", "Nutrients", "Temperature", "pH", "Timestamp"]],
        //   body: sensorData.map(s => [s.location, `${s.moisture}%`, s.nutrients, `${s.temperature}°C`, s.pH, new Date(s.timestamp).toLocaleString()])
        // });
        // doc.save("sensor_data.pdf");
    };

    const exportCsv = () => {
        const csvContent = [
            "Location,Moisture,Nutrients,Temperature,pH,Timestamp",
            ...sensorData.map(s => `${s.location},${s.moisture}%,${s.nutrients},${s.temperature}°C,${s.pH},${new Date(s.timestamp).toLocaleString()}`)
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "sensor_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Event listeners for sensor actions
    addSensorBtn.addEventListener('click', addSensor);
    exportPdfBtn.addEventListener('click', exportPdf);
    exportCsvBtn.addEventListener('click', exportCsv);


    // --- Initial Load ---
    renderImageryItems(); // Render the initial imagery analysis items
    // Fetch sensor data when the probes tab is initially active or needs loading
    // Initial fetch moved to tab click logic or can be done here if probes is default
    // fetchSensorData(); // Call this if probes tab is active on load
});