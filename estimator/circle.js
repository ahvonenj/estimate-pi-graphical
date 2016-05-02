function Circle(estimator)
{
	var self = this;

	this.estimator = estimator;

	this.g = new PIXI.Graphics();
	this.g.clear();
	this.g.lineStyle(1, 0xFF0000, 1);
	this.g.drawCircle(150, 150, Global.circlerad);
	this.g.endFill();

	this.estimator.stage.addChild(this.g);
}

Circle.prototype.update = function(dt)
{

}