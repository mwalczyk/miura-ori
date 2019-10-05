import Vector from './vector'

export default class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.label = 'point';
	}

	subtract(other) {
		// The vector that points from `other` towards `this`
		return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	distance(other) {
	  const [dx, dy] = [other.x - this.x, other.y - this.y, other.z - this.z];
	  return Math.sqrt(dx * dx + dy * dy + dz * dz)
	}

	draw(ctx) {
		ctx.beginPath();
	  ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
	  ctx.fill();
	}

	print() {
		console.log(`x: ${this.x}, y: ${this.y}`);
	}
}