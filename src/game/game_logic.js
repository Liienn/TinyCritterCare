function newDefaultBug(gameSettings, assets, name, scale, critterCollection) {
    rarity = 0;
    const bug = new Bug(rarity, name, 800, 200, assets.defaultBugImage, scale, gameSettings, critterCollection, assets);
    console.log("Made bug", bug);
    return bug;
}

function newStripedBug(gameSettings, assets, name, scale, critterCollection) {
    rarity = 10;
    const bug = new Bug(rarity, name, 100, 200, assets.stripedBugImage, scale, gameSettings, critterCollection, assets);
    console.log("Made bug", bug);
    return bug;
}

function newDefaultFood() {
    const food = new Food();
    console.log("spawned food", food);
    return newDefaultFood;
}

function Paused(gameSettings, assets, critterCollection) {
    critterCollection.forEach((critter) => {
        critter.paused = true;
    });
}

function isNotPaused(gameSettings, assets, critterCollection) {
    critterCollection.forEach((critter) => {
        critter.paused = false;
        critter.update();
        critter.detectBugsInRadius();
    });
}