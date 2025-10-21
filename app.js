// Enhanced App with Better Question Organization
class DivorcePredictionApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.model = new DivorcePredictionModel();
        this.isInitialized = false;
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            this.showLoading('Loading relationship assessment tool...');
            
            if (typeof tf === 'undefined') {
                throw new Error('Machine learning library not loaded. Please check your internet connection.');
            }

            const datasetLoaded = await this.dataLoader.loadDataset();
            if (!datasetLoaded) {
                throw new Error('Failed to load dataset');
            }

            this.initializeQuestionsByCategory();
            this.setupEventListeners();
            this.showComprehensiveEDAPanel();

            setTimeout(async () => {
                try {
                    await this.trainModel();
                    this.isInitialized = true;
                    this.hideLoading();
                    this.showNotification('Model ready for analysis!');
                } catch (error) {
                    console.error('Model training failed:', error);
                    this.isInitialized = true;
                    this.hideLoading();
                    this.showNotification('Using simplified analysis method');
                }
            }, 100);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Initialization failed: ' + error.message);
        }
    }

    initializeQuestionsByCategory() {
        const container = document.getElementById('questionsContainer');
        const questions = this.dataLoader.getQuestions();
        
        if (!container) {
            throw new Error('Questions container not found');
        }
        
        container.innerHTML = '';

        // Organize questions by categories
        const categories = [
            {
                title: "💬 Communication & Conflict Resolution",
                questions: questions.slice(0, 5), // Q1-5
                description: "How you communicate and resolve disagreements"
            },
            {
                title: "❤️ Emotional Connection & Quality Time",
                questions: questions.slice(5, 10), // Q6-10
                description: "Your emotional bond and shared experiences"
            },
            {
                title: "🎯 Shared Values & Life Goals",
                questions: questions.slice(10, 20), // Q11-20
                description: "Alignment in values, dreams, and expectations"
            },
            {
                title: "🤝 Mutual Understanding & Knowledge",
                questions: questions.slice(20, 30), // Q21-30
                description: "How well you know and understand each other"
            },
            {
                title: "⚡ Communication Challenges",
                questions: questions.slice(30, 40), // Q31-40
                description: "Patterns that may hinder healthy communication",
                critical: true
            },
            {
                title: "🚨 Conflict & Emotional Safety",
                questions: questions.slice(40, 54), // Q41-54
                description: "How you handle conflicts and emotional situations",
                critical: true
            }
        ];

        categories.forEach((category, categoryIndex) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'question-category';
            
            if (category.critical) {
                categorySection.style.borderLeftColor = 'var(--primary)';
                categorySection.style.background = 'linear-gradient(135deg, #FFFCF5, #FFE8E8)';
            }

            let questionsHTML = '';
            
            category.questions.forEach((question, questionIndex) => {
                const globalIndex = this.getGlobalQuestionIndex(categoryIndex, questionIndex);
                const isCritical = globalIndex >= 30;
                const criticalBadge = isCritical ? '<span class="critical-badge">Important</span>' : '';
                
                questionsHTML += `
                    <div class="question-item ${isCritical ? 'critical' : ''}">
                        <div class="question-text">
                            <span class="question-number">${globalIndex + 1}</span>
                            ${question} ${criticalBadge}
                        </div>
                        <div class="slider-container">
                            <div class="slider-wrapper">
                                <input type="range" min="0" max="4" value="2" class="slider" id="q${globalIndex}">
                            </div>
                            <div class="slider-labels">
                                <span>Never</span>
                                <span>Rarely</span>
                                <span>Sometimes</span>
                                <span>Often</span>
                                <span>Always</span>
                            </div>
                            <div class="slider-value-display">
                                <span class="slider-value" id="valueq${globalIndex}">2</span>
                            </div>
                            <div class="response-labels">
                                <span>Strongly Disagree</span>
                                <span>Strongly Agree</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            categorySection.innerHTML = `
                <div class="category-title">
                    ${category.title}
                </div>
                <p style="color: #666; margin-bottom: 20px; font-size: 0.95em;">${category.description}</p>
                <div class="question-list">
                    ${questionsHTML}
                </div>
            `;

            container.appendChild(categorySection);
        });

        this.setupSliderInteractions();
    }

    getGlobalQuestionIndex(categoryIndex, questionIndex) {
        // Calculate the global index based on category
        const categorySizes = [5, 5, 10, 10, 10, 14]; // Questions per category
        let globalIndex = 0;
        
        for (let i = 0; i < categoryIndex; i++) {
            globalIndex += categorySizes[i];
        }
        
        return globalIndex + questionIndex;
    }

    setupSliderInteractions() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('slider')) {
                this.updateSliderVisual(e.target);
                const valueDisplay = document.getElementById(`value${e.target.id}`);
                if (valueDisplay) {
                    const value = parseInt(e.target.value);
                    const responses = ["Never", "Rarely", "Sometimes", "Often", "Always"];
                    valueDisplay.textContent = responses[value];
                    valueDisplay.style.background = this.getSliderColor(value);
                }
            }
        });

        // Initialize all sliders
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            this.updateSliderVisual(slider);
            const valueDisplay = document.getElementById(`value${slider.id}`);
            if (valueDisplay) {
                const value = parseInt(slider.value);
                const responses = ["Never", "Rarely", "Sometimes", "Often", "Always"];
                valueDisplay.textContent = responses[value];
                valueDisplay.style.background = this.getSliderColor(value);
            }
        });
    }

    getSliderColor(value) {
        const colors = [
            'linear-gradient(135deg, #FF6B6B, #FF8E8E)', // Never - Red
            'linear-gradient(135deg, #FF9E64, #FFB896)', // Rarely - Orange
            'linear-gradient(135deg, #FFD166, #FFDE8C)', // Sometimes - Yellow
            'linear-gradient(135deg, #4ECDC4, #6BD4CD)', // Often - Teal
            'linear-gradient(135deg, #6BCF7F, #85D891)'  // Always - Green
        ];
        return colors[value] || colors[2];
    }

    updateSliderVisual(slider) {
        const value = parseInt(slider.value);
        const percentage = (value / 4) * 100;
        const colorStops = [
            '#FF6B6B', '#FF9E64', '#FFD166', '#4ECDC4', '#6BCF7F'
        ];
        
        slider.style.background = `linear-gradient(to right, 
            ${colorStops[0]} 0%, 
            ${colorStops[1]} 25%, 
            ${colorStops[2]} 50%, 
            ${colorStops[3]} 75%, 
            ${colorStops[4]} 100%)`;
    }

    // ... rest of the methods remain the same but use the new structure ...

    setupEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeResponses());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAssessment());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryInitialization());
    }

    async analyzeResponses() {
        if (!this.isInitialized) {
            this.showError('Application is still initializing. Please wait...');
            return;
        }

        this.showLoading('Analyzing relationship patterns...');

        setTimeout(() => {
            try {
                const responses = this.dataLoader.collectUserResponses();
                
                if (responses.some(r => r === undefined)) {
                    this.showError('Please answer all questions before analyzing.');
                    return;
                }

                const divorceProbability = this.model.predict(responses);
                const percentage = Math.round(divorceProbability * 100);
                const averageResponse = this.dataLoader.calculateAverageResponse(responses);
                
                this.displayResults(percentage, averageResponse, responses);
                this.hideLoading();
                
            } catch (error) {
                console.error('Analysis error:', error);
                this.showError('Analysis failed: ' + error.message);
                this.hideLoading();
            }
        }, 1000);
    }

    displayResults(divorceProbability, averageResponse, responses) {
        const { message, advice, color, riskLevel, riskClass } = this.generateResultMessage(divorceProbability, averageResponse);
        
        document.getElementById('resultScore').textContent = `${divorceProbability}%`;
        document.getElementById('progressFill').style.width = `${divorceProbability}%`;
        document.getElementById('resultMessage').innerHTML = `
            <div class="risk-indicator ${riskClass}">${riskLevel}</div>
            <strong style="font-size: 1.4em; display: block; margin-bottom: 20px; color: ${color};">${message}</strong>
            <div style="text-align: left; line-height: 1.7;">
                ${advice}
            </div>
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
                <small style="color: #666;">Average response score: ${averageResponse.toFixed(1)}/4.0</small>
            </div>
        `;
        
        this.displayFeatureImportance(responses);
        
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultMessage(probability, averageResponse) {
        let message, advice, color, riskLevel, riskClass;
        
        if (probability >= 80) {
            riskLevel = "🔴 HIGH RELATIONSHIP RISK";
            riskClass = "risk-high";
            message = "Significant Relationship Challenges Detected";
            advice = "Your responses indicate patterns strongly associated with relationship distress. Key areas of concern include communication breakdown, frequent conflicts, and emotional distance. These patterns often benefit from professional support to develop healthier communication and conflict resolution strategies.";
            color = "#FF6B6B";
        } else if (probability >= 60) {
            riskLevel = "🟡 MODERATE RELATIONSHIP CONCERNS";
            riskClass = "risk-medium";
            message = "Notable Relationship Patterns Need Attention";
            advice = "Several areas in your relationship show patterns that could benefit from focused attention. Consider working on communication skills, conflict resolution approaches, and emotional connection. Relationship education resources or couples counseling could provide valuable tools for improvement.";
            color = "#FF9E64";
        } else if (probability >= 40) {
            riskLevel = "🟠 ELEVATED AWARENESS NEEDED";
            riskClass = "risk-medium";
            message = "Some Relationship Patterns Require Attention";
            advice = "Your relationship shows a mix of healthy and challenging patterns. While many areas are positive, some communication and conflict resolution approaches could be strengthened. Regular check-ins and conscious effort in these areas could significantly improve your relationship satisfaction.";
            color = "#FFD166";
        } else {
            riskLevel = "🟢 HEALTHY RELATIONSHIP PATTERNS";
            riskClass = "risk-low";
            message = "Generally Positive Relationship Dynamics";
            advice = "Your responses indicate healthy communication patterns, effective conflict resolution skills, and strong emotional connection. Continue nurturing these positive aspects through regular quality time, open communication, and mutual appreciation. These patterns are associated with long-term relationship satisfaction.";
            color = "#4ECDC4";
        }
        
        return { message, advice, color, riskLevel, riskClass };
    }

    displayFeatureImportance(responses) {
        const importantFeatures = this.model.getFeatureImportance(responses, this.dataLoader);
        const featureContainer = document.getElementById('featureImportance');
        
        featureContainer.innerHTML = `
            <h3 style="margin-bottom: 30px;">🔍 Key Relationship Factors</h3>
            <p style="font-size: 1em; margin-bottom: 30px; color: #666; line-height: 1.6;">
                Based on psychological research and machine learning analysis, these factors showed the strongest influence on your relationship assessment:
            </p>
        `;
        
        importantFeatures.forEach(feature => {
            const featureBar = document.createElement('div');
            featureBar.className = `feature-bar ${feature.isCritical ? 'critical-feature' : ''}`;
            
            featureBar.innerHTML = `
                <div class="feature-name">
                    ${feature.name}
                    ${feature.isCritical ? ' <span style="color: var(--primary); font-size: 0.8em;">● Critical Factor</span>' : ''}
                    <br>
                    <small style="color: #666; font-weight: normal;">Your response: <strong>${this.getResponseText(feature.currentValue)}</strong></small>
                </div>
                <div class="feature-value">
                    <div class="feature-fill" style="width: ${Math.min(feature.impact * 200, 100)}%"></div>
                </div>
                <div class="feature-impact">
                    ${Math.round(feature.impact * 100)}% impact
                </div>
            `;
            featureContainer.appendChild(featureBar);
        });
    }

    getResponseText(value) {
        const responses = ["Never", "Rarely", "Sometimes", "Often", "Always"];
        return responses[value] || "Unknown";
    }

    resetAssessment() {
        for (let i = 0; i < this.dataLoader.getQuestions().length; i++) {
            const slider = document.getElementById(`q${i}`);
            if (slider) {
                slider.value = 2;
                this.updateSliderVisual(slider);
                const valueDisplay = document.getElementById(`valueq${i}`);
                if (valueDisplay) {
                    valueDisplay.textContent = "Sometimes";
                    valueDisplay.style.background = this.getSliderColor(2);
                }
            }
        }
        
        document.getElementById('resultSection').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    retryInitialization() {
        this.hideError();
        this.initializeApp();
    }

    showNotification(message) {
        // Could be enhanced with a toast notification
        console.log('Notification:', message);
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
        }
    }

    hideError() {
        const errorSection = document.getElementById('errorSection');
        if (errorSection) {
            errorSection.style.display = 'none';
        }
    }

    // ... EDA methods remain the same ...
}

// Initialize application
let divorcePredictionApp;

document.addEventListener('DOMContentLoaded', () => {
    divorcePredictionApp = new DivorcePredictionApp();
});
