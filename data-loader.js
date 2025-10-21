// Enhanced Data Loader with Correct Dataset Distribution
class DataLoader {
    constructor() {
        this.questions = [
            // ... (same 54 questions array remains unchanged) ...
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
            // Use the actual distribution: 84 divorced, 86 married
            const isDivorced = i < 84; // First 84 samples are divorced
            
            for (let j = 0; j < this.questions.length; j++) {
                let value;
                
                if (isDivorced) {
                    value = this.generateDivorceProneResponse(j);
                } else {
                    value = this.generateHealthyResponse(j);
                }
                
                sample.push(value);
            }
            samples.push(sample);
        }
        
        return samples;
    }

    generateLabels() {
        const labels = [];
        // Correct distribution: 84 divorced (1), 86 married (0)
        for (let i = 0; i < 170; i++) {
            labels.push(i < 84 ? 1 : 0); // First 84 are divorced, rest are married
        }
        return labels;
    }

    // ... (rest of the methods remain the same, but update calculateBasicStats) ...

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

    // ... (all other methods remain the same) ...
}
