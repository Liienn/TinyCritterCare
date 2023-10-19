class Food {
    constructor(gameSettings, masterCollection, image, scale, assets) {
        this.type = "food";
        this.id = masterCollection.foodCollection.length;
        this.value = 30;
        this.momentSpawned = Date.now();
        this.paused = false;
        this.timePaused = 0;
        this.timeUntilSpoiled = 10;
        this.isEaten = false;

        this.x = Math.floor(Math.random() * (gameSettings.canvas.width-20) +20);
        this.y = Math.floor(Math.random() * (gameSettings.canvas.height-20) +20);

        this.image = assets.defaultFoodImage_svg;
        this.scale = scale;
        const aspectRatio = image.width / image.height;
        this.width = this.scale * image.width;
        this.height = this.width / aspectRatio;

      this.get_gameSettings = () => { return gameSettings;}
      this.get_masterCollection = () => {return masterCollection;}
      this.get_assets = () => {return assets;}

      masterCollection.foodCollection.push(this);
      gameSettings.canvasObjects.push(this);
    }

    update() {
        const currentTime = Date.now();
        const elapsedMilliseconds = currentTime - this.momentSpawned - this.timePaused;
        if(this.isEaten)
        {
            this.getEaten();
        }
        if (elapsedMilliseconds >= this.timeUntilSpoiled * 60 * 1000) {
            console.log(`Food ${this.id} spoiled`);
            this.spoil();
        } else {
            // Continue being fresh
            //this.grow();
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

    grow() {
        this.scale = this.scale + 0.0000005;
        this.width = this.width * this.scale;
        this.height = this.height * this.scale;
        this.draw();
    }

    spoil() {
        this.type = "spoiled";
    }

    getEaten() {
        this.type = "gone";
        // Remove the image from the canvas
      const indexInCanvas = this.get_gameSettings().canvasObjects.indexOf(this);
      if (indexInCanvas !== -1) {
          this.get_gameSettings().canvasObjects.splice(indexInCanvas, 1);
          console.log(`Food ${this.id} got eaten.`);
      }
      // Remove the item from the Collection
      const indexInFoodCollection = this.get_masterCollection().foodCollection.indexOf(this);

      if (indexInFoodCollection !== -1) {
          this.get_masterCollection().foodCollection.splice(indexInFoodCollection, 1);
      }

      newDefaultFood(this.get_gameSettings(), this.get_masterCollection(), this.get_assets(), 0.3)
    }
    

}
