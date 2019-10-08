import Vector from './vector';
import Matrix from './matrix';
import * as utils from './utils';

export class GeneratingLine {
	constructor() {
		this.points = [];
		this.shallowAngle = utils.toRadians(150.0);
	}

	push(point) {
		this.points.push(point);
	}

	pop() {
		this.points.pop();
	}

	length() {
		return this.points.length;
	}

	clear() {
		this.points.length = 0;
	}

	draw(ctx) {
		ctx.save();
		for (let i = 0; i < this.points.length - 1; i++) {
				let pointA = this.points[i + 0];
				let pointB = this.points[i + 1];
				
				ctx.strokeStyle = '#948e8e';
				ctx.beginPath();
				ctx.moveTo(pointA.x, pointA.y); 
				ctx.lineTo(pointB.x, pointB.y);
				ctx.stroke();

				ctx.fillStyle = '#576d94';
				pointA.draw(ctx, 2.0);
				pointB.draw(ctx, 2.0);

				const spacing = 4;
				ctx.font = "normal 10px Arial";
				ctx.fillStyle = '#344054';
				ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y); 
				ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y); 
		}
		ctx.restore();
	}
}

export class GeneratingStrip {
	constructor(generatingLine, stripWidth) {
		this.generatingLine = generatingLine;
		this.stripWidth = stripWidth;
		this.generateStrip();
		this.generateCreasePattern();
	}

	getPointsOrthogonalTo(pointA, pointB) {
		// A vector that points from `pointA` towards `pointB`
		let direct = pointB.subtract(pointA).normalize();

		// A vector orthogonal to `direct`
		let ortho = new Vector(direct.y, -direct.x, 0.0);

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

		ctx.save();
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
		ctx.restore();
	}

	drawIntersections(ctx) {
		ctx.save();
		ctx.fillStyle = '#d96448';
		this.intersections.forEach((intersection) => intersection.draw(ctx, 3.0));
		ctx.restore();
	}

	drawPolygons(ctx) {
		ctx.save();
		ctx.fillStyle = utils.convertHex('#b5a6a5', 50.0);

		this.polygons.forEach(([a, b, c, d]) => {
			ctx.beginPath();
			ctx.moveTo(this.intersections[a].x, this.intersections[a].y);
			ctx.lineTo(this.intersections[b].x, this.intersections[b].y);
			ctx.lineTo(this.intersections[c].x, this.intersections[c].y);
			ctx.lineTo(this.intersections[d].x, this.intersections[d].y);
			ctx.closePath();
			ctx.fill();
		})
		ctx.restore();
	}

	drawAngles(ctx) {
		ctx.save();

		for (let i = 1; i < this.generatingLine.length() - 1; i++) {
		  // Grab a point and its immediate neighbor along the path
			const pointA = this.generatingLine.points[i - 1];
			const pointB = this.generatingLine.points[i + 0];
			const pointC = this.generatingLine.points[i + 1];

			const heading = pointB.subtract(pointA).normalize();
			const next = pointC.subtract(pointB).normalize();

			// The actual *major* fold angle that will need to be made at this point along the strip
			const foldAngle = Math.acos(heading.dot(next));
			const lerpedColor = utils.lerpColor('#bf3054', '#e3cc39', foldAngle / Math.PI);

			let startTheta = utils.atan2Wrapped(heading.y, heading.x);
			let endTheta = utils.atan2Wrapped(next.y, next.x);

			// Keep the same directionality as the path curves throughout space
			if (heading.cross(next).z < 0.0) {
				[startTheta, endTheta] = [endTheta, startTheta];
			}
			let bisector = heading.bisector(next).normalize().multiplyScalar(25.0);	

			// Display the angle (in degrees) as text
			if (bisector.x < 0.0) {
				ctx.textAlign = 'right';
			} else {
				ctx.textAlign = 'left';
			}
			const unicodeDegrees = String.fromCharCode(176);
			const unicodeBlock = String.fromCharCode(9608);
			ctx.font = "bold 12px Courier New";

			const textDegrees = Math.trunc(utils.toDegrees(foldAngle)).toString().concat(unicodeDegrees);
			const textBackground = unicodeBlock.repeat(textDegrees.length);

			ctx.fillStyle = '#fcfafa';
			ctx.fillText(textBackground, pointB.x + bisector.x, pointB.y + bisector.y);

			ctx.fillStyle = lerpedColor;
			ctx.fillText(`${textDegrees}`, pointB.x + bisector.x, pointB.y + bisector.y);

			// Draw outer / inner arcs with different radii
			ctx.strokeStyle = lerpedColor;
			ctx.beginPath();
			ctx.arc(pointB.x, pointB.y, 16.0, startTheta, endTheta);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(pointB.x, pointB.y, 20.0, 0.0, 2.0 * Math.PI);
			ctx.stroke();
		}
		ctx.restore();
	}

	drawCreasePattern(ctx) {
		const offset = this.stripWidth;

		// Shrink the CP down horizontally so that it fits on the canvas
		let [minX, maxX, minY, maxY] = utils.boundingBox(this.vertices);
		const currentW = maxX - minX;
		const currentH = maxY - minY;
		const desiredW = document.getElementById('canvas-crease-pattern').width - 2.0 * offset;
		const desiredH = document.getElementById('canvas-crease-pattern').height - 2.0 * offset;

		const scaleX = desiredW / currentW;
		const scaleY = desiredH / currentH;
		console.log(minY)
		ctx.save();
		for (let [index, face] of this.faces.entries()) {
			let [a, b, c, d] = face;
			let percent = index / this.faces.length;

			ctx.strokeStyle = "#f2f0f0"; // Same as the canvas background color
			ctx.fillStyle = utils.lerpColor('#e3cc39', '#bf3054', percent);

			ctx.beginPath();
			ctx.moveTo((this.vertices[a].x - minX) * scaleX + offset, (this.vertices[a].y - minY) * scaleY + offset);
			ctx.lineTo((this.vertices[b].x - minX) * scaleX + offset, (this.vertices[b].y - minY) * scaleY + offset);
			ctx.lineTo((this.vertices[c].x - minX) * scaleX + offset, (this.vertices[c].y - minY) * scaleY + offset);
			ctx.lineTo((this.vertices[d].x - minX) * scaleX + offset, (this.vertices[d].y - minY) * scaleY + offset);
			ctx.closePath();

			// Draw both filled and stroked versions of the face
			ctx.fill();
			ctx.stroke();
		}
		ctx.restore();
	}

	draw(ctxDrawing, ctxCreasePattern) {
		this.drawPolygons(ctxDrawing);
		this.drawInfiniteLines(ctxDrawing);
		this.drawIntersections(ctxDrawing);
		this.drawAngles(ctxDrawing);

		// Drawn to a different canvas element
		this.drawCreasePattern(ctxCreasePattern);
	}

	generateStrip() {
		// From a generating line (polyline), construct the "silhouette" of the
		// folded form
		//
		// Procedure:
		//
		// 1. Iterate over the polyline's points in pairs
		// 2. For each pair, calculate the slope of the connecting line segment
		// 3. From this, calculate the slopes and y-intercepts of a pair of parallel
		//    lines that run alongside the original line calculated in step (2)
		// 4. Finally, calculate the points of intersection between the set of lines
		//    calculated in step (3) for each pair of adjacent points
		// 5. All of the points calculated in step (4) form the silhouette of the 
		//    folded form, as long as we connect them as quads in CCW winding order
		this.lineEquations = [];
		this.intersections = [];
		this.polygons = [];
		
		for (let i = 0; i < this.generatingLine.length() - 1; i++) {
		  // Grab a point and its immediate neighbor along the path
			const pointA = this.generatingLine.points[i + 0];
			const pointB = this.generatingLine.points[i + 1];
			const m = utils.slope(pointA, pointB);
			
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
			const intersectionA = utils.intersect(m0, b0, m3, b3);

			// Calculate the intersection between l1 and l2
			const intersectionB = utils.intersect(m1, b1, m2, b2);

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

	rearrangePolygon(a, b, c, d, currentOffset, flip, last) {
			// This function assumes the following vertex order per face:
			//
			// 0-----3
			// |     |
			// |     |
			// 1-----2
			//
			// First, gather the points that form this particular polygon
			let polygonPoints = [
				this.intersections[a], 
				this.intersections[b], 
				this.intersections[c], 
				this.intersections[d]
			];

			// A direction vector that runs parallel to this polygon's bottom edge
			const bottomEdge = polygonPoints[2].subtract(polygonPoints[1]);
			const topLeftCorner = polygonPoints[0];

			// Rotate the bottom edge to be aligned with the x-axis
			const theta = bottomEdge.signedAngle(Vector.xAxis());
			const rotationMatrix = Matrix.rotationZ(-theta);

			for (let i = 0; i < polygonPoints.length; i++) {
				// Rotate around the top-left corner of the polygon (the first point)
				polygonPoints[i] = rotationMatrix.multiply(polygonPoints[i].subtract(topLeftCorner));

				// Flip across the x-axis and move down by the strip width
				if (flip) {
					polygonPoints[i].y = -polygonPoints[i].y;
					polygonPoints[i].y -= this.stripWidth * 2.0;
				}
			}

			// Top right corner, after rotation
			const offset = polygonPoints[2].x; 

			// If this is the last polygon to be added, add all 4 points, otherwise only 
			// add the first two: we do this to avoid adding the same vertices multiple times
			const iterations = last ? 4 : 2;
			for (let i = 0; i < iterations; i++) {
				this.vertices.push(polygonPoints[i].add(new Vector(currentOffset, 0.0, 0.0)));
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

		// The total number of closed polygons that form the silhouette of this strip
		let numberOfPolygons = this.intersections.length / 2;

		for (let i = 0; i < numberOfPolygons - 1; i++) {
			// 2, 4, 6, 8, etc.
			const startIndex = i * 2;
			 
			// Whether or not this is the last polygon in the strip
			const last = (i == numberOfPolygons - 2);	

			let [a, b, c, d] = [startIndex + 0, startIndex + 1, startIndex + 2, startIndex + 3];
			const offset = this.rearrangePolygon(a, b, c, d, cumulativeOffset, flip, last);
			cumulativeOffset += offset;

			// Add this face, taking care to note whether the polygon was flipped
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
			const indices = flip ? [b, a, d, c] : [a, b, c, d];
			this.faces.push(indices);

			// The next polygon will need to be flipped, etc.
			flip = !flip;
		}

		// Reflect the entire pattern across the x-axis
		// 
		// Procedure:
		//
		// 1. Begin iterating over each of the pre-existing (quad) faces
		// 2. For each face, grab the lower two vertices (lower left / lower right)
		// 3. Reflect each of these vertices across the positive x-axis and add
		//    them to the pre-existing list of vertices
		// 4. Calculate a new set of face indices (in CCW winding order) that
		//    corresponds to the new, reflected face
		// 5. Concatenate the newly generated list of faces with the pre-existing
		//    list of faces
		const numberOfRows = 12;
		const numberOfReflections = numberOfRows - 1;

		let facesCurrent = [...this.faces];

		for (let row = 0; row < numberOfReflections; row++) {
			//console.log('Row:', row)
			let facesNext = []

			for (let [i, f] of facesCurrent.entries()) {
				const ul = f[0]; // Upper left
				const ll = f[1]; // Lower left 
				const lr = f[2]; // Lower right
				const ur = f[3]; // Upper right

				// First, duplicate the two lower vertices across the positive x-axis
				let vertexA = this.vertices[ll].copy();
				let vertexB = this.vertices[lr].copy();

				const r = 4.0 * this.stripWidth;	
				vertexA.y += r; 
				vertexB.y += r;

				// Create the new set of face indices
				const reflectedFace = [
					this.vertices.length + 0,
					ul,
					ur, 
					this.vertices.length + 1
				];

				// Push back the new pair of vertices: we only want to add the 
				// left vertex to avoid duplicates - except for the last face
				this.vertices.push(vertexA);

				if (i == facesCurrent.length - 1) {
					this.vertices.push(vertexB);
				}

				// Push back the new face
				facesNext.push(reflectedFace);
			}

			// Add new faces to global array
			this.faces.push(...facesNext);

			// Reset array of faces to be processed
			facesCurrent = [...facesNext];
		}		
	}
}