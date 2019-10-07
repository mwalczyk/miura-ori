import Vector from './vector';
import Matrix from './matrix';
import * as utils from './utils';

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
					ctx.font = "normal 10px Arial";
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
		this.generateCreasePattern();
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
		let direct = pointB.subtract(pointA).normalize();

		// A vector orthogonal to `direct`
		let ortho = new Vector(direct.y, -direct.x, 0.0);
		ortho = ortho.normalize(); 

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
		ctx.setLineDash([]);

		for (let i = 1; i < this.generatingLine.length() - 1; i++) {
		  // Grab a point and its immediate neighbor along the path
			const pointA = this.generatingLine.points[i - 1];
			const pointB = this.generatingLine.points[i + 0];
			const pointC = this.generatingLine.points[i + 1];

			const toAfromB = pointA.subtract(pointB).normalize();
			const toCfromB = pointC.subtract(pointB).normalize();

			let startTheta = utils.atan2Wrapped(toAfromB.y, toAfromB.x);
			let endTheta = utils.atan2Wrapped(toCfromB.y, toCfromB.x);

			// The angle between the two vectors
			let between = Math.acos(toAfromB.dot(toCfromB));
			if (toAfromB.cross(toCfromB).z < 0.0) {
				between = 2.0 * Math.PI - between;
			}

			let bisector = toAfromB.bisector(toCfromB).normalize().multiplyScalar(30.0);	

			const lerpedColor = utils.lerpColor('#e3cc39', '#bf3054', between / (2.0 * Math.PI));

			const unicodeDeg = String.fromCharCode(176);
			const spacing = 30;
			ctx.font = "bold 12px Courier New";
			ctx.fillStyle = lerpedColor;
			ctx.fillText(`${Math.trunc(utils.toDegrees(between)).toString()}${unicodeDeg}`, pointB.x + bisector.x, pointB.y + bisector.y);

			ctx.strokeStyle = lerpedColor;
			ctx.beginPath();
			ctx.arc(pointB.x, pointB.y, 18.0, startTheta, endTheta);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(pointB.x, pointB.y, 20.0, startTheta, endTheta);
			ctx.stroke();
		}
	}

	drawCreasePattern(ctx) {
		const offset = this.stripWidth;

		let [minX, maxX, minY, maxY] = utils.boundingBox(this.vertices);
		const currentWidth = maxX - minX;
		const desiredWidth = 600.0 - this.stripWidth * 2.0;

		const scale = desiredWidth / currentWidth;

		for (let [index, face] of this.faces.entries()) {
			let [a, b, c, d] = face;

			ctx.strokeStyle = "#f2f0f0"; // Same as the canvas background color
			ctx.fillStyle = utils.lerpColor('#e3cc39', '#bf3054', index / this.faces.length);

			ctx.beginPath();
			ctx.moveTo(this.vertices[a].x * scale + offset, this.vertices[a].y + offset * 3.0);
			ctx.lineTo(this.vertices[b].x * scale + offset, this.vertices[b].y + offset * 3.0);
			ctx.lineTo(this.vertices[c].x * scale + offset, this.vertices[c].y + offset * 3.0);
			ctx.lineTo(this.vertices[d].x * scale + offset, this.vertices[d].y + offset * 3.0);
			ctx.closePath();
			
			ctx.fill();
			ctx.stroke();
		}
	}

	draw(ctx) {
		this.drawPolygons(ctx);
		this.drawInfiniteLines(ctx);
		this.drawIntersections(ctx);
		this.drawAngles(ctx);

		this.drawCreasePattern(ctx);
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

	rearrangePolygon(a, b, c, d, curr_offset, flip, last) {
			// This function assumes an ordering:
			// 0-----3
			// |     |
			// |     |
			// 1-----2
			
			// Gather points
			const all_pts = [
				this.intersections[a], 
				this.intersections[b], 
				this.intersections[c], 
				this.intersections[d]
			];

			// A direction vector that runs parallel to this polygon's bottom edge
			const bottom_edge = all_pts[2].subtract(all_pts[1]);

			// Rotate the bottom edge to be aligned with the x-axis
			const theta = bottom_edge.signedAngle(Vector.xAxis());
			const rotationMatrix = Matrix.rotationZ(-theta);

			let rotated_pts = [];
			all_pts.forEach((pt) => {
				// Rotate around the top-left corner of the polygon (the first point)
				let rot = pt.subtract(all_pts[0]);
				rot = rotationMatrix.multiply(rot);

				if (flip) {
					// Flip across the x-axis and move down by the strip width
					rot.y = -rot.y;
					rot.y -= this.stripWidth * 2.0;
				}

				rotated_pts.push(rot);
			});

			// Top right corner
			const offset = rotated_pts[2].x; 

			// If this is the last polygon to be added, add all 4 points, otherwise only 
			// add the first two: we do this to avoid adding the same vertices multiple times
			if (last) {
				rotated_pts.forEach((pt) => {
					this.vertices.push(pt.add(new Vector(curr_offset, 0.0, 0.0)));
				});
			}
			else {
				for (let i = 0; i < 2; i++) {
					this.vertices.push(rotated_pts[i].add(new Vector(curr_offset, 0.0, 0.0)));
				}
			}

			return offset;
	}

	generateCreasePattern() {
		this.vertices = [];
		this.edges = [];
		this.faces = [];
		this.assignments = [];

		let cumulativeOffset = 0.0;
		let flip = false;
		let numberOfPolygons = this.intersections.length / 2;

		for (let i = 0; i < numberOfPolygons - 1; i++) {
			// The starting index of this polygon (i.e. 2, 4, 6, 8, etc.)
			const start = i * 2;
			 
			// Whether or not this is the last polygon in the strip
			const last = (i == numberOfPolygons - 2);

			const offset = this.rearrangePolygon(start + 0, start + 1, start + 2, start + 3, cumulativeOffset, flip, last);
			cumulativeOffset += offset;

			// The next polygon will need to be flipped, etc.
			flip = !flip;
		}

		// Construct faces
		for (let i = 0; i < numberOfPolygons - 1; i++) { 
			// The starting index of this polygon (i.e. 2, 4, 6, 8, etc.)
			const start = i * 2;

			// Was this polygon flipped?
			// 
			// Face vertices are assumed to have been added in the following order:
			// 
			// 0--------3    1-----2
			// |       /     |      \ <-- Faces that were flipped are like this, instead
			// |      /      |       \
			// 1-----2       0--------3
			//
			// So, reorient the flipped polygons here, ensuring the same CCW
			// winding order <ul, ll, lr, ur>
			if (i % 2 != 0) {
				const indices = [start + 1, start + 0, start + 3, start + 2];
				this.faces.push(indices);
			}
			else {
				const indices = [start + 0, start + 1, start + 2, start + 3];
				this.faces.push(indices);
			}
		}
	}
}