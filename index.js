import { GeneratingLine, GeneratingStrip } from './src/generating';
import Vector from './src/vector';

// Running:
// 1. Install prerequisites:
// 		a. `npm install -g browserify` <-- used to package node modules
//		b. `npm install -g watchify` <-- used to "watch" index.js for changes and auto re-compile
//    c. `npm install -g babelify` <-- used to transpile ES6 to ES5 (like for imports/exports)
// 2. Install required node modules locally: `npm install`
// 3. Run: `watchify index.js -t [ babelify --presets [ @babel/preset-env ] ] -o bundle.js`
//
// References:
// 1. https://medium.com/jeremy-keeshin/hello-world-for-javascript-with-npm-modules-in-the-browser-6020f82d1072
// 2. https://javascript.info/
// 3. https://medium.com/@hey.aaron/getting-import-export-working-es6-style-using-browserify-babelify-gulp-5hrs-of-life-eca7786e44cc
// 4. https://dev.to/washingtonsteven/playing-with-canvas-and-es6-classes
// 5. http://egorsmirnov.me/2015/05/25/browserify-babelify-and-es6.html
// 6. https://jsdoc.app/

// Create canvas element and append it to document body
const divCanvas = document.getElementById('div-canvas');
const canvasDrawing = document.createElement('canvas');
canvasDrawing.setAttribute('id', 'canvas-drawing');
canvasDrawing.setAttribute('class', 'canvas-upper');
canvasDrawing.width = 600;
canvasDrawing.height = 600;

const canvasCreasePattern = document.createElement('canvas');
canvasCreasePattern.setAttribute('id', 'canvas-crease-pattern');
canvasCreasePattern.setAttribute('class', 'canvas-lower');
canvasCreasePattern.width = 600;
canvasCreasePattern.height = 180;

divCanvas.appendChild(canvasDrawing);
divCanvas.appendChild(canvasCreasePattern);

// Grab the 2D rendering context
const ctxDrawing = canvasDrawing.getContext('2d');
const ctxCreasePattern = canvasCreasePattern.getContext('2d');

// Grab references to DOM elements
const buttonClear = document.getElementById('button-clear');
const pNumberOfPoints = document.getElementById("p-number-of-points");

// Add event listeners
canvasDrawing.addEventListener('mousedown', addPoint);
buttonClear.addEventListener('click', clearCanvas);

function resize() {
	// Make the canvas full-screen
  canvasDrawing.width = window.innerWidth;
  canvasDrawing.height = window.innerHeight;
}

let generatingLine = new GeneratingLine();

function clearCanvas(e) {
	ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
	ctxCreasePattern.clearRect(0, 0, canvasCreasePattern.width, canvasCreasePattern.height);

	generatingLine.clear();
}

function addPoint(e) {
  generatingLine.push(new Vector(e.offsetX, e.offsetY, 0.0));

  pNumberOfPoints.innerHTML = `Number of Points: ${generatingLine.length().toString()}`;

  drawCanvas();
}

function drawCanvas() {
	ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
	ctxCreasePattern.clearRect(0, 0, canvasCreasePattern.width, canvasCreasePattern.height);
	
	if (generatingLine.length() > 1) {
		let generatingStrip = new GeneratingStrip(generatingLine, 10.0);
		generatingStrip.draw(ctxDrawing, ctxCreasePattern);
	}

	generatingLine.draw(ctxDrawing);
}



