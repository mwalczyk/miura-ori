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
  var generatingStrip = new _generating.GeneratingStrip(generatingLine, 10.0);
  generatingStrip.draw(ctx);
  generatingLine.draw(ctx);
}

},{"./src/generating":2,"./src/vector":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeneratingStrip = exports.GeneratingLine = void 0;

var _vector = _interopRequireDefault(require("./vector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
      var xAxis = new _vector["default"](1.0, 0.0, 0.0);

      for (var i = 1; i < this.generatingLine.length() - 1; i++) {
        var remap = function remap(x) {
          return (x + 2.0 * Math.PI) % (2.0 * Math.PI);
        };

        var toDegrees = function toDegrees(x) {
          return x * (180.0 / Math.PI);
        }; // The angle between the two vectors


        // Grab a point and its immediate neighbor along the path
        var pointA = this.generatingLine.points[i - 1];
        var pointB = this.generatingLine.points[i + 0];
        var pointC = this.generatingLine.points[i + 1];
        var toAfromB = pointA.subtract(pointB).normalize();
        var toCfromB = pointC.subtract(pointB).normalize();
        var startTheta = Math.atan2(toAfromB.y, toAfromB.x);
        var endTheta = Math.atan2(toCfromB.y, toCfromB.x);
        var between = Math.acos(toAfromB.dot(toCfromB));

        if (toAfromB.cross(toCfromB).z < 0.0) {
          console.log('dasdasdasdas');
          between = 2.0 * Math.PI - between;
        }

        var bisector = toAfromB.bisector(toCfromB).normalize();
        bisector = bisector.multiplyScalar(30.0);
        var lerpedColor = lerpColor('#e3cc39', '#bf3054', between / Math.PI);
        var unicodeDeg = String.fromCharCode(176);
        var spacing = 30;
        ctx.font = "bold 12px Courier New";
        ctx.fillStyle = lerpedColor;
        ctx.fillText("".concat(Math.trunc(toDegrees(between)).toString()).concat(unicodeDeg), pointB.x + bisector.x, pointB.y + bisector.y);
        ctx.strokeStyle = lerpedColor;
        ctx.beginPath();
        ctx.arc(pointB.x, pointB.y, 18.0, remap(startTheta), remap(endTheta));
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pointB.x, pointB.y, 20.0, remap(startTheta), remap(endTheta));
        ctx.stroke();
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.generatingLine.length() > 1) {
        this.drawPolygons(ctx);
        this.drawInfiniteLines(ctx);
        this.drawIntersections(ctx);
        this.drawAngles(ctx);
      }
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
  }]);

  return GeneratingStrip;
}();

exports.GeneratingStrip = GeneratingStrip;

},{"./vector":3}],3:[function(require,module,exports){
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
  }]);

  return Vector;
}();

exports["default"] = Vector;

},{}]},{},[1]);
