class Egg {
    constructor(father, mother, image, gameSettings, masterCollection, assets, scale) {
        this.id = masterCollection.eggCollection.length;
        this.timeToCheckTimers = false;
        this.assets = assets;
        this.x = mother.x !== undefined ? mother.x : Math.floor(Math.random() * (750 - 2 + 1)) + 2;
        this.y = mother.y !== undefined ? mother.y : Math.floor(Math.random() * (750 - 2 + 1)) + 2;
        this.momentSpawned = Date.now();
        this.durationOfIncubation = .5; // in minutes
        this.paused = false;
        this.timePaused = 0;

        this.image = image;
        this.scale = scale;
        const aspectRatio = image.width / image.height;
        this.width = this.scale * image.width;
        this.height = this.width / aspectRatio;

        masterCollection.eggCollection.push(this);
        gameSettings.canvasObjects.push(this);

        this.get_mother = () => {return mother;}
        this.get_father = () => {return father;}
        this.get_gameSettings = () => { return gameSettings;}
        this.get_eggCollection = () => { return masterCollection.eggCollection;}
        this.get_masterCollection = () => {return masterCollection;}
        this.get_assets = () => { return assets;}
    }

    update() {
            const currentTime = Date.now();
            const elapsedMilliseconds = currentTime - this.momentSpawned - this.timePaused;
            if (elapsedMilliseconds >= this.durationOfIncubation * 60 * 1000) {
                console.log(`Ready to hatch egg ${this.id}`);
                this.hatch();
            } else {
                // Continue incubating
            }
    }

    draw() {
        // Save the canvas state
        this.get_gameSettings().ctx.save();
        // Translate the canvas to the egg's position
        this.get_gameSettings().ctx.translate(this.x, this.y);
        // Draw the egg image
        this.get_gameSettings().ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        // Restore the canvas state
        this.get_gameSettings().ctx.restore();
    }

    isClicked(x, y) {
        // Check if the (x, y) coordinates of the click are within the bug's boundaries
        const leftX = this.x - this.width / 2;
        const rightX = this.x + this.width / 2;
        const topY = this.y - this.height / 2;
        const bottomY = this.y + this.height / 2;
  
        return x >= leftX && x <= rightX && y >= topY && y <= bottomY;
    }

    hatch() {
        // Remove the egg from the canvas
        const indexInCanvas = this.get_gameSettings().canvasObjects.indexOf(this);
        if (indexInCanvas !== -1) {
            this.get_gameSettings().canvasObjects.splice(indexInCanvas, 1);
            console.log(`Removed egg ${this.id} from canvas`);
        }
        // Remove the egg from the eggCollection
        const indexInEggCollection = this.get_eggCollection().indexOf(this);

        if (indexInEggCollection !== -1) {
            this.get_eggCollection().splice(indexInEggCollection, 1);
            console.log(`Removed egg ${this.id} from collection`);
        }
        console.log(`Hatching egg ${this.id}`);
        newBug(this.x, this.y, this.get_gameSettings(), this.get_assets(), "Critter " + this.get_masterCollection().critterCollection.length, 0.4, this.get_masterCollection(), this.mixGenetics())
    }

    mixGenetics() {
        console.log(`Mixing genetics for egg ${this.id}`);
        const gen = newGenetic(this.get_mother(), this.get_father());
        return gen;
    }

    durationOfStateInMinutes(startTime, pausedTime, duration) {
        if (!this.paused) {
            const now = Date.now();
            const elapsedTime = Math.floor((now - startTime - pausedTime) / (60 * 1000));
            
            if (elapsedTime >= duration) {
                return true;
            }
        }
        return false;
    }
}