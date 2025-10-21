// Main Application Logic
class RelationshipApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.model = new RelationshipModel();
        this.isInitialized = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        try {
            this.showLoading('Initializing relationship assessment tool...');
            
            // Check if TensorFlow.js is available
            if (typeof tf === 'undefined') {
                throw new Error('TensorFlow.js not loaded. Please check your internet connection.');
            }

            // Initialize questions first so user can see them
            this.initializeQuestions();
            this.setupEventListeners();
            
            // Train model in background
            setTimeout(async () => {
                try {
                    await this.trainModel();
                    this.isInitialized = true;
                    this.hideLoading();
                    console.log('Application initialized successfully');
                } catch (error) {
                    console.error('Model training failed:', error);
                    this.showError('Model initialization failed. Using fallback analysis method.');
                    this.isInitialized = true; // Still allow usage with fallback
                    this.hideLoading();
                }
            }, 100);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    async trainModel() {
        const success = await this.model.createAndTrainModel(
            this.dataLoader.getQuestions().length, 
            this.dataLoader
        );
        
        if (!success) {
            throw new Error('Model training failed');
        }
    }

    initializeQuestions() {
        const container = document.getElementById('questionsContainer');
        const questions = this.dataLoader.getQuestions();
        
        if (!container) {
            throw new Error('Questions container not found');
        }
        
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

        // Initialize slider visuals
        this.setupSliderInteractions();
    }

    setupEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resetBtn = document.getElementById('resetBtn');
        const retryBtn = document.getElementById('retryBtn');

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeResponses());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAssessment());
        }
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.retryInitialization());
        }
    }

    setupSliderInteractions() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('slider')) {
                this.updateSliderVisual(e.target);
            }
        });

        // Initialize all sliders
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => this.updateSliderVisual(slider));
    }

    updateSliderVisual(slider) {
        const value = parseInt(slider.value);
        const percentage = (value / 4) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
    }

    async analyzeResponses() {
        if (!this.isInitialized) {
            this.showError('Application is still initializing. Please wait...');
            return;
        }

        this.showLoading('Analyzing your responses...');

        // Use setTimeout to allow UI to update
        setTimeout(() => {
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
                console.error('Analysis error:', error);
                this.showError('Analysis failed: ' + error.message);
                this.hideLoading();
            }
        }, 500);
    }

    displayResults(percentage, averageResponse, responses) {
        const { message, advice, color } = this.generateResultMessage(percentage, averageResponse);
        
        document.getElementById('resultScore').textContent = `${percentage}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('resultMessage').innerHTML = `
            <strong style="color: ${color}">${message}</strong><br><br>
            ${advice}<br><br>
            <small>Average response score: ${averageResponse.toFixed(1)}/4.0</small>
        `;
        
        this.displayFeatureImportance(responses);
        
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultMessage(percentage, averageResponse) {
        let message, advice, color;
        
        if (percentage >= 80) {
            message = "Excellent Relationship Dynamics!";
            advice = "Your relationship shows strong communication, trust, and mutual support. Continue nurturing these positive patterns.";
            color = "#4ECDC4";
        } else if (percentage >= 65) {
            message = "Healthy Relationship Foundation";
            advice = "Your relationship has many positive qualities with good communication patterns. Focus on maintaining your strengths.";
            color = "#6BCF7F";
        } else if (percentage >= 50) {
            message = "Good Foundation with Growth Opportunities";
            advice = "Your relationship has a solid base but could benefit from improved communication and conflict resolution strategies.";
            color = "#FFD166";
        } else if (percentage >= 35) {
            message = "Relationship Challenges Present";
            advice = "Your responses indicate some relationship challenges that may benefit from focused attention and open communication.";
            color = "#FF9E64";
        } else {
            message = "Significant Relationship Concerns";
            advice = "Your responses suggest substantial relationship difficulties. Professional counseling could provide valuable support.";
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
                Areas with most impact on your relationship assessment:
            </p>
        `;
        
        importantFeatures.forEach(feature => {
            const featureBar = document.createElement('div');
            featureBar.className = 'feature-bar';
            
            featureBar.innerHTML = `
                <div class="feature-name">
                    ${feature.name}
                    <br><small>Your score: ${feature.currentValue}/4</small>
                </div>
                <div class="feature-value">
                    <div class="feature-fill" style="width: ${Math.min(feature.impact * 200, 100)}%"></div>
                </div>
                <div class="feature-impact" style="font-size: 0.9em; min-width: 80px;">
                    ${Math.round(feature.impact * 100)}% impact
                </div>
            `;
            featureContainer.appendChild(featureBar);
        });
    }

    resetAssessment() {
        for (let i = 0; i < this.dataLoader.getQuestions().length; i++) {
            const slider = document.getElementById(`q${i}`);
            if (slider) {
                slider.value = 2;
                this.updateSliderVisual(slider);
            }
        }
        
        document.getElementById('resultSection').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    retryInitialization() {
        this.hideError();
        this.initializeApp();
    }

    showLoading(message = 'Loading...') {
        const loadingSection = document.getElementById('loadingSection');
        const loadingText = document.getElementById('loadingText');
        if (loadingSection && loadingText) {
            loadingText.textContent = message;
            loadingSection.style.display = 'block';
        }
    }

    hideLoading() {
        const loadingSection = document.getElementById('loadingSection');
        if (loadingSection) {
            loadingSection.style.display = 'none';
        }
    }

    showError(message) {
        this.hideLoading();
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        if (errorSection && errorMessage) {
            errorMessage.textContent = message;
            errorSection.style.display = 'block';
            errorSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(message); // Fallback
        }
    }

    hideError() {
        const errorSection = document.getElementById('errorSection');
        if (errorSection) {
            errorSection.style.display = 'none';
        }
    }
}

// Initialize the application
let relationshipApp;

document.addEventListener('DOMContentLoaded', () => {
    relationshipApp = new RelationshipApp();
});
