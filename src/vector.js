export default class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}	

	copy() {
		return new Vector(this.x, this.y, this.z);
	}

	static xAxis() {
		return new Vector(1.0, 0.0, 0.0);
	}

	static yAxis() {
		return new Vector(0.0, 1.0, 0.0);
	}

	static zAxis() {
		return new Vector(0.0, 0.0, 1.0);
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
		return this.divideScalar(l);
	}

	signedAngle(other) {
		// Make sure the vector is normalized
		const normalized = this.normalize();

		// Find the angle between `this` and `other`
		let angle = Math.acos(normalized.dot(other));
		const cross = normalized.cross(other)

		// Potentially reverse the angle
		if (Vector.zAxis().dot(cross) > 0.0) {
			angle = -angle;
		}

		return angle;
	}

	bisector(other) {
		return this.multiplyScalar(other.length()).add(other.multiplyScalar(this.length()))
	}

	print() {
		console.log(`x: ${this.x}, y: ${this.y}, z: ${this.z}`);
	}

	draw(ctx, radius) {
		ctx.beginPath();
	  ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
	  ctx.fill();
	}
}