import Vector from "./vector";
import Matrix from "./matrix";
import * as utils from "./utils";

const uiColors = {
	generatingLine: {
		line: "#948e8e",
		point: "#576d94",
		text: "#344054"
	},
	generatingStrip: {
		line: "#bab5b5",
		point: "#d96448",
		polygon: utils.convertHex("#b5a6a5", 50.0),
		textBackground: "#fcfafa",
		angle: {
			acute: "#bf3054",
			obtuse: "#e3cc39"
		}
	},
	creasePattern: {
		fold: {
			mountain: "#d96448",
			valley: "#768d87",
			facet: "#c9ad47",
			border: "#bab5b5"
		}
	}
};

export class GeneratingLine {
	constructor() {
		this._points = [];
		this._shallowAngle = utils.toRadians(30.0);
	}

	get points() {
		return this._points;
	}

	get shallowAngle() {
		return this._shallowAngle;
	}

	push(point) {
		this._points.push(point);
	}

	pop() {
		this._points.pop();
	}

	length() {
		return this._points.length;
	}

	clear() {
		this._points.length = 0;
	}

	draw(ctx) {
		ctx.save();
		for (let i = 0; i < this._points.length - 1; i++) {
			let pointA = this._points[i + 0];
			let pointB = this._points[i + 1];

			ctx.strokeStyle = uiColors["generatingLine"]["line"];
			ctx.beginPath();
			ctx.moveTo(pointA.x, pointA.y);
			ctx.lineTo(pointB.x, pointB.y);
			ctx.stroke();

			ctx.fillStyle = uiColors["generatingLine"]["point"];
			pointA.draw(ctx, 2.0);
			pointB.draw(ctx, 2.0);

			const spacing = 4;
			ctx.font = "normal 10px Arial";
			ctx.fillStyle = uiColors["generatingLine"]["text"];
			ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y);
			ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y);
		}
		ctx.restore();
	}
}

export class GeneratingStrip {
	constructor(generatingLine, stripWidth, repeat) {
		this._generatingLine = generatingLine;
		this._stripWidth = stripWidth;
		this._repeat = repeat;
		this.generateStrip();
		this.generateCreasePattern();
	}

	get generatingLine() {
		return this._generatingLine;
	}

	get stripWidth() {
		return this._stripWidth;
	}

	get repeat() {
		return this._repeat;
	}

	get lineEquations() {
		return this._lineEquations;
	}

	get intersections() {
		return this._intersections;
	}

	get stripPolygons() {
		return this._stripPolygons;
	}

	get vertices() {
		return this._vertices;
	}

	get edges() {
		return this._edges;
	}

	get faces() {
		return this._faces;
	}

	get assignments() {
		return this._assignments;
	}

	getPointsOrthogonalTo(pointA, pointB) {
		const heading = pointB.subtract(pointA).normalize();
		let orthogonal = new Vector(heading.y, -heading.x, 0.0);

		// Keep the "handedness" of the line: `orthogonal` will always
		// be pointing "left" from `heading`
		if (heading.cross(orthogonal).z < 0.0) {
			orthogonal = orthogonal.multiplyScalar(-1.0);
		}
		orthogonal = orthogonal.multiplyScalar(this._stripWidth);

		// Add the two points "up" and "down"
		return [pointA.add(orthogonal), pointA.subtract(orthogonal)];
	}

	drawInfiniteLines(ctx) {
		// The length of the "infinite" line segment: this is kind of silly, but it works for now
		const drawLength = 2000.0;

		ctx.save();

		ctx.strokeStyle = uiColors["generatingStrip"]["line"];
		ctx.setLineDash([2, 2]);

		for (let i = 0; i < this._lineEquations.length; i++) {
			let [mLeft, bLeft] = this._lineEquations[i][0];
			let [mRight, bRight] = this._lineEquations[i][1];

			const lineLeftStart = new Vector(
				-drawLength,
				mLeft * -drawLength + bLeft,
				0.0
			);
			const lineLeftEnd = new Vector(
				drawLength,
				mLeft * drawLength + bLeft,
				0.0
			);

			ctx.beginPath();
			ctx.moveTo(lineLeftStart.x, lineLeftStart.y);
			ctx.lineTo(lineLeftEnd.x, lineLeftEnd.y);
			ctx.stroke();

			const lineRightStart = new Vector(
				-drawLength,
				mRight * -drawLength + bRight,
				0.0
			);
			const lineRightEnd = new Vector(
				drawLength,
				mRight * drawLength + bRight,
				0.0
			);

			ctx.beginPath();
			ctx.moveTo(lineRightStart.x, lineRightStart.y);
			ctx.lineTo(lineRightEnd.x, lineRightEnd.y);
			ctx.stroke();
		}
		ctx.restore();
	}

	drawIntersections(ctx) {
		ctx.save();
		ctx.fillStyle = uiColors["generatingStrip"]["point"];
		this._intersections.forEach(intersection => intersection.draw(ctx, 3.0));
		ctx.restore();
	}

	drawStripPolygons(ctx) {
		ctx.save();
		ctx.fillStyle = uiColors["generatingStrip"]["polygon"];
		this._stripPolygons.forEach(([a, b, c, d]) => {
			ctx.beginPath();
			ctx.moveTo(this._intersections[a].x, this._intersections[a].y);
			ctx.lineTo(this._intersections[b].x, this._intersections[b].y);
			ctx.lineTo(this._intersections[c].x, this._intersections[c].y);
			ctx.lineTo(this._intersections[d].x, this._intersections[d].y);
			ctx.closePath();

			ctx.fill();
		});
		ctx.restore();
	}

	drawAngles(ctx) {
		ctx.save();

		for (let i = 1; i < this._generatingLine.length() - 1; i++) {
			// Grab a point and its immediate neighbors (previous and next) along the path
			const [pointA, pointB, pointC] = this._generatingLine.points.slice(
				i - 1,
				i + 2
			);
			const [heading, next] = [
				pointB.subtract(pointA).normalize(),
				pointC.subtract(pointB).normalize()
			];

			// The actual *major* fold angle that will need to be made at this point along the strip
			const foldAngle = Math.acos(heading.dot(next));
			const lerpedColor = utils.lerpColor(
				uiColors["generatingStrip"]["angle"]["acute"],
				uiColors["generatingStrip"]["angle"]["obtuse"],
				foldAngle / Math.PI
			);

			let [startTheta, endTheta] = [
				utils.atan2Wrapped(heading.y, heading.x),
				utils.atan2Wrapped(next.y, next.x)
			];

			// Keep the same directionality as the path curves throughout space
			if (heading.cross(next).z < 0.0) {
				[startTheta, endTheta] = [endTheta, startTheta];
			}
			let bisector = heading
				.bisector(next)
				.normalize()
				.multiplyScalar(25.0);

			// Display the angle (in degrees) as text
			ctx.textAlign = bisector.x < 0.0 ? "right" : "left";
			ctx.font = "bold 12px Courier New";

			// Some unicode symbols
			const [unicodeDegrees, unicodeBlock] = [
				String.fromCharCode(176),
				String.fromCharCode(9608)
			];

			const textDegrees = Math.trunc(utils.toDegrees(foldAngle))
				.toString()
				.concat(unicodeDegrees);
			const textBackground = unicodeBlock.repeat(textDegrees.length);

			// Draw a small text box to display the angles (in degrees)
			ctx.fillStyle = uiColors["generatingStrip"]["textBackground"];
			ctx.fillText(
				textBackground,
				pointB.x + bisector.x,
				pointB.y + bisector.y
			);

			ctx.fillStyle = lerpedColor;
			ctx.fillText(textDegrees, pointB.x + bisector.x, pointB.y + bisector.y);

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
		const offset = this._stripWidth;

		// Shrink the crease pattern so that it fits on the canvas
		let [minX, maxX, minY, maxY] = utils.boundingBox(this._vertices);
		const [currentW, currentH] = [maxX - minX, maxY - minY];
		const desiredW =
			document.getElementById("canvas-crease-pattern").width - 2.0 * offset;
		const desiredH =
			document.getElementById("canvas-crease-pattern").height - 2.0 * offset;
		const [scaleX, scaleY] = [desiredW / currentW, desiredH / currentH];

		ctx.save();
		for (let [index, edge] of this._edges.entries()) {
			let [a, b] = edge;
			//console.log(`i: ${index}, edge: ${edge} -> ${this._assignments[index]}`);

			// Color (and stipple) the line based on this edge's assignment
			const assignment = this._assignments[index];

			if (assignment === "M") {
				ctx.strokeStyle = uiColors["creasePattern"]["fold"]["mountain"];
				ctx.setLineDash([]);
			} else if (assignment === "V") {
				ctx.strokeStyle = uiColors["creasePattern"]["fold"]["valley"];
				ctx.setLineDash([1, 2]);
			} else if (assignment === "F") {
				ctx.strokeStyle = uiColors["creasePattern"]["fold"]["facet"];
				ctx.setLineDash([]);
			} else if (assignment === "B") {
				ctx.strokeStyle = uiColors["creasePattern"]["fold"]["border"];
				ctx.setLineDash([]);
			}

			ctx.beginPath();
			ctx.moveTo(
				(this._vertices[a].x - minX) * scaleX + offset,
				(this._vertices[a].y - minY) * scaleY + offset
			);
			ctx.lineTo(
				(this._vertices[b].x - minX) * scaleX + offset,
				(this._vertices[b].y - minY) * scaleY + offset
			);
			ctx.closePath();
			ctx.stroke();
		}
		ctx.restore();
	}

	draw(ctxDrawing, ctxCreasePattern) {
		this.drawStripPolygons(ctxDrawing);
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
		this._lineEquations = [];
		this._intersections = [];
		this._stripPolygons = [];

		for (let i = 0; i < this._generatingLine.length() - 1; i++) {
			// Grab a point and its immediate neighbor along the path
			const [pointA, pointB] = this._generatingLine.points.slice(i, i + 2);

			// Remember: `y = mx + b` - plug in one point and find the y-intercept
			const m = utils.slope(pointA, pointB);
			const b = pointA.y - m * pointA.x;

			const [pointLeft, pointRight] = this.getPointsOrthogonalTo(
				pointA,
				pointB
			);

			// Add the first pair of points: subsequent points will be
			// added later during the line-line intersection routine
			if (i === 0) {
				this._intersections.push(pointLeft, pointRight);
			}

			// Find the y-intercepts of each of the two parallel lines:
			// note that both lines have the same slope
			const [bU, bD] = [
				pointLeft.y - m * pointLeft.x,
				pointRight.y - m * pointRight.x
			];
			this._lineEquations.push([[m, bU], [m, bD]]);
		}

		for (let i = 0; i < this._lineEquations.length - 1; i++) {
			// The first pair of lines
			const [m0, b0] = this._lineEquations[i + 0][0];
			const [m1, b1] = this._lineEquations[i + 0][1];

			// The next pair of lines
			const [m2, b2] = this._lineEquations[i + 1][0];
			const [m3, b3] = this._lineEquations[i + 1][1];

			// Calculate the intersection between l0 and l3 and the intersection between l1 and l2
			const [intersectionA, intersectionB] = [
				utils.intersect(m0, b0, m3, b3),
				utils.intersect(m1, b1, m2, b2)
			];

			// Push back points of intersection: note the order of insertion matters here
			// for proper CCW winding order
			this._intersections.push(intersectionB, intersectionA);
		}

		// Finally, add the last two points
		const l = this._generatingLine.length();
		const [pointLeft, pointRight] = this.getPointsOrthogonalTo(
			this._generatingLine.points[l - 1],
			this._generatingLine.points[l - 2]
		);
		this._intersections.push(pointLeft, pointRight);

		for (let i = 0; i < this._intersections.length - 2; i += 2) {
			// 0-----3
			// |     |
			// |     |
			// 1-----2
			const upperLeft = i + 0;
			const lowerLeft = i + 1;
			const lowerRight = i + 2;
			const upperRight = i + 3;
			this._stripPolygons.push([upperLeft, lowerLeft, lowerRight, upperRight]);
		}
	}

	rearrangePolygon(a, b, c, d, currentOffset, flip, last) {
		// First, gather the points that form this particular polygon
		let polygonPoints = [
			this._intersections[a],
			this._intersections[b],
			this._intersections[c],
			this._intersections[d]
		];

		// A direction vector that runs parallel to this polygon's bottom edge
		const bottomEdge = polygonPoints[2].subtract(polygonPoints[1]);
		const topLeftCorner = polygonPoints[0].copy();

		// Rotate the bottom edge to be aligned with the x-axis
		const theta = bottomEdge.signedAngle(Vector.xAxis());
		const rotationMatrix = Matrix.rotationZ(-theta);

		for (let i = 0; i < polygonPoints.length; i++) {
			// Rotate around the top-left corner of the polygon (the first point)
			polygonPoints[i] = rotationMatrix.multiply(
				polygonPoints[i].subtract(topLeftCorner)
			);

			// Flip across the x-axis and move down by the strip width
			if (flip) {
				polygonPoints[i].y = -polygonPoints[i].y;
				polygonPoints[i].y -= this._stripWidth * 2.0;
			}
		}

		// Top right corner, after rotation
		const offset = polygonPoints[2].x;

		// If this is the last polygon to be added, add all 4 points, othe;rwise only
		// add the first two: we do this to avoid adding the same vertices multiple times
		const numberOfVerticesToAdd = last ? 4 : 2;
		for (let i = 0; i < numberOfVerticesToAdd; i++) {
			this._vertices.push(
				polygonPoints[i].add(new Vector(currentOffset, 0.0, 0.0))
			);
		}

		return offset;
	}

	generateCreasePattern() {
		this._vertices = [];
		this._edges = [];
		this._faces = [];
		this._assignments = [];

		let cumulativeOffset = 0.0;
		let flip = true;

		// The total number of closed polygons that form the silhouette of this strip
		const numberOfPolygons = this._intersections.length / 2;

		for (let i = 0; i < numberOfPolygons - 1; i++) {
			// 2, 4, 6, 8, etc.
			const startIndex = i * 2;

			// Whether or not this is the last polygon in the strip
			const last = i === numberOfPolygons - 2;

			const [a, b, c, d] = [
				startIndex + 0,
				startIndex + 1,
				startIndex + 2,
				startIndex + 3
			];
			const offset = this.rearrangePolygon(
				a,
				b,
				c,
				d,
				cumulativeOffset,
				flip,
				last
			);
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
			this._faces.push(indices);

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
		const numberOfReflections = this._repeat - 1;

		let facesCurrent = [...this._faces];

		for (let row = 0; row < numberOfReflections; row++) {
			//console.log('Row:', row)
			let facesNext = [];

			for (let [faceIndex, face] of facesCurrent.entries()) {
				// Unpack face indices
				const [upperLeft, lowerLeft, lowerRight, upperRight] = face;

				// First, duplicate the two lower vertices across the positive x-axis
				let [vertexA, vertexB] = [
					this._vertices[lowerLeft].copy(),
					this._vertices[lowerRight].copy()
				];

				const translateY = 4.0 * this._stripWidth;
				vertexA.y += translateY;
				vertexB.y += translateY;

				// Create the new set of face indices
				const reflectedFace = [
					this._vertices.length + 0,
					upperLeft,
					upperRight,
					this._vertices.length + 1
				];

				// Push back the new pair of vertices: we only want to add the
				// left vertex to avoid duplicates - except for the last face
				this._vertices.push(vertexA);
				if (faceIndex == facesCurrent.length - 1) {
					this._vertices.push(vertexB);
				}

				facesNext.push(reflectedFace);
			}

			// Add the newly generated faces to the global crease pattern
			this._faces.push(...facesNext);

			// Set the "next" array of faces to be processed
			facesCurrent = [...facesNext];
		}

		// Construct edges and assignments
		const facesPerRow = this._faces.length / this._repeat;

		for (let [faceIndex, face] of this._faces.entries()) {
			// Unpack face indices
			let [a, b, c, d] = face;

			// Now, circle around the face and add its edges, in order
			for (let edgeIndex = 0; edgeIndex < face.length; edgeIndex++) {
				const xAxis = Vector.xAxis();

				// Calculate two of the interior angles of this face
				let rightEdgeDirection = this._vertices[d]
					.subtract(this._vertices[c])
					.normalize();
				let thetaInteriorRight = Math.abs(xAxis.angle(rightEdgeDirection));
				let leftEdgeDirection = this._vertices[a]
					.subtract(this._vertices[b])
					.normalize();
				let thetaInteriorLeft = Math.abs(xAxis.angle(leftEdgeDirection));

				// Calculate the "row" and "column" indices of this face within the "grid" of faces
				// that form the crease pattern
				const row = Math.floor(faceIndex / facesPerRow);
				const col = faceIndex % facesPerRow;

				const isEvenRow = row % 2 === 0;

				// Calculate complementary angles
				if (isEvenRow) {
					[thetaInteriorLeft, thetaInteriorRight] = [
						Math.PI - thetaInteriorLeft,
						Math.PI - thetaInteriorRight
					];
				}

				// Is this face even or odd, along the horizontal axis?
				const parity = col % 2 === 0;

				// Have we reached a face that contains a border edge?
				const isLeftEnd = faceIndex % facesPerRow === 0;
				const isRightEnd = faceIndex % facesPerRow === facesPerRow - 1;
				const isTopEnd = row === numberOfReflections;
				const isBottomEnd = row === 0;

				// This variable will not be changed for border edges
				let assignment = "B";

				if (edgeIndex === 3 && !isTopEnd) {
					// Minor folds (horizontal) should alternate between M and V
					// across the strip
					if (isEvenRow) {
						// This is an odd row
						assignment = parity ? "M" : "V";
					} else {
						assignment = parity ? "V" : "M";
					}
				} else if (edgeIndex === 1 && !isBottomEnd) {
					// Minor folds (horizontal) should alternate between M and V
					// across the strip
					if (!isEvenRow) {
						// This is an odd row
						assignment = parity ? "M" : "V";
					} else {
						assignment = parity ? "V" : "M";
					}
				} else if (edgeIndex === 0 && !isLeftEnd) {
					// Left edges that are not at the very start of the strip
					if (thetaInteriorLeft < Math.PI * 0.5) {
						// This is the side of the "bird's foot"
						assignment = parity ? "V" : "M";
					} else {
						assignment = parity ? "M" : "V";
					}
				} else if (edgeIndex === 2 && !isRightEnd) {
					// Right edges that are not at the very end of the strip
					if (thetaInteriorRight < Math.PI * 0.5) {
						// This is the side of the "bird's foot"
						assignment = parity ? "M" : "V";
					} else {
						assignment = parity ? "V" : "M";
					}
				}

				// Add edge indices, modulo the number of indices in this face (4):
				//
				// (0, 1)
				// (1, 2)
				// (2, 3)
				// (3, 0) <-- This is where the modulo operator matters
				//
				let edgeIndices = [
					face[(edgeIndex + 0) % 4],
					face[(edgeIndex + 1) % 4]
				];

				// We are going to keep the edges sorted so that we can remove
				// duplicates later
				edgeIndices.sort((a, b) => a - b);

				this._edges.push(edgeIndices);
				this._assignments.push(assignment);
			}
		}
	}

	exportFoldData() {
		// See: `https://github.com/edemaine/fold`
		let fold = {
			file_spec: 1,
			file_creator: "SGMO Generator",
			file_author: "SGMO",
			file_classes: ["singleModel"],
			frame_title: "A Procedurally Generated Semi-Generalized Miura-Ori",
			frame_classes: ["foldedForm"],
			frame_attributes: ["3D"],
			vertices_coords: [],
			edges_vertices: this._edges,
			faces_vertices: this._faces,
			edges_assignment: this._assignments
		};

		// Vertices need to be reformatted
		this._vertices.forEach(v => fold["vertices_coords"].push([v.x, v.y, v.z]));

		return fold;
	}
}
