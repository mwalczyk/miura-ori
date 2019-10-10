(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _fileSaver = require("file-saver");

var _generating = require("./src/generating");

var _vector = _interopRequireDefault(require("./src/vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Running:
//
// 1. Install prerequisites:
// 		a. `npm install -g browserify` <-- used to package node modules
//		b. `npm install -g watchify` <-- used to "watch" index.js for changes and auto re-compile
//    c. `npm install -g babelify` <-- used to transpile ES6 to ES5 (for imports/exports, etc.)
//    d. `npm install --save-dev @babel/preset-env` <-- the preset needed for step (c)
// 2. Install any other required node modules locally: `npm install`
// 3. In the root directory run: `watchify index.js -t [ babelify --presets [ @babel/preset-env ] ] -o bundle.js`
//
// To format:
//
// 1. Install JsPrettier: `npm install --global prettier`
// 2. Open the Sublime command palette and install the IDE integration
// Create canvas element and append it to document body
var divCanvas = document.getElementById("div_canvas");
var canvasDrawing = document.createElement("canvas");
canvasDrawing.setAttribute("id", "canvas_drawing");
canvasDrawing.setAttribute("class", "drawing_upper");
canvasDrawing.width = 600;
canvasDrawing.height = 600;
var canvasCreasePattern = document.createElement("canvas");
canvasCreasePattern.setAttribute("id", "canvas_crease_pattern");
canvasCreasePattern.setAttribute("class", "drawing_lower");
canvasCreasePattern.width = 600;
canvasCreasePattern.height = 180;
divCanvas.appendChild(canvasDrawing);
divCanvas.appendChild(canvasCreasePattern); // Grab the 2D rendering contexts

var ctxDrawing = canvasDrawing.getContext("2d");
var ctxCreasePattern = canvasCreasePattern.getContext("2d"); // Grab references to DOM elements

var buttonClear = document.getElementById("button_clear");
var buttonSave = document.getElementById("button_save");
var pNumberOfPoints = document.getElementById("p_number_of_points");
var inputRepeat = document.getElementById("input_repeat"); // Add event listeners

canvasDrawing.addEventListener("mousedown", addPoint);
buttonClear.addEventListener("click", reset);
buttonSave.addEventListener("click", save);
inputRepeat.addEventListener("input", function () {
  return drawCanvas();
});
var generatingLine = new _generating.GeneratingLine();
var generatingStrip;
/**
 * Exports the current crease pattern to a .FOLD file.
 */

function save() {
  var fold = generatingStrip.exportFoldData();
  var file = new File([JSON.stringify(fold, null, 4)], "miura.fold", {
    type: "text/plain;charset=utf-8"
  });
  (0, _fileSaver.saveAs)(file);
}
/**
 * Clears all active canvases.
 */


function clearCanvas() {
  ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
  ctxCreasePattern.clearRect(0, 0, canvasCreasePattern.width, canvasCreasePattern.height);
}
/**
 * Clears all active canvases and resets the generating line.
 */


function reset() {
  clearCanvas();
  generatingLine.clear();
}
/**
 * A callback function that adds a point at the specified cursor position.
 */


function addPoint(e) {
  generatingLine.push(new _vector["default"](e.offsetX, e.offsetY, 0.0)); // Add some text information to the UI

  pNumberOfPoints.innerHTML = "Number of Points: ".concat(generatingLine.length().toString());
  drawCanvas();
}
/**
 * Draws all active canvases.
 */


function drawCanvas() {
  clearCanvas(); // Only do this if there are at least 2 points to draw

  if (generatingLine.length() > 1) {
    generatingStrip = new _generating.GeneratingStrip(generatingLine, 10.0, inputRepeat.value);
    generatingStrip.draw(ctxDrawing, ctxCreasePattern);
  } // Always draw the line on top


  generatingLine.draw(ctxDrawing);
}

},{"./src/generating":3,"./src/vector":6,"file-saver":2}],2:[function(require,module,exports){
(function (global){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeneratingStrip = exports.GeneratingLine = void 0;

var _vector = _interopRequireDefault(require("./vector"));

var _matrix = _interopRequireDefault(require("./matrix"));

var utils = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uiColors = {
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

var GeneratingLine =
/*#__PURE__*/
function () {
  function GeneratingLine() {
    _classCallCheck(this, GeneratingLine);

    this._points = [];
    this._shallowAngle = utils.toRadians(150.0);
    this._checkShallowAngle = true;
  }

  _createClass(GeneratingLine, [{
    key: "push",
    value: function push(point) {
      if (this._checkShallowAngle && this._points.length > 1) {
        // The three points that will be used to construct a shallow angle divot
        var _ref = [this._points[this._points.length - 2], this._points[this._points.length - 1], point.copy()],
            pointA = _ref[0],
            pointB = _ref[1],
            pointC = _ref[2]; // Points `a`, `b`, and `c` for a 3-point polyline segment:
        //
        //              c
        //				 		 /
        //			    	/
        // 		a ---- b
        //

        var _ref2 = [pointA.subtract(pointB).normalize(), pointC.subtract(pointB).normalize()],
            toAFromB = _ref2[0],
            toCFromB = _ref2[1];
        var theta = toAFromB.angle(toCFromB); // The "height" + "width" of each shallow-angle divot

        var divotW = 4.0,
            divotH = 20.0;

        if (theta > this._shallowAngle) {
          // Add 3 points around `b` (the middle point): first, delete `b`
          this.pop();
          var bisector = toAFromB.bisector(toCFromB).normalize(); // Add point on line `b` -> `a`, close to `b`

          var divotPointA = pointB.add(toAFromB.multiplyScalar(divotW)); // Add point along bisector

          var divotPointB = pointB.add(bisector.multiplyScalar(divotH)); // Add point on line `c` -> `b`, close to `b`

          var divotPointC = pointB.add(toCFromB.multiplyScalar(divotW));

          this._points.push(divotPointA, divotPointB, divotPointC);
        }
      }

      this._points.push(point);
    }
  }, {
    key: "pop",
    value: function pop() {
      this._points.pop();
    }
  }, {
    key: "length",
    value: function length() {
      return this._points.length;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._points.length = 0;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.save();

      for (var i = 0; i < this._points.length - 1; i++) {
        var _this$_points$slice = this._points.slice(i, i + 2),
            _this$_points$slice2 = _slicedToArray(_this$_points$slice, 2),
            pointA = _this$_points$slice2[0],
            pointB = _this$_points$slice2[1];

        ctx.strokeStyle = uiColors["generatingLine"]["line"];
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
        var pointRadius = 2.0;
        ctx.fillStyle = uiColors["generatingLine"]["point"];
        pointA.draw(ctx, pointRadius);
        pointB.draw(ctx, pointRadius);
        var spacing = 4;
        ctx.font = "normal 10px Arial";
        ctx.fillStyle = uiColors["generatingLine"]["text"];
        ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y);
        ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y);
      }

      ctx.restore();
    }
  }, {
    key: "points",
    get: function get() {
      return this._points;
    }
  }, {
    key: "shallowAngle",
    get: function get() {
      return this._shallowAngle;
    }
  }]);

  return GeneratingLine;
}();

exports.GeneratingLine = GeneratingLine;

var GeneratingStrip =
/*#__PURE__*/
function () {
  function GeneratingStrip(generatingLine, stripWidth, repeat) {
    _classCallCheck(this, GeneratingStrip);

    this._generatingLine = generatingLine;
    this._stripWidth = stripWidth;
    this._repeat = repeat;
    this.generateStrip();
    this.generateCreasePattern();
  }

  _createClass(GeneratingStrip, [{
    key: "getPointsOrthogonalTo",
    value: function getPointsOrthogonalTo(pointA, pointB) {
      var heading = pointB.subtract(pointA).normalize();
      var orthogonal = new _vector["default"](heading.y, -heading.x, 0.0); // Keep the "handedness" of the line: `orthogonal` will always
      // be pointing "left" from `heading`

      if (heading.cross(orthogonal).z < 0.0) {
        orthogonal = orthogonal.multiplyScalar(-1.0);
      }

      orthogonal = orthogonal.multiplyScalar(this._stripWidth); // Add the two points "up" and "down"

      return [pointA.add(orthogonal), pointA.subtract(orthogonal)];
    }
  }, {
    key: "drawInfiniteLines",
    value: function drawInfiniteLines(ctx) {
      // The length of the "infinite" line segment: this is kind of silly, but it works for now
      var drawLength = 2000.0;
      ctx.save();
      ctx.strokeStyle = uiColors["generatingStrip"]["line"];
      ctx.setLineDash([2, 2]);

      for (var i = 0; i < this._lineEquations.length; i++) {
        var _this$_lineEquations$ = _slicedToArray(this._lineEquations[i][0], 2),
            mLeft = _this$_lineEquations$[0],
            bLeft = _this$_lineEquations$[1];

        var _this$_lineEquations$2 = _slicedToArray(this._lineEquations[i][1], 2),
            mRight = _this$_lineEquations$2[0],
            bRight = _this$_lineEquations$2[1];

        var lineLeftStart = new _vector["default"](-drawLength, mLeft * -drawLength + bLeft, 0.0);
        var lineLeftEnd = new _vector["default"](drawLength, mLeft * drawLength + bLeft, 0.0);
        ctx.beginPath();
        ctx.moveTo(lineLeftStart.x, lineLeftStart.y);
        ctx.lineTo(lineLeftEnd.x, lineLeftEnd.y);
        ctx.stroke();
        var lineRightStart = new _vector["default"](-drawLength, mRight * -drawLength + bRight, 0.0);
        var lineRightEnd = new _vector["default"](drawLength, mRight * drawLength + bRight, 0.0);
        ctx.beginPath();
        ctx.moveTo(lineRightStart.x, lineRightStart.y);
        ctx.lineTo(lineRightEnd.x, lineRightEnd.y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }, {
    key: "drawIntersections",
    value: function drawIntersections(ctx) {
      ctx.save();
      ctx.fillStyle = uiColors["generatingStrip"]["point"];

      this._intersections.forEach(function (intersection) {
        return intersection.draw(ctx, 3.0);
      });

      ctx.restore();
    }
  }, {
    key: "drawStripPolygons",
    value: function drawStripPolygons(ctx) {
      var _this = this;

      ctx.save();
      ctx.fillStyle = uiColors["generatingStrip"]["polygon"];

      this._stripPolygons.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 4),
            a = _ref4[0],
            b = _ref4[1],
            c = _ref4[2],
            d = _ref4[3];

        ctx.beginPath();
        ctx.moveTo(_this._intersections[a].x, _this._intersections[a].y);
        ctx.lineTo(_this._intersections[b].x, _this._intersections[b].y);
        ctx.lineTo(_this._intersections[c].x, _this._intersections[c].y);
        ctx.lineTo(_this._intersections[d].x, _this._intersections[d].y);
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();
    }
  }, {
    key: "drawAngles",
    value: function drawAngles(ctx) {
      ctx.save();

      for (var i = 1; i < this._generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbors (previous and next) along the path
        var _this$_generatingLine = this._generatingLine.points.slice(i - 1, i + 2),
            _this$_generatingLine2 = _slicedToArray(_this$_generatingLine, 3),
            pointA = _this$_generatingLine2[0],
            pointB = _this$_generatingLine2[1],
            pointC = _this$_generatingLine2[2];

        var _ref5 = [pointB.subtract(pointA).normalize(), pointC.subtract(pointB).normalize()],
            heading = _ref5[0],
            next = _ref5[1]; // The actual *major* fold angle that will need to be made at this point along the strip

        var foldAngle = Math.acos(heading.dot(next));
        var lerpedColor = utils.lerpColor(uiColors["generatingStrip"]["angle"]["acute"], uiColors["generatingStrip"]["angle"]["obtuse"], foldAngle / Math.PI);
        var _ref6 = [utils.atan2Wrapped(heading.y, heading.x), utils.atan2Wrapped(next.y, next.x)],
            startTheta = _ref6[0],
            endTheta = _ref6[1]; // Keep the same directionality as the path curves throughout space

        if (heading.cross(next).z < 0.0) {
          var _ref7 = [endTheta, startTheta];
          startTheta = _ref7[0];
          endTheta = _ref7[1];
        }

        var bisector = heading.bisector(next).normalize().multiplyScalar(25.0); // Display the angle (in degrees) as text

        ctx.textAlign = bisector.x < 0.0 ? "right" : "left";
        ctx.font = "bold 12px Courier New"; // Some unicode symbols

        var _ref8 = [String.fromCharCode(176), String.fromCharCode(9608)],
            unicodeDegrees = _ref8[0],
            unicodeBlock = _ref8[1];
        var textDegrees = Math.trunc(utils.toDegrees(foldAngle)).toString().concat(unicodeDegrees);
        var textBackground = unicodeBlock.repeat(textDegrees.length); // Draw a small text box to display the angles (in degrees)

        ctx.fillStyle = uiColors["generatingStrip"]["textBackground"];
        ctx.fillText(textBackground, pointB.x + bisector.x, pointB.y + bisector.y);
        ctx.fillStyle = lerpedColor;
        ctx.fillText(textDegrees, pointB.x + bisector.x, pointB.y + bisector.y); // Draw outer / inner arcs with different radii

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
  }, {
    key: "drawCreasePattern",
    value: function drawCreasePattern(ctx) {
      var offset = this._stripWidth; // Shrink the crease pattern so that it fits on the canvas

      var _utils$boundingBox = utils.boundingBox(this._vertices),
          _utils$boundingBox2 = _slicedToArray(_utils$boundingBox, 4),
          minX = _utils$boundingBox2[0],
          maxX = _utils$boundingBox2[1],
          minY = _utils$boundingBox2[2],
          maxY = _utils$boundingBox2[3];

      var currentW = maxX - minX,
          currentH = maxY - minY;
      var desiredW = document.getElementById("canvas_crease_pattern").width - 2.0 * offset;
      var desiredH = document.getElementById("canvas_crease_pattern").height - 2.0 * offset;
      var scaleX = desiredW / currentW,
          scaleY = desiredH / currentH;
      ctx.save();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._edges.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              edge = _step$value[1];

          var _edge = _slicedToArray(edge, 2),
              a = _edge[0],
              b = _edge[1]; //console.log(`i: ${index}, edge: ${edge} -> ${this._assignments[index]}`);
          // Color (and stipple) the line based on this edge's assignment


          var assignment = this._assignments[index];

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
          ctx.moveTo((this._vertices[a].x - minX) * scaleX + offset, (this._vertices[a].y - minY) * scaleY + offset);
          ctx.lineTo((this._vertices[b].x - minX) * scaleX + offset, (this._vertices[b].y - minY) * scaleY + offset);
          ctx.closePath();
          ctx.stroke();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ctx.restore();
    }
  }, {
    key: "draw",
    value: function draw(ctxDrawing, ctxCreasePattern) {
      this.drawStripPolygons(ctxDrawing);
      this.drawInfiniteLines(ctxDrawing);
      this.drawIntersections(ctxDrawing);
      this.drawAngles(ctxDrawing); // Drawn to a different canvas element

      this.drawCreasePattern(ctxCreasePattern);
    }
  }, {
    key: "generateStrip",
    value: function generateStrip() {
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

      for (var i = 0; i < this._generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbor along the path
        var _this$_generatingLine3 = this._generatingLine.points.slice(i, i + 2),
            _this$_generatingLine4 = _slicedToArray(_this$_generatingLine3, 2),
            pointA = _this$_generatingLine4[0],
            pointB = _this$_generatingLine4[1]; // Remember: `y = mx + b` - plug in one point and find the y-intercept


        var m = utils.slope(pointA, pointB);
        var b = pointA.y - m * pointA.x;

        var _this$getPointsOrthog = this.getPointsOrthogonalTo(pointA, pointB),
            _this$getPointsOrthog2 = _slicedToArray(_this$getPointsOrthog, 2),
            _pointLeft = _this$getPointsOrthog2[0],
            _pointRight = _this$getPointsOrthog2[1]; // Add the first pair of points: subsequent points will be
        // added later during the line-line intersection routine


        if (i === 0) {
          this._intersections.push(_pointLeft, _pointRight);
        } // Find the y-intercepts of each of the two parallel lines:
        // note that both lines have the same slope


        var bU = _pointLeft.y - m * _pointLeft.x,
            bD = _pointRight.y - m * _pointRight.x;

        this._lineEquations.push([[m, bU], [m, bD]]);
      }

      for (var _i2 = 0; _i2 < this._lineEquations.length - 1; _i2++) {
        // The first pair of lines
        var _this$_lineEquations$3 = _slicedToArray(this._lineEquations[_i2 + 0][0], 2),
            m0 = _this$_lineEquations$3[0],
            b0 = _this$_lineEquations$3[1];

        var _this$_lineEquations$4 = _slicedToArray(this._lineEquations[_i2 + 0][1], 2),
            m1 = _this$_lineEquations$4[0],
            b1 = _this$_lineEquations$4[1]; // The next pair of lines


        var _this$_lineEquations$5 = _slicedToArray(this._lineEquations[_i2 + 1][0], 2),
            m2 = _this$_lineEquations$5[0],
            b2 = _this$_lineEquations$5[1];

        var _this$_lineEquations$6 = _slicedToArray(this._lineEquations[_i2 + 1][1], 2),
            m3 = _this$_lineEquations$6[0],
            b3 = _this$_lineEquations$6[1]; // Calculate the intersection between l0 and l3 and the intersection between l1 and l2


        var _ref9 = [utils.intersect(m0, b0, m3, b3), utils.intersect(m1, b1, m2, b2)],
            intersectionA = _ref9[0],
            intersectionB = _ref9[1]; // Push back points of intersection: note the order of insertion matters here
        // for proper CCW winding order

        this._intersections.push(intersectionB, intersectionA);
      } // Finally, add the last two points


      var l = this._generatingLine.length();

      var _this$getPointsOrthog3 = this.getPointsOrthogonalTo(this._generatingLine.points[l - 1], this._generatingLine.points[l - 2]),
          _this$getPointsOrthog4 = _slicedToArray(_this$getPointsOrthog3, 2),
          pointLeft = _this$getPointsOrthog4[0],
          pointRight = _this$getPointsOrthog4[1];

      this._intersections.push(pointLeft, pointRight);

      for (var _i3 = 0; _i3 < this._intersections.length - 2; _i3 += 2) {
        // 0-----3
        // |     |
        // |     |
        // 1-----2
        var upperLeft = _i3 + 0;
        var lowerLeft = _i3 + 1;
        var lowerRight = _i3 + 2;
        var upperRight = _i3 + 3;

        this._stripPolygons.push([upperLeft, lowerLeft, lowerRight, upperRight]);
      }
    }
  }, {
    key: "rearrangePolygon",
    value: function rearrangePolygon(a, b, c, d, currentOffset, flip, last) {
      // First, gather the points that form this particular polygon
      var polygonPoints = [this._intersections[a], this._intersections[b], this._intersections[c], this._intersections[d]]; // A direction vector that runs parallel to this polygon's bottom edge

      var bottomEdge = polygonPoints[2].subtract(polygonPoints[1]);
      var topLeftCorner = polygonPoints[0].copy(); // Rotate the bottom edge to be aligned with the x-axis

      var theta = bottomEdge.signedAngle(_vector["default"].xAxis());

      var rotationMatrix = _matrix["default"].rotationZ(-theta);

      for (var i = 0; i < polygonPoints.length; i++) {
        // Rotate around the top-left corner of the polygon (the first point)
        polygonPoints[i] = rotationMatrix.multiply(polygonPoints[i].subtract(topLeftCorner)); // Flip across the x-axis and move down by the strip width

        if (flip) {
          polygonPoints[i].y = -polygonPoints[i].y;
          polygonPoints[i].y -= this._stripWidth * 2.0;
        }
      } // Top right corner, after rotation


      var offset = polygonPoints[2].x; // If this is the last polygon to be added, add all 4 points, othe;rwise only
      // add the first two: we do this to avoid adding the same vertices multiple times

      var numberOfVerticesToAdd = last ? 4 : 2;

      for (var _i4 = 0; _i4 < numberOfVerticesToAdd; _i4++) {
        this._vertices.push(polygonPoints[_i4].add(new _vector["default"](currentOffset, 0.0, 0.0)));
      }

      return offset;
    }
  }, {
    key: "generateCreasePattern",
    value: function generateCreasePattern() {
      this._vertices = [];
      this._edges = [];
      this._faces = [];
      this._assignments = [];
      var cumulativeOffset = 0.0;
      var flip = true; // The total number of closed polygons that form the silhouette of this strip

      var numberOfPolygons = this._intersections.length / 2;

      for (var i = 0; i < numberOfPolygons - 1; i++) {
        // 2, 4, 6, 8, etc.
        var startIndex = i * 2; // Whether or not this is the last polygon in the strip

        var last = i === numberOfPolygons - 2;
        var a = startIndex + 0,
            b = startIndex + 1,
            c = startIndex + 2,
            d = startIndex + 3;
        var offset = this.rearrangePolygon(a, b, c, d, cumulativeOffset, flip, last);
        cumulativeOffset += offset; // Add this face, taking care to note whether the polygon was flipped
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

        var indices = flip ? [b, a, d, c] : [a, b, c, d];

        this._faces.push(indices); // The next polygon will need to be flipped, etc.


        flip = !flip;
      } // Reflect the entire pattern across the x-axis
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


      var numberOfReflections = this._repeat - 1;

      var facesCurrent = _toConsumableArray(this._faces);

      for (var row = 0; row < numberOfReflections; row++) {
        var _this$_faces;

        //console.log('Row:', row)
        var facesNext = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = facesCurrent.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                faceIndex = _step2$value[0],
                face = _step2$value[1];

            // Unpack face indices
            var _face = _slicedToArray(face, 4),
                upperLeft = _face[0],
                lowerLeft = _face[1],
                lowerRight = _face[2],
                upperRight = _face[3]; // First, duplicate the two lower vertices across the positive x-axis


            var _ref10 = [this._vertices[lowerLeft].copy(), this._vertices[lowerRight].copy()],
                vertexA = _ref10[0],
                vertexB = _ref10[1];
            var translateY = 4.0 * this._stripWidth;
            vertexA.y += translateY;
            vertexB.y += translateY; // Create the new set of face indices

            var reflectedFace = [this._vertices.length + 0, upperLeft, upperRight, this._vertices.length + 1]; // Push back the new pair of vertices: we only want to add the
            // left vertex to avoid duplicates - except for the last face

            this._vertices.push(vertexA);

            if (faceIndex == facesCurrent.length - 1) {
              this._vertices.push(vertexB);
            }

            facesNext.push(reflectedFace);
          } // Add the newly generated faces to the global crease pattern

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        (_this$_faces = this._faces).push.apply(_this$_faces, facesNext); // Set the "next" array of faces to be processed


        facesCurrent = [].concat(facesNext);
      } // Construct edges and assignments


      var facesPerRow = this._faces.length / this._repeat;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._faces.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _step3$value = _slicedToArray(_step3.value, 2),
              faceIndex = _step3$value[0],
              face = _step3$value[1];

          // Unpack face indices
          var _face2 = _slicedToArray(face, 4),
              a = _face2[0],
              b = _face2[1],
              c = _face2[2],
              d = _face2[3]; // Now, circle around the face and add its edges, in order


          for (var edgeIndex = 0; edgeIndex < face.length; edgeIndex++) {
            var xAxis = _vector["default"].xAxis(); // Calculate two of the interior angles of this face


            var rightEdgeDirection = this._vertices[d].subtract(this._vertices[c]).normalize();

            var thetaInteriorRight = Math.abs(xAxis.angle(rightEdgeDirection));

            var leftEdgeDirection = this._vertices[a].subtract(this._vertices[b]).normalize();

            var thetaInteriorLeft = Math.abs(xAxis.angle(leftEdgeDirection)); // Calculate the "row" and "column" indices of this face within the "grid" of faces
            // that form the crease pattern

            var _row = Math.floor(faceIndex / facesPerRow);

            var col = faceIndex % facesPerRow;
            var isEvenRow = _row % 2 === 0; // Calculate complementary angles

            if (isEvenRow) {
              var _ref11 = [Math.PI - thetaInteriorLeft, Math.PI - thetaInteriorRight];
              thetaInteriorLeft = _ref11[0];
              thetaInteriorRight = _ref11[1];
            } // Is this face even or odd, along the horizontal axis?


            var parity = col % 2 === 0; // Have we reached a face that contains a border edge?

            var isLeftEnd = faceIndex % facesPerRow === 0;
            var isRightEnd = faceIndex % facesPerRow === facesPerRow - 1;
            var isTopEnd = _row === numberOfReflections;
            var isBottomEnd = _row === 0; // This variable will not be changed for border edges

            var assignment = "B";

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
            } // Add edge indices, modulo the number of indices in this face (4):
            //
            // (0, 1)
            // (1, 2)
            // (2, 3)
            // (3, 0) <-- This is where the modulo operator matters
            //


            var edgeIndices = [face[(edgeIndex + 0) % 4], face[(edgeIndex + 1) % 4]]; // We are going to keep the edges sorted so that we can remove
            // duplicates later

            edgeIndices.sort(function (a, b) {
              return a - b;
            });

            this._edges.push(edgeIndices);

            this._assignments.push(assignment);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: "exportFoldData",
    value: function exportFoldData() {
      // See: `https://github.com/edemaine/fold`
      var fold = {
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
        edges_assignment: this._assignments,
        edges_foldAngles: []
      }; // Vertices need to be reformatted

      var scale = 1.0;

      this._vertices.forEach(function (v) {
        return fold["vertices_coords"].push([v.x * scale, v.y * scale * 4.0, v.z * scale]);
      });

      this._assignments.forEach(function (a) {
        if (a === "M") {
          fold["edges_foldAngles"].push(-Math.PI);
        } else if (a === "V") {
          fold["edges_foldAngles"].push(Math.PI);
        } else {
          fold["edges_foldAngles"].push(0.0);
        }
      });

      return fold;
    }
  }, {
    key: "generatingLine",
    get: function get() {
      return this._generatingLine;
    }
  }, {
    key: "stripWidth",
    get: function get() {
      return this._stripWidth;
    }
  }, {
    key: "repeat",
    get: function get() {
      return this._repeat;
    }
  }, {
    key: "lineEquations",
    get: function get() {
      return this._lineEquations;
    }
  }, {
    key: "intersections",
    get: function get() {
      return this._intersections;
    }
  }, {
    key: "stripPolygons",
    get: function get() {
      return this._stripPolygons;
    }
  }, {
    key: "vertices",
    get: function get() {
      return this._vertices;
    }
  }, {
    key: "edges",
    get: function get() {
      return this._edges;
    }
  }, {
    key: "faces",
    get: function get() {
      return this._faces;
    }
  }, {
    key: "assignments",
    get: function get() {
      return this._assignments;
    }
  }]);

  return GeneratingStrip;
}();

exports.GeneratingStrip = GeneratingStrip;

},{"./matrix":4,"./utils":5,"./vector":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vector = _interopRequireDefault(require("./vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Matrix =
/*#__PURE__*/
function () {
  function Matrix(columnA, columnB, columnC) {
    _classCallCheck(this, Matrix);

    this.columnA = columnA;
    this.columnB = columnB;
    this.columnC = columnC;
  }

  _createClass(Matrix, [{
    key: "multiply",
    value: function multiply(vec) {
      var x = this.columnA.x * vec.x + this.columnB.x * vec.y + this.columnC.x * vec.z;
      var y = this.columnA.y * vec.x + this.columnB.y * vec.y + this.columnC.y * vec.z;
      var z = this.columnA.z * vec.x + this.columnB.z * vec.y + this.columnC.z * vec.z;
      return new _vector["default"](x, y, z);
    }
  }, {
    key: "print",
    value: function print() {}
  }], [{
    key: "identity",
    value: function identity() {
      return new Matrix(_vector["default"].xAxis(), _vector["default"].yAxis(), _vector["default"].zAxis());
    }
  }, {
    key: "rotationX",
    value: function rotationX(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      return new Matrix(new _vector["default"](1.0, 0.0, 0.0), new _vector["default"](0.0, c, s), new _vector["default"](0.0, -s, c));
    }
  }, {
    key: "rotationY",
    value: function rotationY(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      return new Matrix(new _vector["default"](c, 0.0, -s), new _vector["default"](0.0, 1.0, 0.0), new _vector["default"](s, 0.0, c));
    }
  }, {
    key: "rotationZ",
    value: function rotationZ(theta) {
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      return new Matrix(new _vector["default"](c, s, 0.0), new _vector["default"](-s, c, 0.0), new _vector["default"](0.0, 0.0, 1.0));
    }
  }]);

  return Matrix;
}();

exports["default"] = Matrix;

},{"./vector":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.boundingBox = boundingBox;
exports.slope = slope;
exports.intersect = intersect;
exports.atan2Wrapped = atan2Wrapped;
exports.toDegrees = toDegrees;
exports.toRadians = toRadians;
exports.lerpColor = lerpColor;
exports.convertHex = convertHex;

var _vector = _interopRequireDefault(require("./vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var espilon = 0.001;

function boundingBox(vectors) {
  var minX = 0.0;
  var maxX = 0.0;
  var minY = 0.0;
  var maxY = 0.0;
  vectors.forEach(function (vector) {
    if (vector.x < minX) minX = vector.x;
    if (vector.x > maxX) maxX = vector.x;
    if (vector.y < minY) minY = vector.y;
    if (vector.y > maxY) maxY = vector.y;
  });
  return [minX, maxX, minY, maxY];
}
/**
 * Calculates the slope of the line between two points.
 * @param {Vector} pointA - the first point (technically, vector)
 * @param {Vector} pointB - the second point (technically, vector)
 * @returns {number} the slope
 */


function slope(pointA, pointB) {
  var num = pointB.y - pointA.y;
  var den = pointB.x - pointA.x;

  if (den === 0.0) {
    console.log("Denominator is zero!");
    den = espilon;
  }

  return num / den;
}

function intersect(m0, b0, m1, b1) {
  var xInter = (b0 - b1) / (m1 - m0);
  var yInter = m0 * xInter + b0;
  return new _vector["default"](xInter, yInter, 0.0);
}

function atan2Wrapped(y, x) {
  var intermediate = Math.atan2(y, x);
  return (intermediate + 2.0 * Math.PI) % (2.0 * Math.PI);
}

function toDegrees(x) {
  return x * (180.0 / Math.PI);
}

function toRadians(x) {
  return x * (Math.PI / 180.0);
}

function lerpColor(a, b, amount) {
  var ah = parseInt(a.replace(/#/g, ""), 16);
  var ar = ah >> 16;
  var ag = ah >> 8 & 0xff;
  var ab = ah & 0xff;
  var bh = parseInt(b.replace(/#/g, ""), 16);
  var br = bh >> 16;
  var bg = bh >> 8 & 0xff;
  var bb = bh & 0xff;
  var rr = ar + amount * (br - ar);
  var rg = ag + amount * (bg - ag);
  var rb = ab + amount * (bb - ab);
  return "#" + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function convertHex(hex, opacity) {
  hex = hex.replace("#", "");
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  var result = "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
  return result;
}

},{"./vector":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vector =
/*#__PURE__*/
function () {
  function Vector(x, y, z) {
    _classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
    this.z = z;
  }

  _createClass(Vector, [{
    key: "copy",
    value: function copy() {
      return new Vector(this.x, this.y, this.z);
    }
  }, {
    key: "add",
    value: function add(other) {
      return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }
  }, {
    key: "subtract",
    value: function subtract(other) {
      return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
    }
  }, {
    key: "multiplyScalar",
    value: function multiplyScalar(sc) {
      return new Vector(this.x * sc, this.y * sc, this.z * sc);
    }
  }, {
    key: "divideScalar",
    value: function divideScalar(sc) {
      return new Vector(this.x / sc, this.y / sc, this.z / sc);
    }
  }, {
    key: "cross",
    value: function cross(other) {
      var x = this.y * other.z - this.z * other.y;
      var y = this.z * other.x - this.x * other.z;
      var z = this.x * other.y - this.y * other.x;
      return new Vector(x, y, z);
    }
  }, {
    key: "dot",
    value: function dot(other) {
      return this.x * other.x + this.y * other.y + this.z * other.z;
    }
  }, {
    key: "length",
    value: function length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var l = this.length();
      return this.divideScalar(l);
    }
  }, {
    key: "angle",
    value: function angle(other) {
      // Make sure the vector is normalized
      var normalized = this.normalize(); // Find the angle between `this` and `other`

      var angle = Math.acos(normalized.dot(other.normalize()));
      return angle;
    }
  }, {
    key: "signedAngle",
    value: function signedAngle(other) {
      // Make sure the vector is normalized
      var normalized = this.normalize(); // Find the angle between `this` and `other`

      var angle = Math.acos(normalized.dot(other));
      var cross = normalized.cross(other); // Potentially reverse the angle

      if (Vector.zAxis().dot(cross) > 0.0) {
        angle = -angle;
      }

      return angle;
    }
  }, {
    key: "bisector",
    value: function bisector(other) {
      return this.multiplyScalar(other.length()).add(other.multiplyScalar(this.length()));
    }
  }, {
    key: "print",
    value: function print() {
      console.log("x: ".concat(this.x, ", y: ").concat(this.y, ", z: ").concat(this.z));
    }
  }, {
    key: "draw",
    value: function draw(ctx, radius) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }], [{
    key: "xAxis",
    value: function xAxis() {
      return new Vector(1.0, 0.0, 0.0);
    }
  }, {
    key: "yAxis",
    value: function yAxis() {
      return new Vector(0.0, 1.0, 0.0);
    }
  }, {
    key: "zAxis",
    value: function zAxis() {
      return new Vector(0.0, 0.0, 1.0);
    }
  }]);

  return Vector;
}();

exports["default"] = Vector;

},{}]},{},[1]);
