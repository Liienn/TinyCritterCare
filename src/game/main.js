document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 80;
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("overlay");
    const overlayText = document.getElementById("overlay-text");
    const toggleButton = document.getElementById("toggle-button");
    const pauseButton = document.getElementById("pause-button");
    const inventoryButton = document.getElementById("inventory-button");
    const menuButton = document.getElementById("menu-button");

    const gameSettings = {
      canvas,
      ctx,
      canvasObjects: [],
      // Add other game settings here
    };

    let isPaused = true; // Initial state (paused)
    toggleButton.addEventListener("click", () => {
        isPaused = !isPaused;
        if (isPaused) {
            pauseGame();
        } else {
            unpauseGame();
        }
    });

    function pauseGame() {
        console.log("Game Paused");
        toggleButton.textContent = "Play";
        toggleButton.style.backgroundColor = "green";
        overlay.style.display = "flex";
        overlayText.style.display = "block";
        setPausedToTrue();
    }
    
    function unpauseGame() {
        console.log("Game Unpaused");
        toggleButton.textContent = "Pause";
        toggleButton.style.backgroundColor = "grey";
        overlay.style.display = "none";
        overlayText.style.display = "none";
        setPausedToFalse();
    }

    // Load game assets (e.g., sprites, sounds)
    loadAssets()
      .then((assets) => {
        // Asset loading is complete; start the game
        startGame(gameSettings, assets);
      })
      .catch((error) => {
        console.error("Error loading assets:", error);
      });
  });

  let isPaused = true;

function setPausedToTrue() {
    console.log("isPaused set to TRUE");
    isPaused = true;
}
function setPausedToFalse() {
    console.log("isPaused set to FALSE");
    isPaused = false;
}

  // Load game assets (e.g., sprites, sounds)
  function loadAssets() {
    return new Promise((resolve, reject) => {
      const assets = {};
      const assetPromises = [];
  
      const loadImage = (src, key) => {
        const image = new Image();
        image.src = src;
  
        const promise = new Promise((resolve, reject) => {
          image.onload = () => {
            assets[key] = image;
            resolve();
          };
          image.onerror = () => {
            reject(`Failed to load asset: ${src}`);
          };
        });
  
        assetPromises.push(promise);
      };
  
      // Define your assets here
      loadImage('../../assets/critters/pillbugs/sprites/Pillbug_default.png', 'defaultBugImage');
      loadImage('../../assets/critters/pillbugs/sprites/Pillbug_striped.png', 'stripedBugImage');
      loadImage('../../assets/critters/pillbugs/sprites/Pillbug_default_egg.png', 'defaultEggImage');
  
      // Use Promise.all to wait for all asset promises to resolve
      Promise.all(assetPromises)
        .then(() => {
            console.log(assets);
          resolve(assets);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  
  // Start the game
  function startGame(gameSettings, assets) {
    console.log("Game Started");
    const masterCollection = {
      critterCollection: [],
      eggCollection: [],
      foodCollection: [],
      itemCollection: []
    };

    const gen = newGenetic("default", "default");

    newBug(600, 300, gameSettings, assets, "Kirriki", .7, masterCollection, gen);
    newBug(100, 400, gameSettings, assets,  "Virriv", .7, masterCollection, gen);
    newEgg("default","default", gameSettings, masterCollection, assets, .4);
    newEgg("default","default", gameSettings, masterCollection, assets, .4);

    masterCollection.critterCollection.forEach((critter) => {
        critter.setAge(50);
    });
    

    // Initialize game objects, set up game loop, handle user input, and more
    // Example: const player = new Player(gameSettings, assets.playerImage);
    // Example: const enemies = initializeEnemies(gameSettings, assets.enemyImage);
    
    // Start the game loop
    gameLoop(gameSettings, assets, masterCollection);
  }
  
  // Game loop
  function gameLoop(gameSettings, assets, masterCollection) {
    const update = () => {
        if(!isPaused){
            isNotPaused(gameSettings, assets, masterCollection);
        }
        if(isPaused) {
            Paused(gameSettings, assets, masterCollection);
        }
    
        
      // Update game logic, check for collisions, and handle game events
      // Example: player.update();
      // Example: enemies.update();
    };
  
    const render = () => {
        // Clear the canvas at the beginning of each frame
        gameSettings.ctx.clearRect(0, 0, gameSettings.canvas.width, gameSettings.canvas.height);

        // Draw game elements, including player, enemies, and more
        masterCollection.eggCollection.forEach((egg) => {
          egg.draw();
        });
        masterCollection.critterCollection.forEach((critter) => {
            critter.draw();
        });
        
        // Example: player.draw();
        // Example: enemies.forEach((enemy) => enemy.draw());
    };
  
    const loop = () => {
      update();
      render();
      requestAnimationFrame(loop);
    };
  
    loop();
  }
  