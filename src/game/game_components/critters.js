class Bug {
    constructor(rarity, name, x, y, image, scale, gameSettings, masterCollection, assets, genetics) {
      this.id = masterCollection.critterCollection.length;
      this.random = new Math.seedrandom(this.id + Date.now());
      this.rarity = rarity;
      this.name = name;
      this.gender = Math.random() < 0.5 ? "male" : "female";
      this.mate = 0;
      this.breedingCooldown = false;
      this.breedingCooldownSince = 0;
      this.breedingCooldownPausedTime = 0; // Total time the bug has been paused in the breedingCooldown state
      this.durationOfBreedingCooldown = 5; // in minutes 
      this.pregnant = false;
      this.pregnantSince = 0;
      this.pregnantPausedTime = 0; // Total time the bug has been paused in the pregnant state
      this.durationOfPregnancy = 1; // in minutes 
      this.age = 0;
      this.momentOfBirth = Date.now();
      this.lastAgingMoment = Date.now();
      this.durationOfAging = 2; // in minutes
      this.aging(); // Start aging
      this.paused = false;
      this.agingPausedTime = 0; // Total time the bug has been paused in the aging loop
      this.x = x;
      this.y = y;

      this.hunger = 100;
      
      this.isMovingToTarget = false;
      this.targetX = x + 100+ Math.random()*50;
      this.targetY = y + 100+ Math.random()*50;
      this.idleWiggle = 0;
      this.idleTime = 0;

      this.lastDetectedCritters = [];
      this.lastCheckTime = Date.now();
      this.timeToCheckTimers = false;

      const aspectRatio = image.width / image.height;
      this.width = scale * image.width;
      this.height = this.width / aspectRatio;
      this.image = image;

      masterCollection.critterCollection.push(this);
      gameSettings.canvasObjects.push(this);

      this.get_gameSettings = () => { return gameSettings;}
      this.get_critterCollection = () => { return masterCollection.critterCollection;}
      this.get_masterCollection = () => {return masterCollection;}
      this.get_assets = () => { return assets;}
      this.get_genetics = () => { return genetics;}
    }

    setAge(age) {
        this.age = age;
        console.log(`Age setted for critter ${this.id}, Age: ${this.age}`);
    }

    draw() {
            // Save the canvas state
            this.get_gameSettings().ctx.save();
            // Translate the canvas to the center of the bug's position
            this.get_gameSettings().ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            // Calculate the angle of rotation based on the bug's movement direction and its initial westward orientation
            const angle = Math.atan2(this.targetY - (this.y + this.height / 2), this.targetX - (this.x + this.width / 2)) + Math.PI;
            // Rotate the bug image with the corrected rotation
            this.get_gameSettings().ctx.rotate(angle);
            // Draw the bug image with the corrected rotation
            this.get_gameSettings().ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            // Restore the canvas state
            this.get_gameSettings().ctx.restore();

        this.get_gameSettings().ctx.font = "15px Arial";
        this.get_gameSettings().ctx.fillStyle = "white";
        this.get_gameSettings().ctx.textAlign = "center";
        this.get_gameSettings().ctx.fillText(this.name, this.x + this.width/1.8, this.y+7);
    }

    update() {
            // Update position logic goes here
            const currentTime = Date.now();
            const elapsedSeconds = (currentTime - this.lastCheckTime) / 1000; // Convert milliseconds to seconds
            if (elapsedSeconds >= 1) {
              this.timeToCheckTimers = true
              this.lastCheckTime = currentTime;
            }
            else {
              this.timeToCheckTimers = false;
            }
            
            this.live();
            //this.hunger -= 0.1; // Example: Decrease hunger over time
            //this.health -= 0.05; // Example: Decrease health over time
    }

    live() {
        
        if(!this.breedingCooldown) {
          this.detectBugsInRadius();
        }
        if(this.timeToCheckTimers){
          this.aging();
          if(this.pregnant) {
            this.isPregnant();
          }
          if(this.breedingCooldown) {
            this.isInBreedingCooldown();
          }
        }
        
        this.moveRandomly();
    }

    growOlder() {
        this.age++;
        this.lastAgingMoment = Date.now();
        this.agingPausedTime = 0;
        console.log(`Age increased of critter ${this.id}, Age: ${this.age}`);
        this.grow();
    }

    aging() {
      if(this.durationOfStateInMinutes(this.lastAgingMoment, this.agingPausedTime, this.durationOfAging)) {
        this.growOlder();
      }
    }

    detectBugsInRadius() {
      // Create an array to track the bugs detected in this frame
      const detectedBugs = [];
      const detectedMates = [];
      // Loop through all bugs in the critter collection using an arrow function
      this.get_critterCollection().forEach((otherBug) => {
          // Skip checking the bug against itself
          if (otherBug === this) {
              return;
          }
  
          // Calculate the distance between this bug and the other bug
          const distance = Math.sqrt(
              Math.pow(this.x - otherBug.x, 2) + Math.pow(this.y - otherBug.y, 2)
          );
  
          if (distance <= this.get_genetics().detectionRadius) {
              if (!this.lastDetectedCritters.includes(otherBug.name)) {
                  // Bug detected for the first time
                  console.log(`Critter ${this.name} detected ${otherBug.name}`);
                  this.lastDetectedCritters.push(otherBug.name);
              }
              detectedBugs.push(otherBug); // Add to the list of detected bugs
  
              if (otherBug.gender != this.gender &&
                  otherBug.age > 2 && this.age > 2 &&
                  otherBug.breedingCooldown == false && this.breedingCooldown == false) {
                    if (!detectedMates.includes(otherBug.name) && this.lastDetectedCritters.includes(otherBug.name)) {
                      console.log(`Critter ${this.name} detected possible mate ${otherBug.name}`);
                      detectedMates.push(otherBug.name);
                  }
                  console.log(`Critter ${this.name} found mate ${otherBug.name}`);
                  this.targetX = otherBug.x;
                  this.targetY = otherBug.y;
                  if(this.moveToTarget()) {
                    this.mate = otherBug;
                    this.breed();
                  }
              }
          } else {
              this.moveRandomly();
          }
      });
  
      // Update the last detected critters with the newly detected ones
      this.lastDetectedCritters = detectedBugs.map((bug) => bug.name);
  
      // Remove bugs that are no longer detectable from the lastDetectedCritters list
      this.lastDetectedCritters = this.lastDetectedCritters.filter((bugName) =>
          detectedBugs.some((bug) => bug.name === bugName)
      );
  }
  

    breed() {
      this.breedingCooldown = true;
        if(this.gender === 'female') {
          this.breedingCooldownSince = Date.now();
          this.pregnant = true;
          this.pregnantSince = Date.now();
          console.log(`Critter ${this.name} is pregnant`);
          console.log(this);
        }
    }

    isInBreedingCooldown() {
      if (this.breedingCooldown) {
        if (this.durationOfStateInMinutes(this.breedingCooldownSince, this.breedingCooldownPausedTime, this.durationOfBreedingCooldown)) {
          this.breedingCooldownSince = 0;
          this.breedingCooldown = false;
        }
      }
    }
    

    isPregnant() {
      if(this.durationOfStateInMinutes(this.pregnantSince, this.pregnantPausedTime, this.durationOfPregnancy)) {
        this.layEggs();
      }
    }

    layEggs() {
      this.pregnant = false;
      console.log(`Critter ${this.name} just laid an egg`);
      newEgg(this.mate, this, this.get_gameSettings(), this.get_masterCollection(), this.get_assets(), .4);
      //newBug(this.x, this.y, this.get_gameSettings(), this.get_assets(), "TEST " + this.get_masterCollection().critterCollection.length, 0.4, this.get_masterCollection(), newGenetic("default", "default"))
    }

    grow() {
        if(this.scale < 1) {
            this.scale = this.scale + 2*this.random();
            console.log(`Critter ${this.id} grew to ${this.scale}`);
        }
    }

    moveToTarget() {
        const deltaX = this.targetX - this.x;
        const deltaY = this.targetY - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        const directionX = deltaX / distance;
        const directionY = deltaY / distance;
        
        if (distance > this.get_genetics().speed) {
          this.x += directionX * this.get_genetics().speed;
          this.y += directionY * this.get_genetics().speed;
          return false; // Bug is still moving towards the target
        } else {
          return true; // Bug has reached the target
        }
      }
    
      moveRandomly() {
        if (!this.isMovingToTarget && this.idleTime <= 0) {
          let minDistance = 200;
      
          // Calculate a random distance and angle
          const distance = minDistance + this.random() * (this.get_gameSettings().canvas.width - minDistance * 2);
          const angle = this.random() * Math.PI * 2;
      
          // Calculate the new target position based on the bug's current position
          this.targetX = this.x + distance * Math.cos(angle);
          this.targetY = this.y + distance * Math.sin(angle);
      
          // Ensure the target stays within the canvas bounds
          this.targetX = Math.min(this.get_gameSettings().canvas.width - this.width, Math.max(0, this.targetX));
          this.targetY = Math.min(this.get_gameSettings().canvas.height - this.height, Math.max(0, this.targetY));
            
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
        this.x += Math.sin(this.idleWiggle) * .05; // Adjust the values to control the intensity
        this.y += Math.cos(this.idleWiggle) * .1; // of the wiggle effect.
        this.idleWiggle += 0.05; // Adjust the speed of the wiggle.
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

  
  

  

  