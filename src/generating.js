import Vector from './vector'

export class GeneratingLine {
	constructor() {
		this.points = [];
	}

	push(point) {
		this.points.push(point);
	}

	length() {
		return this.points.length;
	}

	clear() {
		this.points.length = 0;
	}

	draw(ctx) {
		if (this.points.length > 1) {

			ctx.setLineDash([]);

			for (let i = 0; i < this.points.length - 1; i++) {
					let pointA = this.points[i + 0];
					let pointB = this.points[i + 1];
					
					ctx.strokeStyle = '#948e8e';
					ctx.beginPath();
					ctx.moveTo(pointA.x, pointA.y); 
					ctx.lineTo(pointB.x, pointB.y);
					ctx.stroke();

					ctx.fillStyle = '#576d94';
					pointA.draw(ctx);
					pointB.draw(ctx);

					const spacing = 4;
					ctx.font = "10px Arial";
					ctx.fillStyle = '#344054';
					ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y); 
					ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y); 
			}
		}	
	}
}

export class GeneratingStrip {
	constructor(generatingLine, stripWidth) {
		this.generatingLine = generatingLine;
		this.stripWidth = stripWidth;
		this.build();
	}

	/** 
	 * Calculates the slope of the line between two points.
   * @param {Point} pointA - the first point
   * @param {Point} pointB - the second point
   * @returns {number} the slope
   */
	slope(pointA, pointB) {
		let num = pointB.y - pointA.y;
		let den = pointB.x - pointA.x;

		if (den === 0.0) {
			console.error('Denominator is zero!');
		}

		return num / den;
	}

	intersect(m0, b0, m1, b1) {
		let xInter = (b0 - b1) / (m1 - m0);

		// Plug into the first equation (arbitrary) to find the y-intercept
		let yInter = m0 * xInter + b0; 

		return new Vector(xInter, yInter, 0.0);
	}

	getPointsOrthogonalTo(pointA, pointB) {
		// A vector that points from `pointA` towards `pointB`
		let direct = pointB.subtract(pointA);
		direct.normalize();

		// A vector orthogonal to `direct`
		let ortho = new Vector(direct.y, -direct.x, 0.0);
		ortho.normalize(); 

		// Keep the "handedness" of the line: `ortho` will always
		// be pointing "left" from `direct`
		if (direct.cross(ortho).z < 0.0) {
			ortho = ortho.multiplyScalar(-1.0);
		}
		ortho = ortho.multiplyScalar(this.stripWidth);

		// The two points "up" and "down"
		let pointU = pointA.add(ortho);
		let pointD = pointA.subtract(ortho);
		
		return [pointU, pointD];
	}

	drawInfiniteLines(ctx) {
		// The length of the "infinite" line segment: this is kind of silly, but it works for now
		const drawLength = 2000.0;

		ctx.strokeStyle = '#bab5b5';
		ctx.setLineDash([2, 2]);

		for (let i = 0; i < this.lineEquations.length; i++) {
			let [mU, bU] = this.lineEquations[i][0];
			let [mD, bD] = this.lineEquations[i][1];

			const lineUStart = new Vector(-drawLength, mU * -drawLength + bU, 0.0);
			const lineUEnd = new Vector(drawLength, mU * drawLength + bU, 0.0);

			ctx.beginPath();
			ctx.moveTo(lineUStart.x, lineUStart.y); 
			ctx.lineTo(lineUEnd.x, lineUEnd.y);
			ctx.stroke();
		
			const lineDStart = new Vector(-drawLength, mD * -drawLength + bD, 0.0);
			const lineDEnd = new Vector(drawLength, mD * drawLength + bD, 0.0);

			ctx.beginPath();
			ctx.moveTo(lineDStart.x, lineDStart.y); 
			ctx.lineTo(lineDEnd.x, lineDEnd.y);
			ctx.stroke();
		}
	}

	drawIntersections(ctx) {
		ctx.fillStyle = '#d96448';
		this.intersections.forEach((intersection) => intersection.draw(ctx));
	}

	drawPolygons(ctx) {
		ctx.fillStyle = "rgba(154, 227, 226, 0.5)";

		this.polygons.forEach(([a, b, c, d]) => {
			ctx.beginPath();
			ctx.moveTo(this.intersections[a].x, this.intersections[a].y);
			ctx.lineTo(this.intersections[b].x, this.intersections[b].y);
			ctx.lineTo(this.intersections[c].x, this.intersections[c].y);
			ctx.lineTo(this.intersections[d].x, this.intersections[d].y);
			ctx.closePath();
			ctx.fill();
		})
	}

	drawAngles(ctx) {

		ctx.strokeStyle = '#c9a234';
		ctx.setLineDash([]);

		const xAxis = new Vector(1.0, 0.0, 0.0);

		for (let i = 1; i < this.generatingLine.length() - 1; i++) {
		  // Grab a point and its immediate neighbor along the path
			const pointA = this.generatingLine.points[i - 1];
			const pointB = this.generatingLine.points[i + 0];
			const pointC = this.generatingLine.points[i + 1];

			const toAfromB = pointA.subtract(pointB);
			const toCfromB = pointC.subtract(pointB);

			toAfromB.normalize();
			toCfromB.normalize();

			let startAngle = Math.atan2(toCfromB.y, toCfromB.x);
			let endAngle = Math.atan2(toAfromB.y, toAfromB.x);

			ctx.beginPath();
			ctx.arc(pointB.x, pointB.y, 30.0, endAngle, startAngle);
			ctx.stroke();
		}
	}

	draw(ctx) {
		if (this.generatingLine.length() > 1) {
			this.drawPolygons(ctx);
			this.drawInfiniteLines(ctx);
			this.drawIntersections(ctx);
			this.drawAngles(ctx);
		}
	}

	build() {
		this.lineEquations = [];
		this.intersections = [];
		this.polygons = [];
		
		for (let i = 0; i < this.generatingLine.length() - 1; i++) {
		  // Grab a point and its immediate neighbor along the path
			const pointA = this.generatingLine.points[i + 0];
			const pointB = this.generatingLine.points[i + 1];
			const m = this.slope(pointA, pointB);
			
			// Remember: `y = mx + b`
			// Plug in one point and find the y-intercept
			const b = pointA.y - m * pointA.x;

			const [pointU, pointD] = this.getPointsOrthogonalTo(pointA, pointB);

			// Add the first pair of points: subsequent points will be 
			// added later during the line-line intersection routine
			if (i === 0) {
				this.intersections.push(pointU);
				this.intersections.push(pointD);
			}

			// Find the y-intercepts of each of the two parallel lines:
			// note that both lines have the same slope `m`
			let bU = pointU.y - m * pointU.x;
			let bD = pointD.y - m * pointD.x;
			this.lineEquations.push([[m, bU], [m, bD]]);
		}

		for (let i = 0; i < this.lineEquations.length- 1; i++) {
			// The first pair of lines
			const [m0, b0] = this.lineEquations[i + 0][0];
			const [m1, b1] = this.lineEquations[i + 0][1];

			// The next pair of lines
			const [m2, b2] = this.lineEquations[i + 1][0];
			const [m3, b3] = this.lineEquations[i + 1][1];

			// Calculate the intersection between l0 and l3
			const intersectionA = this.intersect(m0, b0, m3, b3);

			// Calculate the intersection between l1 and l2
			const intersectionB = this.intersect(m1, b1, m2, b2);

			// Push back points of intersection: note the order of insertion matters here
			// for proper CCW winding order
			this.intersections.push(intersectionB);
			this.intersections.push(intersectionA);
		}

		// Finally, add the last two points
		const l = this.generatingLine.length();
		const [pointU, pointD] = this.getPointsOrthogonalTo(this.generatingLine.points[l - 1], this.generatingLine.points[l - 2]);
		this.intersections.push(pointU);
		this.intersections.push(pointD);

		for (let i = 0; i < this.intersections.length - 2; i += 2) {
		  // a-----d
			// |     |
		  // |     |
			// b-----c
			const a = i + 0 
			const b = i + 1
			const c = i + 2
			const d = i + 3
			this.polygons.push([a, b, c, d]);
		}
	}
}