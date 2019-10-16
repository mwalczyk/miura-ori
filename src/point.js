import { Vector } from './vector';

export class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	copy() {
		return new Point(this.x, this.y, this.z);
	}

	subtract(other) {
		// Note that `other` should be a `Point`
		return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	add(other) {
		// Note that `other` should be a `Point`
		console.error("Two points cannot be added together");
	}

	distance(other) {
		// Note that `other` should be a `Point`
		const direct = this.subtract(other);
		return direct.length();
	}

	addDisplacement(vec) {
		if(!(vec instanceof Vector)) {
			throw new Error("Attempting to add non-`Vector` to `Point` object");
		}
		// Note that `vec` should be a `Vector`
		return new Point(this.x + vec.x, this.y + vec.y, this.z + vec.z);
	}

	subtractDisplacement(vec) {
		if(!(vec instanceof Vector)) {
			throw new Error("Attempting to add non-`Vector` to `Point` object");
		}
		// Note that `vec` should be a `Vector`
		return new Point(this.x - vec.x, this.y - vec.y, this.z - vec.z);
	}
}