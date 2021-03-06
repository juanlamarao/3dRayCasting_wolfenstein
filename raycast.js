const TILE_SIZE = 64;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 17;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;


const FOV_ANGLE = 60 * (Math.PI / 180);

const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH / WALL_STRIP_WIDTH;

const MINIMAP_SCALE_FACTOR = 0.25;

class Map
{
	constructor()
	{
		this.grid = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		];
	}
	hasWallAt(x, y)
	{
		if (x < 0 || y < 0 || x > WINDOW_WIDTH || y > WINDOW_HEIGHT)
			return 1;
		var mapGridIndexX = Math.floor(x / TILE_SIZE);
		var mapGridIndexY = Math.floor(y / TILE_SIZE);
		return (this.grid[mapGridIndexY][mapGridIndexX] == 1);
	}
	render()
	{
		for (var i = 0; i < MAP_NUM_ROWS; i++)
		{
			for (var j = 0; j < MAP_NUM_COLS; j++)
			{
				var tileX = j * TILE_SIZE;
				var tileY = i * TILE_SIZE;
				var tileColor = this.grid[i][j] == 1 ? "#222": "#fff";
				stroke("#222");
				fill(tileColor);
				rect(
					MINIMAP_SCALE_FACTOR * tileX,
					MINIMAP_SCALE_FACTOR * tileY,
					MINIMAP_SCALE_FACTOR * TILE_SIZE,
					MINIMAP_SCALE_FACTOR * TILE_SIZE
				);
			}
		}
	}
}

class Player
{
	constructor()
	{
		this.x = WINDOW_WIDTH / 2;
		this.y = WINDOW_HEIGHT / 2;
		this.radius = 10;
		this.turnDirection = 0; // -1 if left, 1 if right
		this.walkDirection = 0; // -1 if back, 1 if front
		this.rotationAngle = Math.PI / 2;
		this.moveSpeed = 2.0;
		this.rotationSpeed = 3 * (Math.PI / 180);
	}
	update()
	{
		// TODO:
		// atualizar posição do player baseada no turnDirection e walkDirection
		this.rotationAngle += this.turnDirection * this.rotationSpeed;

		var moveStep = this.walkDirection * this.moveSpeed;

		var newPlayerX = this.x + (Math.cos(this.rotationAngle) * moveStep);
		var newPlayerY = this.y + (Math.sin(this.rotationAngle) * moveStep);

		if (!grid.hasWallAt(newPlayerX, newPlayerY))
		{
			this.x = newPlayerX;
			this.y = newPlayerY;
		}
	}
	render()
	{
		noStroke();
		fill("blue");
		circle(
			MINIMAP_SCALE_FACTOR * this.x,
			MINIMAP_SCALE_FACTOR * this.y,
			MINIMAP_SCALE_FACTOR * this.radius
		);
		/*stroke("red");
		line(
			this.x,
			this.y,
			this.x + (Math.cos(this.rotationAngle) * 30),
			this.y + (Math.sin(this.rotationAngle) * 30)
		);*/
	}
}

class Ray
{
	constructor(rayAngle)
	{
		this.rayAngle = normalizeAngle(rayAngle);
		this.wallHitX = 0;
		this.WallHitY = 0;
		this.distance = 0;
		this.wasHitVert = false;

		this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
		this.isRayFacingUp = !this.isRayFacingDown;
		this.isRayFacingRight = this.rayAngle < (0.5 * Math.PI) || this.rayAngle > (1.5 * Math.PI);
		this.isRayFacingLeft = !this.isRayFacingRight;
	}
	cast()
	{
		var xintercept, yintercept;
		var xstep, ystep;

		// hit horizontal

		var foundHorzWallHit = false;
        var horzWallHitX = 0;
        var horzWallHitY = 0;

        yintercept = Math.floor(player.y / TILE_SIZE) * TILE_SIZE;
        yintercept += this.isRayFacingDown ? TILE_SIZE : 0;

        xintercept = player.x + (yintercept - player.y) / Math.tan(this.rayAngle);

        ystep = TILE_SIZE;
        ystep *= this.isRayFacingUp ? -1 : 1;

        xstep = TILE_SIZE / Math.tan(this.rayAngle);
        xstep *= (this.isRayFacingLeft && xstep > 0) ? -1 : 1;
        xstep *= (this.isRayFacingRight && xstep < 0) ? -1 : 1;

        var nextHorzTouchX = xintercept;
        var nextHorzTouchY = yintercept;

        //if (this.isRayFacingUp)
        //    nextHorzTouchY--;

        while (nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextHorzTouchX, nextHorzTouchY - this.isRayFacingUp)) {
                foundHorzWallHit = true;
                horzWallHitX = nextHorzTouchX;
                horzWallHitY = nextHorzTouchY;
                break;
            } else {
                nextHorzTouchX += xstep;
                nextHorzTouchY += ystep;
            }
        }
		
		// hit vertical
		var foundVertWallHit = false;
        var vertWallHitX = 0;
        var vertWallHitY = 0;

        xintercept = Math.floor(player.x / TILE_SIZE) * TILE_SIZE;
        xintercept += this.isRayFacingRight ? TILE_SIZE : 0;

        yintercept = player.y + (xintercept - player.x) * Math.tan(this.rayAngle);

        xstep = TILE_SIZE;
        xstep *= this.isRayFacingLeft ? -1 : 1;

        ystep = TILE_SIZE * Math.tan(this.rayAngle);
        ystep *= (this.isRayFacingUp && ystep > 0) ? -1 : 1;
        ystep *= (this.isRayFacingDown && ystep < 0) ? -1 : 1;

        var nextVertTouchX = xintercept;
        var nextVertTouchY = yintercept;

        //if (this.isRayFacingLeft)
        //    nextVertTouchX--;

        while (nextVertTouchX >= 0 && nextVertTouchX <= WINDOW_WIDTH && nextVertTouchY >= 0 && nextVertTouchY <= WINDOW_HEIGHT) {
            if (grid.hasWallAt(nextVertTouchX - this.isRayFacingLeft, nextVertTouchY)) {
                foundVertWallHit = true;
                vertWallHitX = nextVertTouchX;
                vertWallHitY = nextVertTouchY;
                break;
            } else {
                nextVertTouchX += xstep;
                nextVertTouchY += ystep;
            }
        }

		//Calcular e retornar a menor distancia
		var horzHitDist = (foundHorzWallHit) ? distBetweenPoints(player.x, player.y, horzWallHitX, horzWallHitY) : Number.MAX_VALUE;
		var vertHitDist = (foundVertWallHit) ? distBetweenPoints(player.x, player.y, vertWallHitX, vertWallHitY) : Number.MAX_VALUE;

		this.wallHitX = (horzHitDist < vertHitDist) ? horzWallHitX : vertWallHitX;
		this.wallHitY = (horzHitDist < vertHitDist) ? horzWallHitY : vertWallHitY;
		this.distance = (horzHitDist < vertHitDist) ? horzHitDist : vertHitDist;
		this.wasHitVert = (horzHitDist > vertHitDist);
	}
	render()
	{
		stroke("rgba(255, 0, 0, 0.3)");
		line(
			MINIMAP_SCALE_FACTOR * player.x,
			MINIMAP_SCALE_FACTOR * player.y,
			MINIMAP_SCALE_FACTOR * this.wallHitX,
			MINIMAP_SCALE_FACTOR * this.wallHitY
		);
	}
}

var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed()
{
	if (keyCode == UP_ARROW)
	{
		player.walkDirection = 1;
	}
	else if (keyCode == DOWN_ARROW)
	{
		player.walkDirection = -1;
	}
	else if (keyCode == RIGHT_ARROW)
	{
		player.turnDirection = 1;
	}
	else if (keyCode == LEFT_ARROW)
	{
		player.turnDirection = -1;
	}
}

function keyReleased()
{
	if (keyCode == UP_ARROW)
	{
		player.walkDirection = 0;
	}
	else if (keyCode == DOWN_ARROW)
	{
		player.walkDirection = 0;
	}
	else if (keyCode == RIGHT_ARROW)
	{
		player.turnDirection = 0;
	}
	else if (keyCode == LEFT_ARROW)
	{
		player.turnDirection = 0;
	}
}

function castAllRays()
{
	var rayAngle = player.rotationAngle - (FOV_ANGLE / 2);

	rays = [];

	for (var col = 0; col < NUM_RAYS; col++)
	{
		var ray = new Ray(rayAngle);
		ray.cast();
		rays.push(ray);

		rayAngle += FOV_ANGLE / NUM_RAYS;
	}
}

function normalizeAngle(angle)
{
	angle = angle % (2 * Math.PI);
	if (angle < 0)
	{
		angle = (2 * Math.PI) + angle;
	}
	return (angle);
}

function distBetweenPoints(x1, y1, x2, y2)
{
	    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function render3DProjectedWalls()
{
	for (var i = 0; i < NUM_RAYS; i++)
	{
		var ray = rays[i];
		
		var correctWallDist = ray.distance * Math.cos(player.rotationAngle - ray.rayAngle);
		var alpha = 150 / Math.floor(correctWallDist);
		var color = ray.wasHitVert ? 255: 150;

		var distProjectionPlane = (WINDOW_WIDTH / 2) * Math.tan(FOV_ANGLE / 2);

		var wallStripHeight = (TILE_SIZE / correctWallDist) * distProjectionPlane;

		fill(`rgba(${color}, ${color}, ${color}, ${alpha})`);
		noStroke();
		rect(
			i * WALL_STRIP_WIDTH,
			(WINDOW_HEIGHT / 2) - (wallStripHeight / 2),
			WALL_STRIP_WIDTH,
			wallStripHeight
		);
	}
}

function setup()
{
	// TODO: initializar todos os objetos
	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update()
{
	// TODO: atualizar todos os objetos do jogo antes de renderizar o proximo frame
	player.update();
	castAllRays();
}

function draw()
{
	// TODO: renderizar todos os objetos frame a frame
	clear("#212121");

	update();

	render3DProjectedWalls();

	grid.render();
	for (ray of rays)
	{
		ray.render();
	}
	player.render();
}
