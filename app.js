// Main Application Logic
class RelationshipApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.model = new RelationshipModel();
        this.isInitialized = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            // Try to load saved model first
            const modelLoaded = await this.model.loadModel();
            
            if (!modelLoaded) {
                await this.trainNewModel();
            } else {
                console.log('Loaded pre-trained model from storage');
                this.isInitialized = true;
            }
            
            this.setupEventListeners();
            this.initializeQuestions();
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    async trainNewModel() {
        this.showLoading('Training AI model... This may take a few seconds.');
        
        // Generate training data
        const { features, labels } = this.dataLoader.generateTrainingData(1500);
        
        // Train model
        await this.model.trainModel(features, labels, {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 30 === 0) {
                    console.log(`Epoch ${epoch}, loss: ${logs.loss.toFixed(4)}, accuracy: ${logs.acc.toFixed(4)}`);
                }
            }
        });
        
        // Save model for future use
        await this.model.saveModel();
        
        this.hideLoading();
        this.isInitialized = true;
        console.log('Model training completed');
    }

    initializeQuestions() {
        const container = document.getElementById('questionsContainer');
        const questions = this.dataLoader.getQuestions();
        
        container.innerHTML = '';
        
        questions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <p><strong>${index + 1}.</strong> ${question}</p>
                <div class="slider-container">
                    <input type="range" min="0" max="4" value="2" class="slider" id="q${index}">
                    <div class="slider-labels">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                    </div>
                </div>
            `;
            container.appendChild(questionItem);
        });
    }

    setupEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeResponses();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetAssessment();
        });

        // Add real-time slider value display
        this.setupSliderInteractions();
    }

    setupSliderInteractions() {
        // Update slider values in real-time
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('slider')) {
                this.updateSliderVisual(e.target);
            }
        });
    }

    updateSliderVisual(slider) {
        // You can add visual feedback for slider values here
        const value = parseInt(slider.value);
        const percentage = (value / 4) * 100;
        
        // Update slider background to show progress
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    }

    async analyzeResponses() {
        if (!this.isInitialized) {
            this.showError('Model is still initializing. Please wait...');
            return;
        }

        this.showLoading('Analyzing your responses...');

        // Small delay to show loading animation
        setTimeout(async () => {
            try {
                const responses = this.dataLoader.collectUserResponses();
                
                if (responses.length !== this.dataLoader.getQuestions().length) {
                    this.showError('Please answer all questions before analyzing.');
                    return;
                }

                const score = this.model.predict(responses);
                const percentage = Math.round(score * 100);
                const averageResponse = this.dataLoader.calculateAverageResponse(responses);
                
                this.displayResults(percentage, averageResponse, responses);
                this.hideLoading();
                
            } catch (error) {
                console.error('Error during analysis:', error);
                this.showError('An error occurred during analysis. Please try again.');
                this.hideLoading();
            }
        }, 1000);
    }

    displayResults(percentage, averageResponse, responses) {
        // Generate message based on score
        const { message, advice, color } = this.generateResultMessage(percentage, averageResponse);
        
        // Display results
        document.getElementById('resultScore').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('resultMessage').innerHTML = `
            <strong style="color: ${color}">${message}</strong><br><br>
            ${advice}<br><br>
            <small>Average response score: ${averageResponse.toFixed(1)}/4.0</small>
        `;
        
        // Show feature importance
        this.displayFeatureImportance(responses);
        
        // Show results section
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultMessage(percentage, averageResponse) {
        let message, advice, color;
        
        if (percentage >= 85) {
            message = "Excellent Relationship Dynamics!";
            advice = "Your relationship shows outstanding communication, trust, and mutual support. Continue nurturing these strong foundations and celebrating your connection.";
            color = "#4ECDC4";
        } else if (percentage >= 70) {
            message = "Strong, Healthy Relationship";
            advice = "Your relationship has many positive qualities with good communication patterns. Focus on maintaining your strengths while addressing any minor areas for growth.";
            color = "#6BCF7F";
        } else if (percentage >= 55) {
            message = "Good Foundation with Areas for Growth";
            advice = "Your relationship has a solid foundation but could benefit from improved communication and conflict resolution strategies. Consider setting aside regular time for meaningful conversations.";
            color = "#FFD166";
        } else if (percentage >= 40) {
            message = "Relationship Challenges Present";
            advice = "Your responses indicate some significant relationship challenges that may benefit from focused attention. Consider seeking relationship education resources or counseling to develop healthier patterns.";
            color = "#FF9E64";
        } else {
            message = "Significant Relationship Concerns";
            advice = "Your responses suggest substantial relationship difficulties that likely affect your wellbeing. Professional counseling could provide valuable tools and perspectives to address these challenges constructively.";
            color = "#FF6B6B";
        }
        
        return { message, advice, color };
    }

    displayFeatureImportance(responses) {
        const importantFeatures = this.model.getFeatureImportance(responses, this.dataLoader);
        const featureContainer = document.getElementById('featureImportance');
        
        featureContainer.innerHTML = `
            <h3>Key Relationship Factors</h3>
            <p style="font-size: 0.9em; margin-bottom: 20px; color: #666;">
                Based on your responses, these areas have the most impact on your relationship assessment:
            </p>
        `;
        
        importantFeatures.forEach(feature => {
            const featureBar = document.createElement('div');
            featureBar.className = 'feature-bar';
            
            const improvementText = feature.improvementPotential > 0.1 ? 
                ` (${Math.round(feature.improvementPotential * 100)}% improvement potential)` : '';
            
            featureBar.innerHTML = `
                <div class="feature-name">
                    ${feature.name}
                    <br><small>Your score: ${feature.currentValue}/4</small>
                </div>
                <div class="feature-value">
                    <div class="feature-fill" style="width: ${Math.min(feature.impact * 300, 100)}%"></div>
                </div>
                <div class="feature-impact" style="font-size: 0.9em; min-width: 100px;">
                    ${Math.round(feature.impact * 100)}% impact${improvementText}
                </div>
            `;
            featureContainer.appendChild(featureBar);
        });
    }

    resetAssessment() {
        // Reset all sliders to default
        for (let i = 0; i < this.dataLoader.getQuestions().length; i++) {
            const slider = document.getElementById(`q${i}`);
            if (slider) {
                slider.value = 2;
                this.updateSliderVisual(slider);
            }
        }
        
        // Hide results
        document.getElementById('resultSection').style.display = 'none';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading(message = 'Loading...') {
        const loadingSection = document.getElementById('loadingSection');
        loadingSection.querySelector('p').textContent = message;
        loadingSection.style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    showError(message) {
        alert(message); // In a production app, you'd use a better error display
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.relationshipApp = new RelationshipApp();
});
