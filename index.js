import { GeneratingLine, Strip } from './src/generating_line';
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
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
divCanvas.appendChild(canvas);

// Grab the 2D rendering context
const ctx = canvas.getContext('2d');

// Grab references to DOM elements
const buttonClear = document.getElementById('button-clear');
const pNumberOfPoints = document.getElementById("p-number-of-points");

// Add event listeners
canvas.addEventListener('mousedown', addPoint);
buttonClear.addEventListener('click', clearCanvas);

function resize() {
	// Make the canvas full-screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let generatingLine = new GeneratingLine();

function clearCanvas(e) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	generatingLine.clear();
}

function addPoint(e) {
  generatingLine.push(new Vector(e.offsetX, e.offsetY, 0.0));

  pNumberOfPoints.innerHTML = `Number of Points: ${generatingLine.length().toString()}`;

  drawCanvas();
}

function drawCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	let strip = new Strip(generatingLine, 10.0);
	strip.draw(ctx);

	generatingLine.draw(ctx);
}



