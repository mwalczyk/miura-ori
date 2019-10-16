class Interactable {
	/**
	 * An SVG element that can be clicked (and moved if `moveable` is `true`).
	 *
	 * Example:
	 * 
	 * const base = window.draw.circle(10);
	 * const interactable = new Interactable(base);
	 * 
	 */
	constructor(svg, moveable = true) {
		this.svg = svg; 
		this.moveable = moveable;
		this.clicked = false;

		// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
		this.svg.mousedown(this.onMouseDown.bind(this));
		this.svg.mouseup(this.onMouseUp.bind(this));
		this.svg.mousemove(this.onMouseMove.bind(this));
		this.svg.mouseout(this.onMouseOut.bind(this));
	}

	onMouseDown(e) {
		this.clicked = true;

		// Always move this element to the front of the canvas (to avoid 
		// weird overlap conditions)
		this.svg.front(); 
	}

	onMouseUp(e) {
		this.clicked = false;
	}

	onMouseMove(e) {
		if (this.moveable && this.clicked) {
			this.svg.center(e.clientX, e.clientY);
		}
	}

	onMouseOut(e) {
		// Currently unused: left here as a placeholder for child classes
	}
}

class TextOverlay extends Interactable {
	/**
	 * An SVG element that displays some text when it is clicked.
	 * 
	 * Example:
	 * 
	 * const base = window.draw.circle(10);
	 * const text = window.draw.text("My Circle");
	 * const overlay = new TextOverlay(base, text);
	 * 
	 */  
	constructor(base, text, moveable = true) {
		super(base, moveable);
		this.text = text;
		this.text.before(this.svg);
		this.text.hide();

		this.align();
	}

	onMouseDown(e) {
		super.onMouseDown(e);

		this.text.show();
		this.text.front();
	}

	onMouseUp(e) {
		super.onMouseUp(e);

		this.text.hide();
	}

	onMouseMove(e) {
		super.onMouseMove(e);

		if (this.moveable && this.clicked) {
			this.align();
		}
	}

	onMouseOut(e) {
		super.onMouseOut(e);

		this.text.hide();
	}

	align() {
		// Draw the text above the parent SVG
		this.text.center(this.svg.cx(), this.svg.cy() - this.svg.height() * 0.5);
	}
}
