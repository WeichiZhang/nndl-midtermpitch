// Machine Learning Model for Relationship Prediction
class RelationshipModel {
    constructor() {
        this.model = null;
        this.isTrained = false;
        this.trainingHistory = null;
    }

    createModel(inputShape) {
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({
                    inputShape: [inputShape],
                    units: 32,
                    activation: 'relu',
                    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
                }),
                tf.layers.dropout({ rate: 0.3 }),
                tf.layers.dense({
                    units: 16,
                    activation: 'relu',
                    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
                }),
                tf.layers.dropout({ rate: 0.2 }),
                tf.layers.dense({
                    units: 8,
                    activation: 'relu'
                }),
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid'
                })
            ]
        });

        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'binaryCrossentropy',
            metrics: ['accuracy', 'precision', 'recall']
        });

        return this.model;
    }

    async trainModel(features, labels, callbacks = {}) {
        if (!this.model) {
            this.createModel(features[0].length);
        }

        const xs = tf.tensor2d(features);
        const ys = tf.tensor1d(labels);

        const history = await this.model.fit(xs, ys, {
            epochs: 150,
            batchSize: 32,
            validationSplit: 0.2,
            verbose: 0,
            callbacks: callbacks
        });

        this.trainingHistory = history;
        this.isTrained = true;

        // Clean up tensors
        xs.dispose();
        ys.dispose();

        return history;
    }

    predict(inputs) {
        if (!this.isTrained) {
            throw new Error('Model not trained yet');
        }
        
        const inputTensor = tf.tensor2d([inputs]);
        const prediction = this.model.predict(inputTensor);
        const result = prediction.dataSync()[0];
        
        inputTensor.dispose();
        prediction.dispose();
        
        return result;
    }

    async evaluateModel(features, labels) {
        if (!this.isTrained) {
            throw new Error('Model not trained yet');
        }

        const xs = tf.tensor2d(features);
        const ys = tf.tensor1d(labels);

        const evaluation = this.model.evaluate(xs, ys);
        const loss = evaluation[0].dataSync()[0];
        const accuracy = evaluation[1].dataSync()[0];

        xs.dispose();
        ys.dispose();
        evaluation.forEach(tensor => tensor.dispose());

        return { loss, accuracy };
    }

    getFeatureImportance(inputs, dataLoader) {
        const importance = [];
        const baseScore = this.predict(inputs);
        
        for (let i = 0; i < inputs.length; i++) {
            // Test impact of setting this feature to maximum
            const maxInputs = [...inputs];
            maxInputs[i] = 4;
            const maxScore = this.predict(maxInputs);
            
            // Test impact of setting this feature to minimum
            const minInputs = [...inputs];
            minInputs[i] = 0;
            const minScore = this.predict(minInputs);
            
            // Calculate overall impact
            const impact = Math.abs(maxScore - minScore) * dataLoader.getQuestionWeights()[i];
            
            importance.push({
                name: dataLoader.getQuestions()[i],
                impact: impact,
                currentValue: inputs[i],
                improvementPotential: maxScore - baseScore,
                weight: dataLoader.getQuestionWeights()[i]
            });
        }
        
        // Sort by impact and return top features
        return importance.sort((a, b) => b.impact - a.impact).slice(0, 6);
    }

    async saveModel() {
        if (this.model) {
            await this.model.save('indexeddb://relationship-model');
        }
    }

    async loadModel() {
        try {
            this.model = await tf.loadLayersModel('indexeddb://relationship-model');
            this.isTrained = true;
            return true;
        } catch (error) {
            console.log('No saved model found, will train new model');
            return false;
        }
    }

    dispose() {
        if (this.model) {
            this.model.dispose();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RelationshipModel;
}
