import { Vector } from "./vector";

const espilon = 0.1;

export function boundingBox(vectors) {
	let minX = 0.0;
	let maxX = 0.0;
	let minY = 0.0;
	let maxY = 0.0;

	vectors.forEach(vector => {
		if (vector.x < minX) minX = vector.x;
		if (vector.x > maxX) maxX = vector.x;
		if (vector.y < minY) minY = vector.y;
		if (vector.y > maxY) maxY = vector.y;
	});

	return [minX, maxX, minY, maxY];
}

/**
 * Calculates the slope of the line between two points.
 * @param {Vector} pointA - the first point (technically, vector)
 * @param {Vector} pointB - the second point (technically, vector)
 * @returns {number} the slope
 */
export function slope(pointA, pointB) {
	let num = pointB.y - pointA.y;
	let den = pointB.x - pointA.x;

	if (den === 0.0) {
		console.log("Denominator is zero!");
		den = espilon;
	}

	return num / den;
}

export function intersect(m0, b0, m1, b1) {
	let xInter = (b0 - b1) / (m1 - m0);
	let yInter = m0 * xInter + b0;

	return new Vector(xInter, yInter, 0.0);
}

export function atan2Wrapped(y, x) {
	const intermediate = Math.atan2(y, x);
	return (intermediate + 2.0 * Math.PI) % (2.0 * Math.PI);
}

export function toDegrees(x) {
	return x * (180.0 / Math.PI);
}

export function toRadians(x) {
	return x * (Math.PI / 180.0);
}

export function lerpColor(a, b, amount) {
	const ah = parseInt(a.replace(/#/g, ""), 16);
	const ar = ah >> 16;
	const ag = (ah >> 8) & 0xff;
	const ab = ah & 0xff;
	const bh = parseInt(b.replace(/#/g, ""), 16);
	const br = bh >> 16;
	const bg = (bh >> 8) & 0xff;
	const bb = bh & 0xff;
	const rr = ar + amount * (br - ar);
	const rg = ag + amount * (bg - ag);
	const rb = ab + amount * (bb - ab);

	return (
		"#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
	);
}

export function convertHex(hex, opacity) {
	hex = hex.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	const result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";

	return result;
}

export function uniqueObjects(array, property) {
	let unique = [];

	array.forEach((a, indexA) => {
		let found = array.findIndex((b, indexB) => {
			return (
				JSON.stringify(b[property]) === JSON.stringify(a[property]) &&
				indexA > indexB
			);
		});

		if (found === -1) {
			unique.push(a);
		}
	});

	return unique;
}
