// Simplified Machine Learning Model for Relationship Prediction
class RelationshipModel {
    constructor() {
        this.model = null;
        this.isTrained = false;
    }

    async createAndTrainModel(inputShape, dataLoader) {
        try {
            console.log('Creating model...');
            
            // Create a simpler model
            this.model = tf.sequential({
                layers: [
                    tf.layers.dense({
                        inputShape: [inputShape],
                        units: 8,
                        activation: 'relu'
                    }),
                    tf.layers.dense({
                        units: 4,
                        activation: 'relu'
                    }),
                    tf.layers.dense({
                        units: 1,
                        activation: 'sigmoid'
                    })
                ]
            });

            console.log('Compiling model...');
            this.model.compile({
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });

            // Generate simpler training data
            console.log('Generating training data...');
            const { features, labels } = dataLoader.generateTrainingData(500); // Reduced samples
            
            console.log('Training model...');
            const xs = tf.tensor2d(features);
            const ys = tf.tensor1d(labels);

            await this.model.fit(xs, ys, {
                epochs: 50, // Reduced epochs
                batchSize: 32,
                validationSplit: 0.2,
                verbose: 0
            });

            this.isTrained = true;
            
            // Clean up
            xs.dispose();
            ys.dispose();
            
            console.log('Model trained successfully');
            return true;
            
        } catch (error) {
            console.error('Error in model training:', error);
            this.model = null;
            return false;
        }
    }

    predict(inputs) {
        if (!this.isTrained || !this.model) {
            throw new Error('Model not trained yet');
        }
        
        try {
            const inputTensor = tf.tensor2d([inputs]);
            const prediction = this.model.predict(inputTensor);
            const result = prediction.dataSync()[0];
            
            inputTensor.dispose();
            prediction.dispose();
            
            return result;
        } catch (error) {
            console.error('Prediction error:', error);
            // Return a fallback calculation based on inputs
            return this.fallbackPrediction(inputs);
        }
    }

    fallbackPrediction(inputs) {
        // Simple weighted average as fallback
        const weights = [1.0, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.6, 0.5, 0.5, 0.4, 0.7, 0.4];
        let weightedSum = 0;
        let totalWeight = 0;
        
        for (let i = 0; i < inputs.length; i++) {
            weightedSum += inputs[i] * weights[i];
            totalWeight += weights[i];
        }
        
        const average = weightedSum / totalWeight;
        // Convert to 0-1 scale (since inputs are 0-4)
        return average / 4;
    }

    getFeatureImportance(inputs, dataLoader) {
        try {
            if (!this.isTrained) {
                return this.fallbackFeatureImportance(inputs, dataLoader);
            }

            const importance = [];
            const baseScore = this.predict(inputs);
            
            for (let i = 0; i < inputs.length; i++) {
                const maxInputs = [...inputs];
                maxInputs[i] = 4;
                const maxScore = this.predict(maxInputs);
                
                const impact = Math.abs(maxScore - baseScore);
                
                importance.push({
                    name: dataLoader.getQuestions()[i],
                    impact: impact,
                    currentValue: inputs[i]
                });
            }
            
            return importance.sort((a, b) => b.impact - a.impact).slice(0, 5);
        } catch (error) {
            console.error('Feature importance error:', error);
            return this.fallbackFeatureImportance(inputs, dataLoader);
        }
    }

    fallbackFeatureImportance(inputs, dataLoader) {
        const weights = [1.0, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.6, 0.5, 0.5, 0.4, 0.7, 0.4];
        const importance = [];
        
        for (let i = 0; i < inputs.length; i++) {
            importance.push({
                name: dataLoader.getQuestions()[i],
                impact: weights[i] * (1 - inputs[i] / 4), // Higher impact if current score is low
                currentValue: inputs[i]
            });
        }
        
        return importance.sort((a, b) => b.impact - a.impact).slice(0, 5);
    }

    dispose() {
        if (this.model) {
            this.model.dispose();
        }
    }
}
