import * as utils from "./utils";

const colors = {
	fold: {
		mountain: "#d96448",
		valley: "#768d87",
		facet: "#c9ad47",
		border: "#bab5b5"
	},
	text: "#344054"
};

/* A wrapper around the .FOLD file format */
export class CreasePattern {
	constructor() {
		this.vertices = [];
		this.faces = [];
		this.edges = [];
		this.assignments = [];
		this.angles = [];
	}

	exportFoldData(scale = 1.0) {
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
			edges_vertices: this.edges,
			faces_vertices: this.faces,
			edges_assignment: this.assignments,
			edges_foldAngles: this.angles
		};

		// Vertices need to be reformatted
		this.vertices.forEach(v =>
			fold["vertices_coords"].push([
				v.x * scale,
				v.y * scale * 1.0, // TODO: multiplying this by some constant factor (say, 4) seems to improve stability in the simulator
				v.z * scale
			])
		);

		return fold;
	}

	draw(ctx) {
		const offset = 10.0;

		// Shrink the crease pattern so that it fits on the canvas
		let [minX, maxX, minY, maxY] = utils.boundingBox(this.vertices);
		const [currentW, currentH] = [maxX - minX, maxY - minY];
		const desiredW =
			document.getElementById("canvas_crease_pattern").width - 2.0 * offset;
		const desiredH =
			document.getElementById("canvas_crease_pattern").height - 2.0 * offset;
		const [scaleX, scaleY] = [desiredW / currentW, desiredH / currentH];

		ctx.save();
		this.edges.forEach((edge, edgeIndex) => {
			const [edgeIndices, assignment, angle] = [edge, this.assignments[edgeIndex], this.angles[edgeIndex]];
			const [a, b] = edgeIndices;

			// Color (and stipple) the line based on this edge's assignment
			if (assignment === "M") {
				ctx.strokeStyle = colors["fold"]["mountain"];
				ctx.setLineDash([]);
			} else if (assignment === "V") {
				ctx.strokeStyle = colors["fold"]["valley"];
				ctx.setLineDash([1, 2]);
			} else if (assignment === "F") {
				ctx.strokeStyle = colors["fold"]["facet"];
				ctx.setLineDash([]);
			} else if (assignment === "B") {
				ctx.strokeStyle = colors["fold"]["border"];
				ctx.setLineDash([]);
			}

			ctx.beginPath();
			ctx.moveTo(
				(this.vertices[a].x - minX) * scaleX + offset,
				(this.vertices[a].y - minY) * scaleY + offset
			);
			ctx.lineTo(
				(this.vertices[b].x - minX) * scaleX + offset,
				(this.vertices[b].y - minY) * scaleY + offset
			);
			ctx.closePath();
			ctx.stroke();

			// Display fold angles as text
			if (false) {
				const spacing = 0;
				ctx.font = "bold 10px Courier New";
				ctx.fillStyle = colors["text"];
				const avgX = (((this.vertices[a].x - minX) * scaleX + offset) + ((this.vertices[b].x - minX) * scaleX + offset)) * 0.5;
				const avgY = (((this.vertices[a].y - minY) * scaleY + offset) + ((this.vertices[b].y - minY) * scaleY + offset)) * 0.5;
				ctx.fillText(Math.trunc(utils.toDegrees(angle)).toString(), avgX, avgY);
			}
		});
		ctx.restore();
	}
}