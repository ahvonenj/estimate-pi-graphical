function Rectangle(estimator)
{
	var self = this;

	this.estimator = estimator;

	this.g = new PIXI.Graphics();
	this.g.clear();
    this.g.lineStyle(1, 0x0000FF, 1);
    this.g.drawRect(50, 50, 200, 200);
    this.g.endFill();

    this.estimator.stage.addChild(this.g);
}

Rectangle.prototype.update = function(dt)
{

}