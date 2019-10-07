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
var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
divCanvas.appendChild(canvas); // Grab the 2D rendering context

var ctx = canvas.getContext('2d'); // Grab references to DOM elements

var buttonClear = document.getElementById('button-clear');
var pNumberOfPoints = document.getElementById("p-number-of-points"); // Add event listeners

canvas.addEventListener('mousedown', addPoint);
buttonClear.addEventListener('click', clearCanvas);

function resize() {
  // Make the canvas full-screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

var generatingLine = new _generating.GeneratingLine();

function clearCanvas(e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  generatingLine.clear();
}

function addPoint(e) {
  generatingLine.push(new _vector["default"](e.offsetX, e.offsetY, 0.0));
  pNumberOfPoints.innerHTML = "Number of Points: ".concat(generatingLine.length().toString());
  drawCanvas();
}

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (generatingLine.length() > 1) {
    var generatingStrip = new _generating.GeneratingStrip(generatingLine, 10.0);
    generatingStrip.draw(ctx);
  }

  generatingLine.draw(ctx);
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
  }

  _createClass(GeneratingLine, [{
    key: "push",
    value: function push(point) {
      this.points.push(point);
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
      if (this.points.length > 1) {
        ctx.setLineDash([]);

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
      }
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
    this.build();
    this.generateCreasePattern();
  }
  /** 
   * Calculates the slope of the line between two points.
    * @param {Point} pointA - the first point
    * @param {Point} pointB - the second point
    * @returns {number} the slope
    */


  _createClass(GeneratingStrip, [{
    key: "slope",
    value: function slope(pointA, pointB) {
      var num = pointB.y - pointA.y;
      var den = pointB.x - pointA.x;

      if (den === 0.0) {
        console.error('Denominator is zero!');
      }

      return num / den;
    }
  }, {
    key: "intersect",
    value: function intersect(m0, b0, m1, b1) {
      var xInter = (b0 - b1) / (m1 - m0); // Plug into the first equation (arbitrary) to find the y-intercept

      var yInter = m0 * xInter + b0;
      return new _vector["default"](xInter, yInter, 0.0);
    }
  }, {
    key: "getPointsOrthogonalTo",
    value: function getPointsOrthogonalTo(pointA, pointB) {
      // A vector that points from `pointA` towards `pointB`
      var direct = pointB.subtract(pointA).normalize(); // A vector orthogonal to `direct`

      var ortho = new _vector["default"](direct.y, -direct.x, 0.0);
      ortho = ortho.normalize(); // Keep the "handedness" of the line: `ortho` will always
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
    }
  }, {
    key: "drawIntersections",
    value: function drawIntersections(ctx) {
      ctx.fillStyle = '#d96448';
      this.intersections.forEach(function (intersection) {
        return intersection.draw(ctx);
      });
    }
  }, {
    key: "drawPolygons",
    value: function drawPolygons(ctx) {
      var _this = this;

      ctx.fillStyle = "rgba(154, 227, 226, 0.5)";
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
    }
  }, {
    key: "drawAngles",
    value: function drawAngles(ctx) {
      ctx.setLineDash([]);

      for (var i = 1; i < this.generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbor along the path
        var pointA = this.generatingLine.points[i - 1];
        var pointB = this.generatingLine.points[i + 0];
        var pointC = this.generatingLine.points[i + 1];
        var toAfromB = pointA.subtract(pointB).normalize();
        var toCfromB = pointC.subtract(pointB).normalize();
        var startTheta = utils.atan2Wrapped(toAfromB.y, toAfromB.x);
        var endTheta = utils.atan2Wrapped(toCfromB.y, toCfromB.x); // The angle between the two vectors

        var between = Math.acos(toAfromB.dot(toCfromB));

        if (toAfromB.cross(toCfromB).z < 0.0) {
          between = 2.0 * Math.PI - between;
        }

        var bisector = toAfromB.bisector(toCfromB).normalize().multiplyScalar(30.0);
        var lerpedColor = utils.lerpColor('#e3cc39', '#bf3054', between / (2.0 * Math.PI));
        var unicodeDeg = String.fromCharCode(176);
        var spacing = 30;
        ctx.font = "bold 12px Courier New";
        ctx.fillStyle = lerpedColor;
        ctx.fillText("".concat(Math.trunc(utils.toDegrees(between)).toString()).concat(unicodeDeg), pointB.x + bisector.x, pointB.y + bisector.y);
        ctx.strokeStyle = lerpedColor;
        ctx.beginPath();
        ctx.arc(pointB.x, pointB.y, 18.0, startTheta, endTheta);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pointB.x, pointB.y, 20.0, startTheta, endTheta);
        ctx.stroke();
      }
    }
  }, {
    key: "drawCreasePattern",
    value: function drawCreasePattern(ctx) {
      var offset = this.stripWidth;

      var _utils$boundingBox = utils.boundingBox(this.vertices),
          _utils$boundingBox2 = _slicedToArray(_utils$boundingBox, 4),
          minX = _utils$boundingBox2[0],
          maxX = _utils$boundingBox2[1],
          minY = _utils$boundingBox2[2],
          maxY = _utils$boundingBox2[3];

      var currentWidth = maxX - minX;
      var desiredWidth = 600.0 - this.stripWidth * 2.0;
      var scale = desiredWidth / currentWidth;
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

          ctx.strokeStyle = "#f2f0f0"; // Same as the canvas background color

          ctx.fillStyle = utils.lerpColor('#e3cc39', '#bf3054', index / this.faces.length);
          ctx.beginPath();
          ctx.moveTo(this.vertices[a].x * scale + offset, this.vertices[a].y + offset * 3.0);
          ctx.lineTo(this.vertices[b].x * scale + offset, this.vertices[b].y + offset * 3.0);
          ctx.lineTo(this.vertices[c].x * scale + offset, this.vertices[c].y + offset * 3.0);
          ctx.lineTo(this.vertices[d].x * scale + offset, this.vertices[d].y + offset * 3.0);
          ctx.closePath();
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
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.drawPolygons(ctx);
      this.drawInfiniteLines(ctx);
      this.drawIntersections(ctx);
      this.drawAngles(ctx);
      this.drawCreasePattern(ctx);
    }
  }, {
    key: "build",
    value: function build() {
      this.lineEquations = [];
      this.intersections = [];
      this.polygons = [];

      for (var i = 0; i < this.generatingLine.length() - 1; i++) {
        // Grab a point and its immediate neighbor along the path
        var pointA = this.generatingLine.points[i + 0];
        var pointB = this.generatingLine.points[i + 1];
        var m = this.slope(pointA, pointB); // Remember: `y = mx + b`
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


        var intersectionA = this.intersect(m0, b0, m3, b3); // Calculate the intersection between l1 and l2

        var intersectionB = this.intersect(m1, b1, m2, b2); // Push back points of intersection: note the order of insertion matters here
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
    value: function rearrangePolygon(a, b, c, d, curr_offset, flip, last) {
      var _this2 = this;

      // This function assumes an ordering:
      // 0-----3
      // |     |
      // |     |
      // 1-----2
      // Gather points
      var all_pts = [this.intersections[a], this.intersections[b], this.intersections[c], this.intersections[d]]; // A direction vector that runs parallel to this polygon's bottom edge

      var bottom_edge = all_pts[2].subtract(all_pts[1]); // Rotate the bottom edge to be aligned with the x-axis

      var theta = bottom_edge.signedAngle(_vector["default"].xAxis());

      var rotationMatrix = _matrix["default"].rotationZ(-theta);

      var rotated_pts = [];
      all_pts.forEach(function (pt) {
        // Rotate around the top-left corner of the polygon (the first point)
        var rot = pt.subtract(all_pts[0]);
        rot = rotationMatrix.multiply(rot);

        if (flip) {
          // Flip across the x-axis and move down by the strip width
          rot.y = -rot.y;
          rot.y -= _this2.stripWidth * 2.0;
        }

        rotated_pts.push(rot);
      }); // Top right corner

      var offset = rotated_pts[2].x; // If this is the last polygon to be added, add all 4 points, otherwise only 
      // add the first two: we do this to avoid adding the same vertices multiple times

      if (last) {
        rotated_pts.forEach(function (pt) {
          _this2.vertices.push(pt.add(new _vector["default"](curr_offset, 0.0, 0.0)));
        });
      } else {
        for (var i = 0; i < 2; i++) {
          this.vertices.push(rotated_pts[i].add(new _vector["default"](curr_offset, 0.0, 0.0)));
        }
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
      var flip = false;
      var numberOfPolygons = this.intersections.length / 2;

      for (var i = 0; i < numberOfPolygons - 1; i++) {
        // The starting index of this polygon (i.e. 2, 4, 6, 8, etc.)
        var start = i * 2; // Whether or not this is the last polygon in the strip

        var last = i == numberOfPolygons - 2;
        var offset = this.rearrangePolygon(start + 0, start + 1, start + 2, start + 3, cumulativeOffset, flip, last);
        cumulativeOffset += offset; // The next polygon will need to be flipped, etc.

        flip = !flip;
      } // Construct faces


      for (var _i4 = 0; _i4 < numberOfPolygons - 1; _i4++) {
        // The starting index of this polygon (i.e. 2, 4, 6, 8, etc.)
        var _start = _i4 * 2; // Was this polygon flipped?
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


        if (_i4 % 2 != 0) {
          var indices = [_start + 1, _start + 0, _start + 3, _start + 2];
          this.faces.push(indices);
        } else {
          var _indices = [_start + 0, _start + 1, _start + 2, _start + 3];
          this.faces.push(_indices);
        }
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
exports.atan2Wrapped = atan2Wrapped;
exports.toDegrees = toDegrees;
exports.toRadians = toRadians;
exports.lerpColor = lerpColor;

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

},{}],5:[function(require,module,exports){
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
