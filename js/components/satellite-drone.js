// js/components/satellite-drone.js
document.addEventListener('DOMContentLoaded', () => {
    const requestFlyoverBtn = document.getElementById('requestFlyoverBtn');
    const requestForm = document.getElementById('requestForm');
    const submitRequestBtn = document.getElementById('submitRequestBtn');
    const flyoverDateInput = document.getElementById('flyoverDate');
    const flyoverReasonInput = document.getElementById('flyoverReason');
    const submissionMessageDiv = document.getElementById('submissionMessage');
    const submissionErrorDiv = document.getElementById('submissionError');
    const submissionLoadingDiv = document.getElementById('submissionLoading');

    const analyzeButtons = document.querySelectorAll('.satellite-drone-page__button--analyze');
    const analysisResults = [
        document.getElementById('analysisResult1'),
        document.getElementById('analysisResult2'),
        document.getElementById('analysisResult3')
    ];
    const loadingTexts = [
        document.getElementById('loading1'),
        document.getElementById('loading2'),
        document.getElementById('loading3')
    ];
    const healthSpans = [
        document.getElementById('health1'),
        document.getElementById('health2'),
        document.getElementById('health3')
    ];
    const drySpans = [
        document.getElementById('dry1'),
        document.getElementById('dry2'),
        document.getElementById('dry3')
    ];
    const pestSpans = [
        document.getElementById('pest1'),
        document.getElementById('pest2'),
        document.getElementById('pest3')
    ];
    const soilSpans = [
        document.getElementById('soil1'),
        document.getElementById('soil2'),
        document.getElementById('soil3')
    ];

    requestFlyoverBtn.addEventListener('click', () => {
        requestForm.style.display = 'block';
        submissionMessageDiv.style.display = 'none';
        submissionErrorDiv.style.display = 'none';
    });

    submitRequestBtn.addEventListener('click', () => {
        const date = flyoverDateInput.value;
        const reason = flyoverReasonInput.value;

        if (!date || !reason) {
            submissionErrorDiv.textContent = 'Please fill in both date and reason.';
            submissionErrorDiv.style.display = 'block';
            submissionMessageDiv.style.display = 'none';
            return;
        }

        submissionErrorDiv.style.display = 'none';
        submissionLoadingDiv.style.display = 'block';
        submissionMessageDiv.style.display = 'none';

        // Simulate API call
        setTimeout(() => {
            submissionLoadingDiv.style.display = 'none';
            const success = Math.random() < 0.8; // Simulate success 80% of the time
            if (success) {
                submissionMessageDiv.textContent = `Request submitted for ${date} - Reason: ${reason}`;
                submissionMessageDiv.style.display = 'block';
                flyoverDateInput.value = '';
                flyoverReasonInput.value = '';
                requestForm.style.display = 'none';
            } else {
                submissionErrorDiv.textContent = 'Failed to submit request. Please try again later.';
                submissionErrorDiv.style.display = 'block';
            }
        }, 2000);
    });

    analyzeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            loadingTexts[index].style.display = 'block';
            analysisResults[index].style.display = 'none';

            setTimeout(() => {
                loadingTexts[index].style.display = 'none';
                const dummyData = {
                    vegetationHealth: "Moderate",
                    dryPatches: "Low",
                    pestIndicators: "None",
                    soilAnomalies: "Minimal"
                };
                healthSpans[index].textContent = dummyData.vegetationHealth;
                drySpans[index].textContent = dummyData.dryPatches;
                pestSpans[index].textContent = dummyData.pestIndicators;
                soilSpans[index].textContent = dummyData.soilAnomalies;
                analysisResults[index].style.display = 'block';
            }, 2000);
        });
    });
});