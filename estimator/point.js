function Point(x, y, sprite, estimator)
{
	var self = this;

	this.estimator = estimator;

	this.x = x;
	this.y = y;

	this.sprite = sprite;

	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;

	this.sprite.anchor = new PIXI.Point(0.5, 0.5);

	this.estimator.stage.addChild(this.sprite);
}

Point.prototype.update = function(dt)
{

}