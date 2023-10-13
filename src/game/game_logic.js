function newBug(x, y, gameSettings, assets, name, scale, masterCollection, gen) {
    const rarity = gen.rarity !== undefined ? gen.rarity : Math.random()*20;
    if(rarity < 10) {
        const bug = new Bug(gen.rarity, name, x, y, assets.defaultBugImage, scale, gameSettings, masterCollection, assets, gen);
        console.log("Made bug", bug);
        return bug;
    }
    if(rarity >= 10) {
        const bug = new Bug(gen.rarity, name, x, y, assets.stripedBugImage, scale, gameSettings, masterCollection, assets, gen);
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

function newDefaultFood() {
    const food = new Food();
    console.log("spawned food", food);
    return newDefaultFood;
}

function Paused(gameSettings, assets, masterCollection) {
    masterCollection.eggCollection.forEach((egg) => {
        egg.paused = true;
    });
    masterCollection.critterCollection.forEach((critter) => {
        critter.paused = true;
    });   

    //console.log(masterCollection);
}

function isNotPaused(gameSettings, assets, masterCollection) {
    masterCollection.eggCollection.forEach((egg) => {
        egg.paused = false;
        egg.update();
    });
    masterCollection.critterCollection.forEach((critter) => {
        critter.paused = false;
        critter.update();
    });
}