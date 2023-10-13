class Food {
    constructor() {

    }
    draw() {
        this.gameSettings.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.gameSettings.ctx.font = "15px Arial";
        this.gameSettings.ctx.fillStyle = "white";
        this.gameSettings.ctx.textAlign = "center";
        this.gameSettings.ctx.fillText(this.name, this.x + this.width/1.8, this.y+7);
    }

}