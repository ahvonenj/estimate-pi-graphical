// Accurate timing
function timestamp()
{
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

// PIE = PIEstimator
function PIE()
{
	var self = this;

	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer(Global.width, Global.height, 
	{ 
		view: document.querySelector('#canvas'),
		backgroundColor: 0xFFFFFF,
		antialias: true 
	});

	this.t = 
	{
		now: null,
		acc: 0,
		dt: 0,
		last: timestamp(),
		step: 1/60,
		time: 0
	};

	// Initialize new sim.js random generator
	this.random = new Random();

	// Save references to output elements
	this.totalpointsoutput = document.querySelector('#totalp');
	this.circlepointsoutput = document.querySelector('#circlep');
	this.estpioutput = document.querySelector('#estpi');
	this.constpioutput = document.querySelector('#constpi');
	this.dpioutput = document.querySelector('#dpi');

	// Point related variables
	this.points = [];
	this.pointsincircle = 0;
	this.totalpoints = 0;

	// Make a new circle and rectangle
	this.rectangle = new Rectangle(this);
	this.circle = new Circle(this);

	this.pointgraphics = new PIXI.Graphics();
	this.pointgraphics.clear();
	this.pointgraphics.lineStyle(1, 0x000000, 1);
	this.pointgraphics.beginFill(0x000000, 1);
	this.pointgraphics.drawCircle(this.x, this.y, 1);
	this.pointgraphics.endFill();
	this.pointtex = this.pointgraphics.generateTexture();

	this.checkpoint = 0;

	// Start update and draw loop
	requestAnimationFrame(function(t) { self.animate(self); });
}

// Update loop
PIE.prototype.animate = function(pie)
{
	pie.t.now = timestamp();
	pie.t.dt = Math.min(1, (pie.t.now - pie.t.last) / 1000);
	pie.t.last = pie.t.now; 

	pie.t.acc += pie.t.dt;

	while(pie.t.acc >= pie.t.step) 
	{
		pie.t.acc -= pie.t.step;

		pie.update(pie.t.dt);
	}

	pie.render();
	requestAnimationFrame(function(t) { pie.animate(pie); });
}

// Update method
PIE.prototype.update = function(dt)
{
	var self = this;
	
	Lerppu.update(this.t.time);

	this.circle.update(dt);
	this.rectangle.update(dt);

	self.generatePoint();

	// Output stuff
	var estimation = ((4 * this.pointsincircle) / this.totalpoints);
	var dpi = Math.abs(Math.PI - estimation);

	this.totalpointsoutput.innerText = this.totalpoints;
	this.circlepointsoutput.innerText = this.pointsincircle;
	this.estpioutput.innerText = estimation;
	this.constpioutput.innerText = Math.PI;
	this.dpioutput.innerText = dpi
}

// Render everything
PIE.prototype.render = function()
{
	// Make circle and rectangle draw on top of everything
	if(this.stage.children.length > 1)
	{
		this.stage.removeChild(this.circle.g);
		this.stage.addChildAt(this.circle.g, this.stage.children.length - 1);

		this.stage.removeChild(this.rectangle.g);
		this.stage.addChildAt(this.rectangle.g, this.stage.children.length - 1);
	}

	this.renderer.render(this.stage);
}

// https://bost.ocks.org/mike/algorithms/
PIE.prototype.generatePoint = function()
{
	var self = this;

	var rx = this.random.uniform(50, 250); // Generate uniform x value for poínt
	var ry = this.random.uniform(50, 250); // Generate uniform y value for poínt

	// Make a new point
	var point = new Point(rx, ry, new PIXI.Sprite(self.pointtex), this);
	this.points.push(point);

	// Increase total points
	this.totalpoints++;

	var v1 = new Victor(rx, ry); 	// Vector representation of the randomly generated point
	var v2 = new Victor(150, 150);	// Vector representation of the middle point of the circle

	// Calculate distance from the middle of the circle to the generated point
	// And see if the point is within the circles radius
	if(v1.distance(v2) <= Global.circlerad)
	{
		this.pointsincircle++;
	}

	// Output stuff
	var estimation = ((4 * this.pointsincircle) / this.totalpoints);
	var dpi = Math.abs(Math.PI - estimation);

	if(this.totalpoints % 200 === 0 && this.totalpoints > 0)
	{
		$('#resulttable').append('<tr><td>Error after ' + this.totalpoints + 
		':</td><td>' + dpi + '</td></tr>');

		var newvisdata = visdata;
		newvisdata.labels.push(this.totalpoints);
		newvisdata.datasets[0].data.push(dpi);
		UpdateVisdata(newvisdata);

		this.checkpoint++;
		this.lastthrow = dpi;
	}

	/*if(this.totalpoints % 1000 === 0 && this.totalpoints > 0)
	{
		for(var i = 0; i < this.points.length; i++)
		{
			this.points[i].sprite.alpha -= 0.2;
		}
	}*/
}

PIE.prototype.poisson = function()
{
	var mean = 5;
	var L = Math.exp(-mean);
	var p = 1.0;
	var k = 0;
	 
	do 
	{
		k++;
		p *= Math.random();
	} 
	while (p > L);
	 
	return k - 1;
}