// Data configuration and question management
class DataLoader {
    constructor() {
        this.questions = [
            "We communicate openly and honestly with each other",
            "We resolve conflicts in a healthy, constructive manner",
            "We trust each other completely",
            "We share similar values and life goals",
            "We make important decisions together",
            "We support each other's personal growth",
            "We regularly spend quality time together",
            "We show appreciation and gratitude for each other",
            "We maintain a healthy physical intimacy",
            "We respect each other's individuality and space",
            "We handle financial matters cooperatively",
            "We have similar expectations about family life",
            "We can laugh and have fun together",
            "We support each other during difficult times",
            "We are satisfied with our division of household responsibilities"
        ];

        this.questionWeights = this.generateQuestionWeights();
    }

    generateQuestionWeights() {
        // Assign weights to questions based on psychological research
        // Communication and conflict resolution are typically most important
        const weights = {
            // High importance (communication, trust, conflict resolution)
            0: 1.0, // Communication
            1: 0.9, // Conflict resolution
            2: 0.9, // Trust
            3: 0.8, // Shared values
            4: 0.8, // Decision making
            
            // Medium importance (support, intimacy, respect)
            5: 0.7, // Personal growth support
            6: 0.7, // Quality time
            7: 0.6, // Appreciation
            8: 0.6, // Physical intimacy
            9: 0.6, // Respect individuality
            
            // Lower importance (but still relevant)
            10: 0.5, // Financial cooperation
            11: 0.5, // Family expectations
            12: 0.4, // Fun together
            13: 0.7, // Support in difficult times
            14: 0.4  // Household responsibilities
        };
        return weights;
    }

    getQuestions() {
        return this.questions;
    }

    getQuestionWeights() {
        return this.questionWeights;
    }

    generateTrainingData(numSamples = 1000) {
        const features = [];
        const labels = [];
        const numFeatures = this.questions.length;

        for (let i = 0; i < numSamples; i++) {
            const sample = [];
            let relationshipScore = 0;
            
            // Generate realistic relationship patterns
            const relationshipType = Math.random();
            
            for (let j = 0; j < numFeatures; j++) {
                let value;
                const weight = this.questionWeights[j];
                
                if (relationshipType < 0.3) {
                    // Healthy relationship pattern
                    value = this.generateHealthyResponse(weight);
                } else if (relationshipType < 0.6) {
                    // Mixed relationship pattern
                    value = this.generateMixedResponse(weight);
                } else {
                    // Strained relationship pattern
                    value = this.generateStrainedResponse(weight);
                }
                
                sample.push(value);
                relationshipScore += value * weight;
            }
            
            features.push(sample);
            
            // Convert to binary label (0 = strained, 1 = healthy)
            const normalizedScore = relationshipScore / (numFeatures * 4);
            labels.push(normalizedScore > 0.6 ? 1 : 0);
        }
        
        return { features, labels };
    }

    generateHealthyResponse(weight) {
        // Healthy relationships tend to have higher scores, especially on important factors
        if (weight > 0.8) {
            // Very high scores on important factors
            return Math.random() < 0.8 ? 
                Math.floor(Math.random() * 2) + 3 : // 3-4 (80% chance)
                Math.floor(Math.random() * 2) + 2;  // 2-3 (20% chance)
        } else {
            return Math.random() < 0.7 ? 
                Math.floor(Math.random() * 2) + 2 : // 2-4 (70% chance)
                Math.floor(Math.random() * 3);      // 0-2 (30% chance)
        }
    }

    generateMixedResponse(weight) {
        // Mixed relationships have varied responses
        if (weight > 0.8) {
            return Math.floor(Math.random() * 3) + 1; // 1-3
        } else {
            return Math.floor(Math.random() * 5); // 0-4
        }
    }

    generateStrainedResponse(weight) {
        // Strained relationships tend to have lower scores, especially on important factors
        if (weight > 0.8) {
            // Low scores on important factors
            return Math.random() < 0.7 ? 
                Math.floor(Math.random() * 2) :     // 0-1 (70% chance)
                Math.floor(Math.random() * 2) + 1;  // 1-2 (30% chance)
        } else {
            return Math.random() < 0.6 ? 
                Math.floor(Math.random() * 3) :     // 0-2 (60% chance)
                Math.floor(Math.random() * 2) + 2;  // 2-3 (40% chance)
        }
    }

    collectUserResponses() {
        const responses = [];
        for (let i = 0; i < this.questions.length; i++) {
            const slider = document.getElementById(`q${i}`);
            if (slider) {
                responses.push(parseInt(slider.value));
            }
        }
        return responses;
    }

    calculateAverageResponse(responses) {
        return responses.reduce((a, b) => a + b, 0) / responses.length;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}
