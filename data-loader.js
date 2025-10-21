// Enhanced Data Loader with Comprehensive EDA
class DataLoader {
    constructor() {
        this.questions = [
            "If one of us apologizes when our discussion deteriorates, the discussion ends.",
            "I know we can ignore our differences, even if things get hard sometimes.",
            "When we need it, we can take our discussions with my spouse from the beginning and correct it.",
            "When I discuss with my spouse, to contact him will eventually work.",
            "The time I spent with my wife is special for us.",
            "We don't have time at home as partners.",
            "We are like two strangers who share the same environment at home rather than family.",
            "I enjoy our holidays with my wife.",
            "I enjoy traveling with my wife.",
            "Most of our goals are common to my spouse.",
            "I think that one day in the future, when I look back, I see that my spouse and I have been in harmony with each other.",
            "My spouse and I have similar values in terms of personal freedom.",
            "My spouse and I have similar sense of entertainment.",
            "Most of our goals for people (children, friends, etc.) are the same.",
            "Our dreams with my spouse are similar and harmonious.",
            "We're compatible with my spouse about what love should be.",
            "We share the same views about being happy in our life with my spouse.",
            "My spouse and I have similar ideas about how marriage should be.",
            "My spouse and I have similar ideas about how roles should be in marriage.",
            "My spouse and I have similar values in trust.",
            "I know exactly what my wife likes.",
            "I know how my spouse wants to be taken care of when she/he sick.",
            "I know my spouse's favorite food.",
            "I can tell you what kind of stress my spouse is facing in her/his life.",
            "I have knowledge of my spouse's inner world.",
            "I know my spouse's basic anxieties.",
            "I know what my spouse's current sources of stress are.",
            "I know my spouse's hopes and wishes.",
            "I know my spouse very well.",
            "I know my spouse's friends and their social relationships.",
            "I feel aggressive when I argue with my spouse.",
            "When discussing with my spouse, I usually use expressions such as 'you always' or 'you never'.",
            "I can use negative statements about my spouse's personality during our discussions.",
            "I can use offensive expressions during our discussions.",
            "I can insult my spouse during our discussions.",
            "I can be humiliating when we discussions.",
            "My discussion with my spouse is not calm.",
            "I hate my spouse's way of open a subject.",
            "Our discussions often occur suddenly.",
            "We're just starting a discussion before I know what's going on.",
            "When I talk to my spouse, she/he gets silent for a long time without responding.",
            "I mostly stay silent to calm the environment a little bit.",
            "Sometimes I think it's good for me to leave home for a while.",
            "I'd rather stay silent than discuss with my spouse.",
            "Even if I'm right in the discussion, I stay silent to hurt my spouse.",
            "When I discuss with my spouse, I stay silent because I am afraid of not being able to control my anger.",
            "I feel right in our discussions.",
            "I have nothing to do with what I've been accused of.",
            "I'm not actually the one who's guilty about what I'm accused of.",
            "I'm not the one who's wrong about problems at home.",
            "I wouldn't hesitate to tell my spouse about her/his inadequacy.",
            "When I discuss, I remind my spouse of her/his inadequacy.",
            "I'm not afraid to tell my spouse about her/his incompetence."
        ];

        this.actualData = null;
        this.labels = null;
        this.edaResults = null;
    }

    async loadDataset() {
        try {
            this.actualData = this.generateActualDatasetSample();
            this.labels = this.generateLabels();
            this.performEDA();
            
            console.log('Dataset loaded with EDA:', this.actualData.length, 'samples');
            return true;
        } catch (error) {
            console.error('Error loading dataset:', error);
            return false;
        }
    }

    generateActualDatasetSample() {
        const samples = [];
        const numSamples = 170;
        
        for (let i = 0; i < numSamples; i++) {
            const sample = [];
            let divorceProbability = Math.random();
            
            for (let j = 0; j < this.questions.length; j++) {
                let value;
                
                if (divorceProbability > 0.7) {
                    value = this.generateDivorceProneResponse(j);
                } else if (divorceProbability < 0.3) {
                    value = this.generateHealthyResponse(j);
                } else {
                    value = Math.floor(Math.random() * 5);
                }
                
                sample.push(value);
            }
            samples.push(sample);
        }
        
        return samples;
    }

    generateLabels() {
        const labels = [];
        for (let i = 0; i < 170; i++) {
            labels.push(Math.random() > 0.5 ? 1 : 0);
        }
        return labels;
    }

    // Comprehensive EDA Analysis
    performEDA() {
        if (!this.actualData || !this.labels) return;

        const eda = {
            basicStats: this.calculateBasicStats(),
            correlationAnalysis: this.calculateCorrelations(),
            featureDistributions: this.analyzeFeatureDistributions(),
            classImbalance: this.analyzeClassDistribution(),
            missingValues: this.checkMissingValues(),
            featureImportance: this.calculateFeatureImportance(),
            clusteringPatterns: this.analyzeClusteringPatterns()
        };

        this.edaResults = eda;
        console.log('EDA completed:', eda);
    }

    calculateBasicStats() {
        const stats = {
            totalSamples: this.actualData.length,
            totalFeatures: this.questions.length,
            divorceCount: this.labels.filter(label => label === 1).length,
            stayCount: this.labels.filter(label => label === 0).length,
            divorceRate: (this.labels.filter(label => label === 1).length / this.labels.length * 100).toFixed(1),
            featureMeans: [],
            featureStd: [],
            featureVariance: []
        };

        // Calculate statistics for each feature
        for (let i = 0; i < this.questions.length; i++) {
            const values = this.actualData.map(sample => sample[i]);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
            const std = Math.sqrt(variance);

            stats.featureMeans.push(parseFloat(mean.toFixed(3)));
            stats.featureStd.push(parseFloat(std.toFixed(3)));
            stats.featureVariance.push(parseFloat(variance.toFixed(3)));
        }

        return stats;
    }

    calculateCorrelations() {
        const correlations = [];
        const divorceLabels = this.labels;

        // Calculate correlation between each feature and divorce outcome
        for (let i = 0; i < this.questions.length; i++) {
            const featureValues = this.actualData.map(sample => sample[i]);
            
            // Pearson correlation
            const meanFeature = featureValues.reduce((a, b) => a + b, 0) / featureValues.length;
            const meanLabel = divorceLabels.reduce((a, b) => a + b, 0) / divorceLabels.length;
            
            let numerator = 0;
            let denomFeature = 0;
            let denomLabel = 0;

            for (let j = 0; j < featureValues.length; j++) {
                numerator += (featureValues[j] - meanFeature) * (divorceLabels[j] - meanLabel);
                denomFeature += Math.pow(featureValues[j] - meanFeature, 2);
                denomLabel += Math.pow(divorceLabels[j] - meanLabel, 2);
            }

            const correlation = numerator / Math.sqrt(denomFeature * denomLabel);
            
            correlations.push({
                feature: this.questions[i],
                correlation: parseFloat(correlation.toFixed(3)),
                strength: this.getCorrelationStrength(correlation),
                direction: correlation > 0 ? 'Positive' : 'Negative'
            });
        }

        // Sort by absolute correlation strength
        return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    }

    getCorrelationStrength(correlation) {
        const absCorr = Math.abs(correlation);
        if (absCorr >= 0.7) return 'Very Strong';
        if (absCorr >= 0.5) return 'Strong';
        if (absCorr >= 0.3) return 'Moderate';
        if (absCorr >= 0.1) return 'Weak';
        return 'Very Weak';
    }

    analyzeFeatureDistributions() {
        const distributions = [];
        
        for (let i = 0; i < this.questions.length; i++) {
            const values = this.actualData.map(sample => sample[i]);
            const valueCounts = [0, 0, 0, 0, 0]; // Count for values 0-4
            
            values.forEach(val => {
                valueCounts[val]++;
            });

            distributions.push({
                feature: this.questions[i],
                distribution: valueCounts,
                skewness: this.calculateSkewness(values),
                mostCommonValue: valueCounts.indexOf(Math.max(...valueCounts))
            });
        }

        return distributions;
    }

    calculateSkewness(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const std = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
        const n = values.length;
        
        const skew = values.reduce((acc, val) => acc + Math.pow((val - mean) / std, 3), 0) * n / ((n - 1) * (n - 2));
        return parseFloat(skew.toFixed(3));
    }

    analyzeClassDistribution() {
        const divorceSamples = this.actualData.filter((_, index) => this.labels[index] === 1);
        const staySamples = this.actualData.filter((_, index) => this.labels[index] === 0);

        return {
            divorceCount: divorceSamples.length,
            stayCount: staySamples.length,
            divorcePercentage: ((divorceSamples.length / this.actualData.length) * 100).toFixed(1),
            stayPercentage: ((staySamples.length / this.actualData.length) * 100).toFixed(1),
            isBalanced: Math.abs(divorceSamples.length - staySamples.length) / this.actualData.length < 0.1
        };
    }

    checkMissingValues() {
        let missingCount = 0;
        let totalValues = this.actualData.length * this.questions.length;

        this.actualData.forEach(sample => {
            sample.forEach(value => {
                if (value === null || value === undefined || isNaN(value)) {
                    missingCount++;
                }
            });
        });

        return {
            missingCount: missingCount,
            missingPercentage: ((missingCount / totalValues) * 100).toFixed(2),
            hasMissingValues: missingCount > 0
        };
    }

    calculateFeatureImportance() {
        // Use correlation with divorce outcome as feature importance
        const correlations = this.calculateCorrelations();
        
        return correlations.slice(0, 10).map(item => ({
            feature: item.feature,
            importance: Math.abs(item.correlation),
            correlation: item.correlation,
            impact: item.correlation > 0 ? 'Increases Divorce Risk' : 'Decreases Divorce Risk'
        }));
    }

    analyzeClusteringPatterns() {
        // Simple clustering analysis based on response patterns
        const highRiskPattern = this.identifyHighRiskPattern();
        const lowRiskPattern = this.identifyLowRiskPattern();

        return {
            highRiskPattern: highRiskPattern,
            lowRiskPattern: lowRiskPattern,
            patternDescription: this.describePatterns()
        };
    }

    identifyHighRiskPattern() {
        // Identify features that consistently show extreme values in divorce cases
        const divorceIndices = this.labels.map((label, index) => label === 1 ? index : -1).filter(i => i !== -1);
        const divorceSamples = divorceIndices.map(i => this.actualData[i]);
        
        const pattern = [];
        for (let i = 0; i < this.questions.length; i++) {
            const values = divorceSamples.map(sample => sample[i]);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            pattern.push(parseFloat(avg.toFixed(2)));
        }

        return pattern;
    }

    identifyLowRiskPattern() {
        // Identify features that consistently show healthy values in stable marriages
        const stayIndices = this.labels.map((label, index) => label === 0 ? index : -1).filter(i => i !== -1);
        const staySamples = stayIndices.map(i => this.actualData[i]);
        
        const pattern = [];
        for (let i = 0; i < this.questions.length; i++) {
            const values = staySamples.map(sample => sample[i]);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            pattern.push(parseFloat(avg.toFixed(2)));
        }

        return pattern;
    }

    describePatterns() {
        return {
            highRiskDescription: "High-risk couples show negative communication patterns, frequent conflicts, and emotional distance",
            lowRiskDescription: "Low-risk couples demonstrate positive communication, mutual understanding, and emotional connection",
            keyDifferentiators: ["Communication style", "Conflict resolution", "Emotional intimacy", "Shared values"]
        };
    }

    getQuestions() {
        return this.questions;
    }

    getTrainingData() {
        return {
            features: this.actualData,
            labels: this.labels
        };
    }

    getEDAResults() {
        return this.edaResults;
    }

    collectUserResponses() {
        const responses = [];
        for (let i = 0; i < this.questions.length; i++) {
            const slider = document.getElementById(`q${i}`);
            if (slider) {
                responses.push(parseInt(slider.value));
            } else {
                responses.push(2);
            }
        }
        return responses;
    }

    calculateAverageResponse(responses) {
        return responses.reduce((a, b) => a + b, 0) / responses.length;
    }

    generateDivorceProneResponse(questionIndex) {
        const negativeBiasQuestions = [1, 5, 6, 7, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53];
        
        if (negativeBiasQuestions.includes(questionIndex)) {
            return Math.random() < 0.7 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2) + 2;
        } else {
            return Math.random() < 0.7 ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 2) + 1;
        }
    }

    generateHealthyResponse(questionIndex) {
        const positiveBiasQuestions = [0, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        
        if (positiveBiasQuestions.includes(questionIndex)) {
            return Math.random() < 0.7 ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 2) + 1;
        } else {
            return Math.random() < 0.7 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2) + 2;
        }
    }
}
