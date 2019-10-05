export default class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(other) {
		return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	subtract(other) {
		return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	multiplyScalar(sc) {
		return new Vector(this.x * sc, this.y * sc, this.z * sc);
	}

	divideScalar(sc) {
		return new Vector(this.x / sc, this.y / sc, this.z / sc);
	}

	cross(other) {
		let x = this.y * other.z - this.z * other.y;
		let y = this.z * other.x - this.x * other.z;
		let z = this.x * other.y - this.y * other.x;
		return new Vector(x, y, z);
	}

	dot(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	normalize() {
		let l = this.length();
		this.x /= l;
		this.y /= l;
		this.z /= l;
	}

	print() {
		console.log(`x: ${this.x}, y: ${this.y}, z: ${this.z}`);
	}

	draw(ctx) {
		ctx.beginPath();
	    ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
	    ctx.fill();
	}
}