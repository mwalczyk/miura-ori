import * as PIXI from "pixi.js";

export class Oberserver {
	constructor() {
		this.interactables = [];
	}

	onChange() {

	}
}

export class Interactable {
	/**
	 * A drawable object that the user can interact with.
	 *
	 * Reference: 
	 * https://pixijs.io/examples/#/interaction/dragging.js
	 * https://github.com/kittykatattack/learningPixi
	 *
	 */
	constructor(graphics, owner, moveable = true) {
		this.graphics = graphics;
		this.graphics.interactive = true;
		this.graphics.buttonMode = true;
		this.owner = owner;
		this.moveable = moveable;

		if (this.moveable) {
			this.graphics
				.on("pointerdown", this.onMouseDown.bind(this))
				.on("pointerup", this.onMouseUp.bind(this))
				.on("pointerupoutside", this.onMouseOut.bind(this))
				.on("pointermove", this.onMouseMove.bind(this));
		}
	}

	onMouseDown(event) {
		this.graphics.data = event.data;
		this.graphics.alpha = 0.5;
		this.graphics.dragging = true;
	}

	onMouseUp(event) {
		this.graphics.alpha = 1;
		this.graphics.dragging = false;
		this.graphics.data = null;
	}

	onMouseMove(event) {
		if (this.graphics.dragging) {
			const newPosition = this.graphics.data.getLocalPosition(this.graphics.parent);
			this.graphics.x = newPosition.x;
			this.graphics.y = newPosition.y;
		}
	}

	onMouseOut(event) {
		// Currently unused: left here as a placeholder for child classes
	}

	draw() {
		// The PIXI application needs to be in the global scope
		window.app.stage.addChild(this.graphics);
	}
}

// export class TextOverlay extends Interactable {
// 	constructor(base, text, moveable = true) {
// 		super(base, moveable);
// 		this.text = text;

// 		this.align();
// 	}

// 	onMouseDown(e) {
// 		super.onMouseDown(e);

// 		this.text.show();
// 	}

// 	onMouseUp(e) {
// 		super.onMouseUp(e);

// 		this.text.hide();
// 	}

// 	onMouseMove(e) {
// 		super.onMouseMove(e);

// 		if (this.moveable && this.clicked) {
// 			this.align();
// 		}
// 	}

// 	onMouseOut(e) {
// 		super.onMouseOut(e);

// 		this.text.hide();
// 	}

// 	align() {
// 		// Draw the text above the parent SVG
// 		this.text.center(
// 			this.svg.cx(),
// 			this.svg.cy() - this.svg.height() * 0.5
// 		);
// 	}
// }
