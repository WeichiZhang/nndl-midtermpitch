// Enhanced App with Correct Dataset Numbers
class DivorcePredictionApp {
    constructor() {
        this.dataLoader = new DataLoader();
        this.model = new DivorcePredictionModel();
        this.isInitialized = false;
        
        this.initializeApp();
    }

    // ... (other methods remain the same until showEDAPanel) ...

    showEDAPanel() {
        const edaResults = this.dataLoader.getEDAResults();
        if (!edaResults) {
            console.log('EDA results not available yet');
            return;
        }

        const edaHTML = `
            <div class="card eda-panel">
                <h2>🧭 Relationship Compass Analysis</h2>
                <p style="margin-bottom: 25px; color: #666;">Understanding the patterns behind relationship dynamics based on 170 real couples</p>
                
                <!-- Basic Statistics -->
                <div class="eda-section">
                    <h4>📈 Dataset Overview</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.totalSamples}</div>
                            <div class="stat-label">Total Couples</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${edaResults.basicStats.totalFeatures}</div>
                            <div class="stat-label">Relationship Factors</div>
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
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #4ECDC4;">
                        <strong>📊 Dataset Composition:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li><strong>${edaResults.basicStats.divorceCount} couples divorced</strong> (${edaResults.basicStats.divorceRate}%)</li>
                            <li><strong>${edaResults.basicStats.stayCount} couples stayed married</strong> (${(100 - parseFloat(edaResults.basicStats.divorceRate)).toFixed(1)}%)</li>
                            <li><strong>${edaResults.basicStats.totalFeatures} psychological factors</strong> analyzed per couple</li>
                        </ul>
                    </div>
                </div>

                <!-- Data Quality -->
                <div class="eda-section">
                    <h4>🔍 Data Quality & Balance</h4>
                    <div class="quality-grid">
                        <div class="quality-item ${edaResults.missingValues.hasMissingValues ? 'warning' : 'good'}">
                            <span class="quality-label">Missing Values</span>
                            <span class="quality-value">${edaResults.missingValues.missingCount} (${edaResults.missingValues.missingPercentage}%)</span>
                        </div>
                        <div class="quality-item good">
                            <span class="quality-label">Data Completeness</span>
                            <span class="quality-value">${(100 - parseFloat(edaResults.missingValues.missingPercentage)).toFixed(1)}%</span>
                        </div>
                        <div class="quality-item ${edaResults.classImbalance.isBalanced ? 'good' : 'warning'}">
                            <span class="quality-label">Class Balance</span>
                            <span class="quality-value">${edaResults.classImbalance.isBalanced ? 'Balanced' : 'Mild Imbalance'}</span>
                        </div>
                    </div>
                    <div style="margin-top: 15px; font-size: 0.9em; color: #666;">
                        <strong>Balance Assessment:</strong> ${edaResults.basicStats.divorceCount} divorced vs ${edaResults.basicStats.stayCount} married → 
                        ${Math.abs(edaResults.basicStats.divorceCount - edaResults.basicStats.stayCount) <= 10 ? 'Well balanced' : 'Mildly imbalanced'}
                    </div>
                </div>

                <!-- Pattern Analysis -->
                <div class="eda-section">
                    <h4>🎭 Relationship Patterns Identified</h4>
                    <div class="pattern-analysis">
                        <div class="pattern-card high-risk">
                            <h5>🔴 Divorced Couples Pattern (${edaResults.basicStats.divorceCount} couples)</h5>
                            <p>${edaResults.clusteringPatterns.patternDescription.highRiskDescription}</p>
                            <div class="pattern-features">
                                <strong>Common patterns in divorced couples:</strong>
                                <ul>
                                    <li>Negative communication cycles</li>
                                    <li>Poor conflict resolution</li>
                                    <li>Emotional distance</li>
                                    <li>Frequent criticism and contempt</li>
                                </ul>
                            </div>
                        </div>
                        <div class="pattern-card low-risk">
                            <h5>🟢 Married Couples Pattern (${edaResults.basicStats.stayCount} couples)</h5>
                            <p>${edaResults.clusteringPatterns.patternDescription.lowRiskDescription}</p>
                            <div class="pattern-features">
                                <strong>Strengths in stable marriages:</strong>
                                <ul>
                                    <li>Positive communication</li>
                                    <li>Effective problem-solving</li>
                                    <li>Emotional intimacy</li>
                                    <li>Mutual respect and appreciation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Model Insights -->
                <div class="eda-section">
                    <h4>🤖 AI Analysis Engine</h4>
                    <div class="model-insights">
                        <div class="insight-item">
                            <strong>Neural Network Architecture</strong>
                            <p>3 hidden layers (54→32→16→8→1) trained on ${edaResults.basicStats.totalSamples} real couples with dropout regularization</p>
                        </div>
                        <div class="insight-item">
                            <strong>Training Approach</strong>
                            <p>100 epochs on actual relationship patterns (${edaResults.basicStats.divorceCount} divorced + ${edaResults.basicStats.stayCount} married) with 80/20 validation split</p>
                        </div>
                        <div class="insight-item">
                            <strong>Psychological Foundation</strong>
                            <p>Based on established research in communication, conflict resolution, and emotional intimacy using ${edaResults.basicStats.totalFeatures} psychological factors</p>
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

    // ... (rest of the methods remain the same) ...
}
