import { Point } from "./point";
import { Vector } from "./vector";

export class LineSegment {
	constructor(pointA, pointB) {
		if (!(pointA instanceof Point) || !(pointB instanceof Point)) {
			throw new Error(
				"Attempting to construct `Line` from object(s) that are not of type `Point`"
			);
		}
		this.pointA = pointA.copy();
		this.pointB = pointB.copy();
	}

	pointAt(percent) {
		// Make sure `percent` is between 0 and 1
		percent = Math.min(Math.max(percent, 0.0), 1.0);

		const direct = pointB.subtract(pointA).normalize();
		return this.pointA + direct.multiplyScalar(percent);
	}

	midpoint() {
		return new Point(
			(this.pointA.x + this.pointB.x) * 0.5,
			(this.pointA.y + this.pointB.y) * 0.5,
			(this.pointA.z + this.pointB.z) * 0.5
		);
	}

	perpendicular() {
		// Note that this only works in 2-dimensional space
		const direct = this.pointB.subtract(pointA).normalize();
		let orthogonal = new Vector(direct.y, -direct.x, 0.0);

		// Keep the "handedness" of the line: `orthogonal` will always
		// be pointing "left" from `direct`
		if (direct.cross(orthogonal).z < 0.0) {
			orthogonal = orthogonal.reverse();
		}
		return orthogonal;
	}
}
