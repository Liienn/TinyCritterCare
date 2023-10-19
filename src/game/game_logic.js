function makeBugsClickable(gameSettings, masterCollection) {
    gameSettings.canvas.addEventListener("click", (event) => {
        const mouseX = event.clientX - gameSettings.canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - gameSettings.canvas.getBoundingClientRect().top;
    
        masterCollection.critterCollection.forEach((critter) => {
            if (critter.isClicked(mouseX, mouseY)) {
                // Bug is clicked
                console.log(`Bug ${critter.name} is clicked.`);
                // Implement any actions you want to perform when a bug is clicked
            }
        });
        masterCollection.eggCollection.forEach((egg) => {
            if (egg.isClicked(mouseX, mouseY)) {
                // Bug is clicked
                console.log(`egg ${egg.id} is clicked.`);
                // Implement any actions you want to perform when a bug is clicked
            }
        });
    });
}

function newBug(x, y, gameSettings, assets, name, scale, masterCollection, gen) {
    const rarity = gen.rarity !== undefined ? gen.rarity : Math.random()*20;
    if(rarity < 10) {
        const bug = new Bug(gen.rarity, name, x, y, assets.defaultCreatureImage_svg, scale, gameSettings, masterCollection, assets, gen);
        console.log("Made bug", bug);
        return bug;
    }
    if(rarity >= 10) {
        const bug = new Bug(gen.rarity, name, x, y, assets.defaultEnergyImage_svg, scale, gameSettings, masterCollection, assets, gen);
        console.log("Made bug", bug);
        return bug;
    }
}

function newGenetic(mother, father) {
    const gen = new Genetics(mother, father);
    console.log("Made genetics", gen);
    return gen;
}

function newEgg(father, mother, gameSettings, masterCollection, assets, scale){
    const egg = new Egg(father, mother, assets.defaultEggImage, gameSettings, masterCollection, assets, scale);
    console.log("Made egg", egg);
    return egg;
}

function newDefaultFood(gameSettings, masterCollection, assets, scale) {
    const food = new Food(gameSettings, masterCollection, assets.defaultFoodImage_svg, scale, assets);
    console.log("spawned food", food);
    return newDefaultFood;
}

function Paused(gameSettings, assets, masterCollection) {
    masterCollection.foodCollection.forEach((food) => {
        food.paused = true;
    });
    masterCollection.eggCollection.forEach((egg) => {
        egg.paused = true;
    });
    masterCollection.critterCollection.forEach((critter) => {
        critter.paused = true;
    });   
}

function isNotPaused(gameSettings, assets, masterCollection) {
    masterCollection.foodCollection.forEach((food) => {
        food.paused = false;
        food.update();
    });
    masterCollection.critterCollection.forEach((critter) => {
        critter.paused = false;
        critter.update();
    });
    masterCollection.eggCollection.forEach((egg) => {
        egg.paused = false;
        egg.update();
    });
    masterCollection.critterCollection.forEach((critter) => {
        critter.paused = false;
        critter.update();
    });
}

