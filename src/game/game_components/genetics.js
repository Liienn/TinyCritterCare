class Genetics {
    constructor(mother, father) {
        // Initialize genetic traits here
        this.rarity = Math.random()*20;
        this.detectionRadius = 500 + (Math.random()-0.5) * 50;
        this.speed = 0.2;
        this.health = 100;
        this.energy = 100;

        if (mother !== "default") {
            // If it's not a default genetics, inherit traits
            this.inherit(mother, father);
        }
    }

    // Method to inherit genetic traits
    inherit(mother, father) {
        if (mother === "default") {
            // If mother's genetics are "default," do not inherit
            return this;
        }

        for (let trait in this) {
            if (this.hasOwnProperty(trait) && typeof this[trait] !== 'function') {
                // Calculate inherited value based on mother and father traits
                const inheritedValue = (mother.get_genetics()[trait] + father.get_genetics()[trait]) / 2;

                // Add some variation (randomness) to the inherited value
                const variation = (Math.random() - 0.5) * inheritedValue/2; // Adjust the variation range as needed
                this[trait] = Math.max(0.2, inheritedValue + variation);
            }
        }
    }
}

