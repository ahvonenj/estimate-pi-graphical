function Point(x, y, estimator)
{
	var self = this;

	this.estimator = estimator;

	this.x = x;
	this.y = y;

	this.g = new PIXI.Graphics();
	this.g.clear();
    this.g.lineStyle(1, 0x000000, 0.7);
    this.g.beginFill(0x000000, 0.7);
    this.g.drawCircle(this.x, this.y, 1);
    this.g.endFill();

    this.estimator.stage.addChild(this.g);
}

Point.prototype.update = function(dt)
{

}