// Enhanced App with Comprehensive EDA Display
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

            this.initializeQuestions();
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

    async trainModel() {
        this.showLoading('Training AI model on relationship data...');
        
        const { features, labels } = this.dataLoader.getTrainingData();
        const success = await this.model.createAndTrainModel(features, labels);
        
        if (!success) {
            throw new Error('Model training unsuccessful');
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
            
            const isCritical = index >= 30;
            const criticalBadge = isCritical ? '<span class="critical-badge">Important</span>' : '';
            
            questionItem.innerHTML = `
                <p><strong>${index + 1}.</strong> ${question} ${criticalBadge}</p>
                <div class="slider-container">
                    <input type="range" min="0" max="4" value="2" class="slider" id="q${index}">
                    <div class="slider-labels">
                        <span>Never</span>
                        <span>Always</span>
                    </div>
                    <div class="slider-value" id="valueq${index}">2</div>
                </div>
            `;
            container.appendChild(questionItem);
        });

        this.setupSliderInteractions();
    }

    showComprehensiveEDAPanel() {
        const edaResults = this.dataLoader.getEDAResults();
        if (!edaResults) {
            console.log('EDA results not available yet');
            return;
        }

        const edaHTML = `
            <div class="eda-panel comprehensive-eda">
                <h3>📊 Comprehensive Dataset Analysis</h3>
                
                <!-- Basic Statistics -->
                <div class="eda-section">
                    <h4>📈 Basic Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.totalSamples}</div>
                            <div class="stat-label">Total Couples</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.totalFeatures}</div>
                            <div class="stat-label">Survey Questions</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.divorceCount}</div>
                            <div class="stat-label">Divorced</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.stayCount}</div>
                            <div class="stat-label">Stayed Married</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.divorceRate}%</div>
                            <div class="stat-label">Divorce Rate</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.classImbalance.isBalanced ? 'Yes' : 'No'}</div>
                            <div class="stat-label">Balanced Dataset</div>
                        </div>
                    </div>
                </div>

                <!-- Data Quality -->
                <div class="eda-section">
                    <h4>🔍 Data Quality Analysis</h4>
                    <div class="quality-grid">
                        <div class="quality-item ${edaResults.missingValues.hasMissingValues ? 'warning' : 'good'}">
                            <span class="quality-label">Missing Values</span>
                            <span class="quality-value">${edaResults.missingValues.missingCount} (${edaResults.missingValues.missingPercentage}%)</span>
                        </div>
                        <div class="quality-item good">
                            <span class="quality-label">Data Completeness</span>
                            <span class="quality-value">${(100 - parseFloat(edaResults.missingValues.missingPercentage)).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <!-- Top Correlations -->
                <div class="eda-section">
                    <h4>🔗 Top Predictive Features</h4>
                    <div class="correlation-list">
                        ${edaResults.correlationAnalysis.slice(0, 8).map(item => `
                            <div class="correlation-item ${item.correlation > 0 ? 'positive' : 'negative'}">
                                <span class="correlation-feature">${this.truncateText(item.feature, 50)}</span>
                                <span class="correlation-value">${item.correlation}</span>
                                <span class="correlation-strength ${item.strength.toLowerCase().replace(' ', '-')}">${item.strength}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Pattern Analysis -->
                <div class="eda-section">
                    <h4>🎭 Relationship Patterns</h4>
                    <div class="pattern-analysis">
                        <div class="pattern-card high-risk">
                            <h5>🔴 High-Risk Pattern</h5>
                            <p>${edaResults.clusteringPatterns.patternDescription.highRiskDescription}</p>
                            <div class="pattern-features">
                                <strong>Key Indicators:</strong>
                                <ul>
                                    <li>Negative communication style</li>
                                    <li>Poor conflict resolution</li>
                                    <li>Emotional distance</li>
                                </ul>
                            </div>
                        </div>
                        <div class="pattern-card low-risk">
                            <h5>🟢 Low-Risk Pattern</h5>
                            <p>${edaResults.clusteringPatterns.patternDescription.lowRiskDescription}</p>
                            <div class="pattern-features">
                                <strong>Protective Factors:</strong>
                                <ul>
                                    <li>Positive communication</li>
                                    <li>Effective conflict resolution</li>
                                    <li>Emotional intimacy</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const aboutCard = document.querySelector('.card');
        if (aboutCard) {
            aboutCard.insertAdjacentHTML('afterend', edaHTML);
        }
    }

    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    setupEventListeners() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeResponses());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetAssessment());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryInitialization());
    }

    setupSliderInteractions() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('slider')) {
                this.updateSliderVisual(e.target);
                const valueDisplay = document.getElementById(`value${e.target.id}`);
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            }
        });

        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            this.updateSliderVisual(slider);
            const valueDisplay = document.getElementById(`value${slider.id}`);
            if (valueDisplay) {
                valueDisplay.textContent = slider.value;
            }
        });
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
        const { message, advice, color, riskLevel } = this.generateResultMessage(divorceProbability, averageResponse);
        
        document.getElementById('resultScore').textContent = `${divorceProbability}%`;
        document.getElementById('progressFill').style.width = `${divorceProbability}%`;
        document.getElementById('resultMessage').innerHTML = `
            <div style="color: ${color}; font-weight: bold; margin-bottom: 15px;">${riskLevel}</div>
            <strong>${message}</strong><br><br>
            ${advice}<br><br>
            <small>Average response score: ${averageResponse.toFixed(1)}/4.0</small>
        `;
        
        this.displayFeatureImportance(responses);
        
        const resultSection = document.getElementById('resultSection');
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    generateResultMessage(probability, averageResponse) {
        let message, advice, color, riskLevel;
        
        if (probability >= 80) {
            riskLevel = "🔴 HIGH RISK";
            message = "Significant relationship challenges detected";
            advice = "Your responses indicate patterns associated with higher divorce risk. Key issues include communication breakdown, conflict escalation, and emotional distance. Professional counseling is strongly recommended.";
            color = "#FF6B6B";
        } else if (probability >= 60) {
            riskLevel = "🟡 MODERATE RISK";
            message = "Notable relationship concerns present";
            advice = "Several areas show patterns that may benefit from attention. Focus on improving communication, resolving conflicts constructively, and rebuilding emotional connection. Relationship education or counseling could be helpful.";
            color = "#FFD166";
        } else if (probability >= 40) {
            riskLevel = "🟠 ELEVATED AWARENESS";
            message = "Some relationship patterns need attention";
            advice = "Your relationship shows mixed patterns. While many areas are healthy, some communication and conflict resolution patterns could be improved. Regular check-ins and conscious effort could strengthen your bond.";
            color = "#FF9E64";
        } else {
            riskLevel = "🟢 HEALTHY PATTERNS";
            message = "Generally positive relationship dynamics";
            advice = "Your responses indicate healthy communication, good conflict resolution skills, and strong emotional connection. Continue nurturing these positive patterns through regular quality time and open communication.";
            color = "#4ECDC4";
        }
        
        return { message, advice, color, riskLevel };
    }

    displayFeatureImportance(responses) {
        const importantFeatures = this.model.getFeatureImportance(responses, this.dataLoader);
        const featureContainer = document.getElementById('featureImportance');
        
        featureContainer.innerHTML = `
            <h3>🔍 Key Relationship Factors</h3>
            <p style="font-size: 0.9em; margin-bottom: 20px; color: #666;">
                Based on psychological research, these factors most influence relationship outcomes:
            </p>
        `;
        
        importantFeatures.forEach(feature => {
            const featureBar = document.createElement('div');
            featureBar.className = `feature-bar ${feature.isCritical ? 'critical-feature' : ''}`;
            
            featureBar.innerHTML = `
                <div class="feature-name">
                    ${feature.name}
                    ${feature.isCritical ? ' <span class="critical-dot"></span>' : ''}
                    <br><small>Your response: ${this.getResponseText(feature.currentValue)}</small>
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
                    valueDisplay.textContent = "2";
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
}

// Initialize application
let divorcePredictionApp;

document.addEventListener('DOMContentLoaded', () => {
    divorcePredictionApp = new DivorcePredictionApp();
});
