(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _generating = require("./src/generating");

var _vector = _interopRequireDefault(require("./src/vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var divCanvas = document.getElementById('div-canvas');
var canvasDrawing = document.createElement('canvas');
canvasDrawing.setAttribute('id', 'canvas-drawing');
canvasDrawing.setAttribute('class', 'canvas-upper');
canvasDrawing.width = 600;
canvasDrawing.height = 600;
var canvasCreasePattern = document.createElement('canvas');
canvasCreasePattern.setAttribute('id', 'canvas-crease-pattern');
canvasCreasePattern.setAttribute('class', 'canvas-lower');
canvasCreasePattern.width = 600;
canvasCreasePattern.height = 180;
divCanvas.appendChild(canvasDrawing);
divCanvas.appendChild(canvasCreasePattern); // Grab the 2D rendering context

var ctxDrawing = canvasDrawing.getContext('2d');
var ctxCreasePattern = canvasCreasePattern.getContext('2d'); // Grab references to DOM elements

var buttonClear = document.getElementById('button-clear');
var pNumberOfPoints = document.getElementById("p-number-of-points"); // Add event listeners

canvasDrawing.addEventListener('mousedown', addPoint);
buttonClear.addEventListener('click', clearCanvas);

function resize() {
  // Make the canvas full-screen
  canvasDrawing.width = window.innerWidth;
  canvasDrawing.height = window.innerHeight;
}

var generatingLine = new _generating.GeneratingLine();

function clearCanvas(e) {
  ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
  ctxCreasePattern.clearRect(0, 0, canvasCreasePattern.width, canvasCreasePattern.height);
  generatingLine.clear();
}

function addPoint(e) {
  generatingLine.push(new _vector["default"](e.offsetX, e.offsetY, 0.0));
  pNumberOfPoints.innerHTML = "Number of Points: ".concat(generatingLine.length().toString());
  drawCanvas();
}

function drawCanvas() {
  ctxDrawing.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height);
  ctxCreasePattern.clearRect(0, 0, canvasCreasePattern.width, canvasCreasePattern.height);

  if (generatingLine.length() > 1) {
    var generatingStrip = new _generating.GeneratingStrip(generatingLine, 10.0);
    generatingStrip.draw(ctxDrawing, ctxCreasePattern);
  }

  generatingLine.draw(ctxDrawing);
}

},{"./src/generating":2,"./src/vector":5}],2:[function(require,module,exports){
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

var GeneratingLine =
/*#__PURE__*/
function () {
  function GeneratingLine() {
    _classCallCheck(this, GeneratingLine);

    this.points = [];
    this.shallowAngle = utils.toRadians(150.0);
  }

  _createClass(GeneratingLine, [{
    key: "push",
    value: function push(point) {
      this.points.push(point);
    }
  }, {
    key: "pop",
    value: function pop() {
      this.points.pop();
    }
  }, {
    key: "length",
    value: function length() {
      return this.points.length;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.points.length = 0;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.save();

      for (var i = 0; i < this.points.length - 1; i++) {
        var pointA = this.points[i + 0];
        var pointB = this.points[i + 1];
        ctx.strokeStyle = '#948e8e';
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
        ctx.fillStyle = '#576d94';
        pointA.draw(ctx);
        pointB.draw(ctx);
        var spacing = 4;
        ctx.font = "normal 10px Arial";
        ctx.fillStyle = '#344054';
        ctx.fillText((i + 0).toString(), pointA.x + spacing, pointA.y);
        ctx.fillText((i + 1).toString(), pointB.x + spacing, pointB.y);
      }

      ctx.restore();
    }
  }]);

  return GeneratingLine;
}();

exports.GeneratingLine = GeneratingLine;

var GeneratingStrip =
/*#__PURE__*/
function () {
  function GeneratingStrip(generatingLine, stripWidth) {
    _classCallCheck(this, GeneratingStrip);

    this.generatingLine = generatingLine;
    this.stripWidth = stripWidth;
    this.generateStrip();
    this.generateCreasePattern();
  }

  _createClass(GeneratingStrip, [{
    key: "getPointsOrthogonalTo",
    value: function getPointsOrthogonalTo(pointA, pointB) {
      // A vector that points from `pointA` towards `pointB`
      var direct = pointB.subtract(pointA).normalize(); // A vector orthogonal to `direct`

      var ortho = new _vector["default"](direct.y, -direct.x, 0.0); // Keep the "handedness" of the line: `ortho` will always
      // be pointing "left" from `direct`

      if (direct.cross(ortho).z < 0.0) {
        ortho = ortho.multiplyScalar(-1.0);
      }

      ortho = ortho.multiplyScalar(this.stripWidth); // The two points "up" and "down"

      var pointU = pointA.add(ortho);
      var pointD = pointA.subtract(ortho);
      return [pointU, pointD];
    }
  }, {
    key: "drawInfiniteLines",
    value: function drawInfiniteLines(ctx) {
      // The length of the "infinite" line segment: this is kind of silly, but it works for now
      var drawLength = 2000.0;
      ctx.save();
      ctx.strokeStyle = '#bab5b5';
      ctx.setLineDash([2, 2]);

      for (var i = 0; i < this.lineEquations.length; i++) {
        var _this$lineEquations$i = _slicedToArray(this.lineEquations[i][0], 2),
            mU = _this$lineEquations$i[0],
            bU = _this$lineEquations$i[1];

        var _this$lineEquations$i2 = _slicedToArray(this.lineEquations[i][1], 2),
            mD = _this$lineEquations$i2[0],
            bD = _this$lineEquations$i2[1];

        var lineUStart = new _vector["default"](-drawLength, mU * -drawLength + bU, 0.0);
        var lineUEnd = new _vector["default"](drawLength, mU * drawLength + bU, 0.0);
        ctx.beginPath();
        ctx.moveTo(lineUStart.x, lineUStart.y);
        ctx.lineTo(lineUEnd.x, lineUEnd.y);
        ctx.stroke();
        var lineDStart = new _vector["default"](-drawLength, mD * -drawLength + bD, 0.0);
        var lineDEnd = new _vector["default"](drawLength, mD * drawLength + bD, 0.0);
        ctx.beginPath();
        ctx.moveTo(lineDStart.x, lineDStart.y);
        ctx.lineTo(lineDEnd.x, lineDEnd.y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }, {
    key: "drawIntersections",
    value: function drawIntersections(ctx) {
      ctx.save();
      ctx.fillStyle = '#d96448';
      this.intersections.forEach(function (intersection) {
        return intersection.draw(ctx);
      });
      ctx.restore();
    }
  }, {
    key: "drawPolygons",
    value: function drawPolygons(ctx) {
      var _this = this;

      ctx.save();
      ctx.fillStyle = utils.convertHex('#9ae3e2', 50.0);
      this.polygons.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 4),
            a = _ref2[0],
            b = _ref2[1],
            c = _ref2[2],
            d = _ref2[3];

        ctx.beginPath();
        ctx.moveTo(_this.intersections[a].x, _this.intersections[a].y);
        ctx.lineTo(_this.intersections[b].x, _this.intersections[b].y);
        ctx.lineTo(_this.intersections[c].x, _this.intersections[c].y);
        ctx.lineTo(_this.intersections[d].x, _this.intersections[d].y);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }
  }, {
    key: "drawAngles",
    value: function drawAngles(ctx) {
      ctx.save();

      for (var i = 1; i < this.generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbor along the path
        var pointA = this.generatingLine.points[i - 1];
        var pointB = this.generatingLine.points[i + 0];
        var pointC = this.generatingLine.points[i + 1];
        var heading = pointB.subtract(pointA).normalize();
        var next = pointC.subtract(pointB).normalize(); // The actual *major* fold angle that will need to be made at this point along the strip

        var foldAngle = Math.acos(heading.dot(next));
        var lerpedColor = utils.lerpColor('#bf3054', '#e3cc39', foldAngle / Math.PI);
        var startTheta = utils.atan2Wrapped(heading.y, heading.x);
        var endTheta = utils.atan2Wrapped(next.y, next.x); // Keep the same directionality as the path curves throughout space

        if (heading.cross(next).z < 0.0) {
          var _ref3 = [endTheta, startTheta];
          startTheta = _ref3[0];
          endTheta = _ref3[1];
        }

        var bisector = heading.bisector(next).normalize().multiplyScalar(25.0); // Display the angle (in degrees) as text

        if (bisector.x < 0.0) {
          ctx.textAlign = 'right';
        } else {
          ctx.textAlign = 'left';
        }

        var unicodeDeg = String.fromCharCode(176);
        ctx.font = "bold 12px Courier New";
        ctx.fillStyle = lerpedColor;
        ctx.fillText("".concat(Math.trunc(utils.toDegrees(foldAngle)).toString()).concat(unicodeDeg), pointB.x + bisector.x, pointB.y + bisector.y); // Draw outer / inner arcs with different radii

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
      var offset = this.stripWidth; // Shrink the CP down horizontally so that it fits on the canvas

      var _utils$boundingBox = utils.boundingBox(this.vertices),
          _utils$boundingBox2 = _slicedToArray(_utils$boundingBox, 4),
          minX = _utils$boundingBox2[0],
          maxX = _utils$boundingBox2[1],
          minY = _utils$boundingBox2[2],
          maxY = _utils$boundingBox2[3];

      var currentWidth = maxX - minX;
      var desiredWidth = document.getElementById('canvas-drawing').width - 2.0 * offset;
      var scale = desiredWidth / currentWidth;
      ctx.save();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.faces.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              face = _step$value[1];

          var _face = _slicedToArray(face, 4),
              a = _face[0],
              b = _face[1],
              c = _face[2],
              d = _face[3];

          var percent = index / this.faces.length;
          ctx.strokeStyle = "#f2f0f0"; // Same as the canvas background color

          ctx.fillStyle = utils.lerpColor('#e3cc39', '#bf3054', percent);
          ctx.beginPath();
          ctx.moveTo(this.vertices[a].x * scale + offset, this.vertices[a].y + offset * 3.0);
          ctx.lineTo(this.vertices[b].x * scale + offset, this.vertices[b].y + offset * 3.0);
          ctx.lineTo(this.vertices[c].x * scale + offset, this.vertices[c].y + offset * 3.0);
          ctx.lineTo(this.vertices[d].x * scale + offset, this.vertices[d].y + offset * 3.0);
          ctx.closePath(); // Draw both filled and stroked versions of the face

          ctx.fill();
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
      this.drawPolygons(ctxDrawing);
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
      this.lineEquations = [];
      this.intersections = [];
      this.polygons = [];

      for (var i = 0; i < this.generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbor along the path
        var pointA = this.generatingLine.points[i + 0];
        var pointB = this.generatingLine.points[i + 1];
        var m = utils.slope(pointA, pointB); // Remember: `y = mx + b`
        // Plug in one point and find the y-intercept

        var b = pointA.y - m * pointA.x;

        var _this$getPointsOrthog = this.getPointsOrthogonalTo(pointA, pointB),
            _this$getPointsOrthog2 = _slicedToArray(_this$getPointsOrthog, 2),
            _pointU = _this$getPointsOrthog2[0],
            _pointD = _this$getPointsOrthog2[1]; // Add the first pair of points: subsequent points will be 
        // added later during the line-line intersection routine


        if (i === 0) {
          this.intersections.push(_pointU);
          this.intersections.push(_pointD);
        } // Find the y-intercepts of each of the two parallel lines:
        // note that both lines have the same slope `m`


        var bU = _pointU.y - m * _pointU.x;
        var bD = _pointD.y - m * _pointD.x;
        this.lineEquations.push([[m, bU], [m, bD]]);
      }

      for (var _i2 = 0; _i2 < this.lineEquations.length - 1; _i2++) {
        // The first pair of lines
        var _this$lineEquations$ = _slicedToArray(this.lineEquations[_i2 + 0][0], 2),
            m0 = _this$lineEquations$[0],
            b0 = _this$lineEquations$[1];

        var _this$lineEquations$2 = _slicedToArray(this.lineEquations[_i2 + 0][1], 2),
            m1 = _this$lineEquations$2[0],
            b1 = _this$lineEquations$2[1]; // The next pair of lines


        var _this$lineEquations$3 = _slicedToArray(this.lineEquations[_i2 + 1][0], 2),
            m2 = _this$lineEquations$3[0],
            b2 = _this$lineEquations$3[1];

        var _this$lineEquations$4 = _slicedToArray(this.lineEquations[_i2 + 1][1], 2),
            m3 = _this$lineEquations$4[0],
            b3 = _this$lineEquations$4[1]; // Calculate the intersection between l0 and l3


        var intersectionA = utils.intersect(m0, b0, m3, b3); // Calculate the intersection between l1 and l2

        var intersectionB = utils.intersect(m1, b1, m2, b2); // Push back points of intersection: note the order of insertion matters here
        // for proper CCW winding order

        this.intersections.push(intersectionB);
        this.intersections.push(intersectionA);
      } // Finally, add the last two points


      var l = this.generatingLine.length();

      var _this$getPointsOrthog3 = this.getPointsOrthogonalTo(this.generatingLine.points[l - 1], this.generatingLine.points[l - 2]),
          _this$getPointsOrthog4 = _slicedToArray(_this$getPointsOrthog3, 2),
          pointU = _this$getPointsOrthog4[0],
          pointD = _this$getPointsOrthog4[1];

      this.intersections.push(pointU);
      this.intersections.push(pointD);

      for (var _i3 = 0; _i3 < this.intersections.length - 2; _i3 += 2) {
        // a-----d
        // |     |
        // |     |
        // b-----c
        var a = _i3 + 0;

        var _b = _i3 + 1;

        var c = _i3 + 2;
        var d = _i3 + 3;
        this.polygons.push([a, _b, c, d]);
      }
    }
  }, {
    key: "rearrangePolygon",
    value: function rearrangePolygon(a, b, c, d, currentOffset, flip, last) {
      // This function assumes the following vertex order per face:
      //
      // 0-----3
      // |     |
      // |     |
      // 1-----2
      //
      // First, gather the points that form this particular polygon
      var polygonPoints = [this.intersections[a], this.intersections[b], this.intersections[c], this.intersections[d]]; // A direction vector that runs parallel to this polygon's bottom edge

      var bottomEdge = polygonPoints[2].subtract(polygonPoints[1]);
      var topLeftCorner = polygonPoints[0]; // Rotate the bottom edge to be aligned with the x-axis

      var theta = bottomEdge.signedAngle(_vector["default"].xAxis());

      var rotationMatrix = _matrix["default"].rotationZ(-theta);

      for (var i = 0; i < polygonPoints.length; i++) {
        // Rotate around the top-left corner of the polygon (the first point)
        polygonPoints[i] = rotationMatrix.multiply(polygonPoints[i].subtract(topLeftCorner)); // Flip across the x-axis and move down by the strip width

        if (flip) {
          polygonPoints[i].y = -polygonPoints[i].y;
          polygonPoints[i].y -= this.stripWidth * 2.0;
        }
      } // Top right corner, after rotation


      var offset = polygonPoints[2].x; // If this is the last polygon to be added, add all 4 points, otherwise only 
      // add the first two: we do this to avoid adding the same vertices multiple times

      var iterations = last ? 4 : 2;

      for (var _i4 = 0; _i4 < iterations; _i4++) {
        this.vertices.push(polygonPoints[_i4].add(new _vector["default"](currentOffset, 0.0, 0.0)));
      }

      return offset;
    }
  }, {
    key: "generateCreasePattern",
    value: function generateCreasePattern() {
      this.vertices = [];
      this.edges = [];
      this.faces = [];
      this.assignments = [];
      var cumulativeOffset = 0.0;
      var flip = false; // The total number of closed polygons that form the silhouette of this strip

      var numberOfPolygons = this.intersections.length / 2;

      for (var i = 0; i < numberOfPolygons - 1; i++) {
        // 2, 4, 6, 8, etc.
        var startIndex = i * 2; // Whether or not this is the last polygon in the strip

        var last = i == numberOfPolygons - 2;
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
        this.faces.push(indices); // The next polygon will need to be flipped, etc.

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


      var numberOfRows = 8;
      var numberOfReflections = numberOfRows - 1;

      var facesCurrent = _toConsumableArray(this.faces);

      for (var row = 0; row < numberOfReflections; row++) {
        var _this$faces;

        //console.log('Row:', row)
        var facesNext = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = facesCurrent.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                _i5 = _step2$value[0],
                f = _step2$value[1];

            var ul = f[0]; // Upper left

            var ll = f[1]; // Lower left 

            var lr = f[2]; // Lower right

            var ur = f[3]; // Upper right
            // First, duplicate the two lower vertices across the positive x-axis

            var vertexA = this.vertices[ll].copy();
            var vertexB = this.vertices[lr].copy();
            var r = 4.0 * this.stripWidth;
            vertexA.y += r;
            vertexB.y += r; // Create the new set of face indices

            var reflectedFace = [this.vertices.length + 0, ul, ur, this.vertices.length + 1]; // Push back the new pair of vertices: we only want to add the 
            // left vertex to avoid duplicates - except for the last face

            this.vertices.push(vertexA);

            if (_i5 == facesCurrent.length - 1) {
              this.vertices.push(vertexB);
            } // Push back the new face


            facesNext.push(reflectedFace);
          } // Add new faces to global array

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

        (_this$faces = this.faces).push.apply(_this$faces, facesNext); // Reset array of faces to be processed


        facesCurrent = [].concat(facesNext);
      }
    }
  }]);

  return GeneratingStrip;
}();

exports.GeneratingStrip = GeneratingStrip;

},{"./matrix":3,"./utils":4,"./vector":5}],3:[function(require,module,exports){
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

},{"./vector":5}],4:[function(require,module,exports){
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
    console.log('Denominator is zero!');
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
  var ah = parseInt(a.replace(/#/g, ''), 16),
      ar = ah >> 16,
      ag = ah >> 8 & 0xff,
      ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ''), 16),
      br = bh >> 16,
      bg = bh >> 8 & 0xff,
      bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);
  return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function convertHex(hex, opacity) {
  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
  return result;
}

},{"./vector":5}],5:[function(require,module,exports){
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
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
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
