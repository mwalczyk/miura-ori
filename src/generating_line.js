import * as PIXI from 'pixi.js'

import { Interactable } from "./interactable";
import { Vector } from "./vector";
import * as utils from "./utils";

const colors = {
	line: "#948e8e",
	point: "#576d94",
	text: "#344054"
};

export class GeneratingLine {
	constructor() {
		this._points = [];
		this._shallowAngle = utils.toRadians(150.0);
		this._checkShallowAngle = true;

		this._interactables = [];
	}

	get points() {
		return this._points;
	}

	get shallowAngle() {
		return this._shallowAngle;
	}

	push(point) {
		if (this._checkShallowAngle && this._points.length > 1) {
			// The three points that will be used to construct a shallow angle divot
			const [pointA, pointB, pointC] = [
				this._points[this._points.length - 2],
				this._points[this._points.length - 1],
				point.copy()
			];

			// Points `a`, `b`, and `c` for a 3-point polyline segment:
			//
			//              c
			//				 		 /
			//			    	/
			// 		a ---- b
			//
			const [toAFromB, toCFromB] = [
				pointA.subtract(pointB).normalize(),
				pointC.subtract(pointB).normalize()
			];
			const theta = toAFromB.angle(toCFromB);

			// The "height" + "width" of each shallow-angle divot: really, the divot should have
			// a width of 0, but this causes issues
			//
			// If the width is 0, then there will be a pair of line segments that run parallel to
			// one another in the generating line
			// 
			// The generating strip will try to find the intersection(s) between these parallel lines
			// (there are none)
			const [divotW, divotH] = [4.0, 40.0]; // The height should probably be a function of the strip width

			if (theta > this._shallowAngle) {
				// Add 3 points around `b` (the middle point): first, delete `b`
				this.pop();
				const bisector = toAFromB.bisector(toCFromB).normalize();

				// Add point on line `b` -> `a`, close to `b`
				const divotPointA = pointB.add(toAFromB.multiplyScalar(divotW));

				// Add point along bisector
				const divotPointB = pointB.add(bisector.multiplyScalar(divotH));

				// Add point on line `c` -> `b`, close to `b`
				const divotPointC = pointB.add(toCFromB.multiplyScalar(divotW));

				this._points.push(divotPointA, divotPointB, divotPointC);
			}
		}

		this._points.push(point);
		
		//this.update();
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

	majorFoldAngle(index) {
		const [pointA, pointB, pointC] = [
			this._points[index - 1],
			this._points[index + 0],
			this._points[index + 1]
		];

		const [toBfromA, toCFromB] = [
			pointB.subtract(pointA).normalize(),
			pointC.subtract(pointB).normalize()
		];
		const theta = toBfromA.angle(toCFromB);

		return theta;
	}

	update() {
		
		console.log(this.interactables);

		this._points.forEach(point => {
			let g = new PIXI.Graphics();
			g.beginFill(0xFF0000);
			g.drawCircle(0.0, 0.0, 15.0);
			g.endFill();
			g.x = point.x;
			g.y = point.y;
			let i = new Interactable(g);
			this.interactables.push(i);
		});

		// if (this._points.length > 1) {

		// 	for (let i = 0; i < this._points.length - 1; i++) {
		// 		const [pointA, pointB] = this._points.slice(i, i + 2);
		// 		console.log(pointA);

		// 		let g = new PIXI.Graphics();
		// 		g.lineStyle(4, 0xFFFFFF, 1);	
		// 		g.moveTo(pointA.x, pointA.y);
		// 		g.lineTo(pointB.x, pointB.y);
		// 		let i = new Interactable(g);
		// 		this.interactables.push(i);
		// 	}

		// }
	}

	draw(ctx) {
		ctx.save();
		for (let i = 0; i < this._points.length - 1; i++) {
			const [pointA, pointB] = this._points.slice(i, i + 2);

			ctx.strokeStyle = colors["line"];
			ctx.beginPath();
			ctx.moveTo(pointA.x, pointA.y);
			ctx.lineTo(pointB.x, pointB.y);
			ctx.stroke();

			const pointRadius = 2.0;
			ctx.fillStyle = colors["point"];
			pointA.draw(ctx, pointRadius);
			pointB.draw(ctx, pointRadius);

			const spacing = 4;
			ctx.font = "normal 10px Arial";
			ctx.fillStyle = colors["text"];
			ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y);
			ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y);
		}
		ctx.restore();
	}

	// draw() {
		
	// 	this.interactables.forEach(item => item.draw());

	// }
}
