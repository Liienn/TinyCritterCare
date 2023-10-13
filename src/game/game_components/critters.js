class Bug {
    constructor(rarity, name, x, y, image, scale, gameSettings, critterCollection, assets) {
      this.gameSettings = gameSettings;
      this.critterCollection = critterCollection;
      this.assets = assets;
      this.id = critterCollection.length;
      this.random = new Math.seedrandom(this.id);
      this.rarity = rarity;
      this.name = name;
      this.gender = Math.random() < 0.5 ? "male" : "female";
      this.breedingCooldown = 0;
      this.age = 0;
      this.momentOfBirth = Date.now();
      this.lastAgingMoment = Date.now();
      this.aging(); // Start aging
      this.paused = false;
      this.totalPausedTime = 0; // Total time the bug has been paused
      this.x = x;
      this.y = y;
      this.image = image;

      this.hunger = 100;
      this.health = 100;
      this.energy = 100;

      this.detectionRadius = 200;
      this.speed = 0.5;

      this.isMovingToTarget = false;
      this.targetX = x;
      this.targetY = y;
      this.idleWiggle = 0;
      this.idleTime = 0;

      const aspectRatio = image.width / image.height;
      this.width = scale * image.width;
      this.height = this.width / aspectRatio;

      critterCollection.push(this);
    }

    setAge(age) {
        console.log("Setted age of critter ", this.id);
        this.age = age;
    }

    draw() {
            // Save the canvas state
            this.gameSettings.ctx.save();

            // Translate the canvas to the center of the bug's position
            this.gameSettings.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            // Calculate the angle of rotation based on the bug's movement direction and its initial westward orientation
            const angle = Math.atan2(this.targetY - (this.y + this.height / 2), this.targetX - (this.x + this.width / 2)) + Math.PI;

            // Rotate the bug image with the corrected rotation
            this.gameSettings.ctx.rotate(angle);

            // Draw the bug image with the corrected rotation
            this.gameSettings.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

            // Restore the canvas state
            this.gameSettings.ctx.restore();

        this.gameSettings.ctx.font = "15px Arial";
        this.gameSettings.ctx.fillStyle = "white";
        this.gameSettings.ctx.textAlign = "center";
        this.gameSettings.ctx.fillText(this.name, this.x + this.width/1.8, this.y+7);
    }

    update() {
            // Update position logic goes here
            this.live();
            //this.hunger -= 0.1; // Example: Decrease hunger over time
            //this.health -= 0.05; // Example: Decrease health over time
    }

    live() {
        this.moveRandomly();
    }

    growOlder() {
        this.age++;
        this.lastAgingMoment = Date.now();
        console.log("Age increased of critter ", this.id);
        console.log("Age: ", this.age);
        this.grow();
        if(this.breedingCooldown > 0) {
            console.log("Breeding cooldown reduced of critter ", this.id);
            this.breedingCooldown--;
        }
    }

    aging() {
        setInterval(() => {
          if (!this.paused) {
            const now = Date.now();
            const elapsedTime = now - this.lastAgingMoment;
            const adjustedElapsedTime = elapsedTime - this.totalPausedTime;
            const ageInMinutes = Math.floor(adjustedElapsedTime / (60 * 1000));
            
            if (ageInMinutes >= 1) {
              this.growOlder();
              this.totalPausedTime = 0;
            }
          }
        }, 1000); // Check every second
      }

    detectBugsInRadius() {
        // Loop through all bugs in the critter collection
        for (const otherBug of this.critterCollection) {
            // Skip checking the bug against itself
            if (otherBug === this) {
                continue;
            }

            // Calculate the distance between this bug and the other bug
            const distance = Math.sqrt(
                Math.pow(this.x - otherBug.x, 2) + Math.pow(this.y - otherBug.y, 2)
            );

            // If the other bug is within the detection radius, you can respond to it
            if (distance <= this.detectionRadius) {
                if(otherBug.gender != this.gender &&
                    otherBug.age > 2 && this.age > 2 &&
                    otherBug.breedingCooldown === 0 && this.breedingCooldown === 0) {
                        console.log("I found a mate!");
                        this.targetX = otherBug.x;
                        this.targetY = otherBug.y;
                        while(this.moveToTarget()){
                            this.targetX = otherBug.x;
                            this.targetY = otherBug.y;}
                        this.breed();
                    }
                // Implement your response here
                // For example, you can change the direction of this bug
                // or make it follow or avoid the other bug
            }
        }
    }

    breed() {
        if(this.gender === 'female') {
            console.log("Breeded critter ", this.id);
            newDefaultBug(this.gameSettings, this.assets, "Critter " + (this.critterCollection.length + 1) , 0.3, this.critterCollection);
            this. breedingCooldown = 10*this.random();
        }
    }

    grow() {
        if(this.scale < 1) {
            this.scale = this.scale + 2*this.random();
            console.log("Size increased of critter ", this.id);
        }
    }

    moveToTarget() {
        const deltaX = this.targetX - this.x;
        const deltaY = this.targetY - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const directionX = deltaX / distance;
        const directionY = deltaY / distance;
        
        if (distance > this.speed) {
          this.x += directionX * this.speed;
          this.y += directionY * this.speed;
          return false; // Bug is still moving towards the target
        } else {
            console.log("Target reached by critter ", this.id);
          return true; // Bug has reached the target
        }
      }
    
      moveRandomly() {
        if (!this.isMovingToTarget && this.idleTime <= 0) {
          let minDistance = 200;
      
          // Calculate a random distance and angle
          const distance = minDistance + this.random() * (this.gameSettings.canvas.width - minDistance * 2);
          const angle = this.random() * Math.PI * 2;
      
          // Calculate the new target position based on the bug's current position
          this.targetX = this.x + distance * Math.cos(angle);
          this.targetY = this.y + distance * Math.sin(angle);
      
          // Ensure the target stays within the canvas bounds
          this.targetX = Math.min(this.gameSettings.canvas.width - this.width, Math.max(0, this.targetX));
          this.targetY = Math.min(this.gameSettings.canvas.height - this.height, Math.max(0, this.targetY));
            
          this.isMovingToTarget = true;
        }
      
        if (this.moveToTarget()) {
            
          // Bug is still moving towards the target
        } else {
          // Bug has reached the target, make it idle for a moment
          this.isMovingToTarget = false;
          this.idleTime = this.random() * 100; // Adjust the idle time (in frames) as needed
        }
      
        if (this.idleTime > 0) {
          this.idleTime--;
          this.idleAnimation();
        }
      }
      
      

    idleAnimation() {
        // Modify the bug's position for idle animation
        this.x += Math.sin(this.idleWiggle) * .1; // Adjust the values to control the intensity
        this.y += Math.cos(this.idleWiggle) * .1; // of the wiggle effect.
        this.idleWiggle += 0.05; // Adjust the speed of the wiggle.
    }

  }

  

  