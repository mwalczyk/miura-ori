import { Vector } from "./vector";

export class Matrix {
	constructor(columnA, columnB, columnC) {
		this.columnA = columnA;
		this.columnB = columnB;
		this.columnC = columnC;
	}

	static identity() {
		return new Matrix(Vector.xAxis(), Vector.yAxis(), Vector.zAxis());
	}

	static rotationX(theta) {
		const c = Math.cos(theta);
		const s = Math.sin(theta);

		return new Matrix(
			new Vector(1.0, 0.0, 0.0),
			new Vector(0.0, c, s),
			new Vector(0.0, -s, c)
		);
	}

	static rotationY(theta) {
		const c = Math.cos(theta);
		const s = Math.sin(theta);

		return new Matrix(
			new Vector(c, 0.0, -s),
			new Vector(0.0, 1.0, 0.0),
			new Vector(s, 0.0, c)
		);
	}

	static rotationZ(theta) {
		const c = Math.cos(theta);
		const s = Math.sin(theta);

		return new Matrix(
			new Vector(c, s, 0.0),
			new Vector(-s, c, 0.0),
			new Vector(0.0, 0.0, 1.0)
		);
	}

	multiply(vec) {
		const x =
			this.columnA.x * vec.x + this.columnB.x * vec.y + this.columnC.x * vec.z;
		const y =
			this.columnA.y * vec.x + this.columnB.y * vec.y + this.columnC.y * vec.z;
		const z =
			this.columnA.z * vec.x + this.columnB.z * vec.y + this.columnC.z * vec.z;

		return new Vector(x, y, z);
	}

	print() {
		console.log(`[${this.columnA.x} ${this.columnB.x} ${this.columnC.x}]`);
		console.log(`[${this.columnA.y} ${this.columnB.y} ${this.columnC.y}]`);
		console.log(`[${this.columnA.z} ${this.columnB.z} ${this.columnC.z}]`);
	}
}