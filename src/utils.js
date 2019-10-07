export function boundingBox(vectors) {
	let minX = 0.0;
	let maxX = 0.0;
	let minY = 0.0;
	let maxY = 0.0;

	vectors.forEach((vector) => {
		if (vector.x < minX) minX = vector.x;
		if (vector.x > maxX) maxX = vector.x;
		if (vector.y < minY) minY = vector.y;
		if (vector.y > maxY) maxY = vector.y;
	});

	return [minX, maxX, minY, maxY];
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
	var ah = parseInt(a.replace(/#/g, ''), 16),
			ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
			bh = parseInt(b.replace(/#/g, ''), 16),
			br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
			rr = ar + amount * (br - ar),
			rg = ag + amount * (bg - ag),
			rb = ab + amount * (bb - ab);

	return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}