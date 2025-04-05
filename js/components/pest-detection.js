// js/components/pest-detection.js
document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const runDiagnosisBtn = document.getElementById('runDiagnosisBtn');
    const diagnosisResultDiv = document.getElementById('diagnosisResult');
    const diagnosisIssue = document.getElementById('diagnosisIssue');
    const diagnosisConfidence = document.getElementById('diagnosisConfidence');
    const diagnosisRecommendation = document.getElementById('diagnosisRecommendation');
    const errorMessageDiv = document.getElementById('errorMessage');
    const loadingIndicatorDiv = document.getElementById('loadingIndicator');

    let selectedImageFile = null;

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedImageFile = file;
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = 'block';
            diagnosisResultDiv.style.display = 'none'; // Hide previous result
            errorMessageDiv.style.display = 'none'; // Hide any previous error
        } else {
            selectedImageFile = null;
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        }
    });

    runDiagnosisBtn.addEventListener('click', () => {
        if (!selectedImageFile) {
            errorMessageDiv.textContent = 'Please upload an image first.';
            errorMessageDiv.style.display = 'block';
            return;
        }

        errorMessageDiv.style.display = 'none';
        loadingIndicatorDiv.style.display = 'block';
        diagnosisResultDiv.style.display = 'none';

        // Simulate an API call for diagnosis (replace with your actual API call)
        setTimeout(() => {
            loadingIndicatorDiv.style.display = 'none';

            // Simulate a successful diagnosis with a 70% chance
            if (Math.random() < 0.7) {
                const result = {
                    issue: "Maize Leaf Blight",
                    confidence: Math.floor(Math.random() * 30) + 70, // Confidence between 70 and 99
                    recommendation: "Apply appropriate fungicide like Mancozeb and avoid overhead irrigation."
                };
                diagnosisIssue.textContent = result.issue;
                diagnosisConfidence.textContent = result.confidence;
                diagnosisRecommendation.textContent = result.recommendation;
                diagnosisResultDiv.style.display = 'block';
            } else {
                // Simulate an error with a 30% chance
                errorMessageDiv.textContent = 'Diagnosis failed. Please try again or ensure the image is clear.';
                errorMessageDiv.style.display = 'block';
            }
        }, 2000); // Simulate a 2-second processing time
    });
});