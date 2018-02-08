var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isNullOrNil = function isNullOrNil(value) {
  if (value && value.isKindOfClass(NSNull)) {
    return true;
  } else if (value) {
    return false;
  }
  return true;
};

var ops = {
  SUBTRACT: "-",
  INTERSECT: "∩"
};

var splitAndStylePath = function splitAndStylePath(sg, shape1, shape2, op) {
  if (!isNullOrNil(sg)) {
    sg.setStyle(shape1.style());
    var splitNS = sg.splitPathsIntoShapes();
    var count = splitNS.count();
    var splitJS = new Array(count);
    for (var i = count - 1; i >= 0; i--) {
      var shape = splitNS[i];
      shape.setName(shape1.name() + " " + op + " " + shape2.name() + (i > 0 ? " " + i : ""));
      splitJS[i] = shape;
    }
    return splitJS;
  }
};

var shapeGroupFromOp = function shapeGroupFromOp(shape1, shape2, op) {
  var path1 = shape1.bezierPathWithTransforms(),
      path2 = shape2.bezierPathWithTransforms(),
      newPath = null;
  switch (op) {
    case ops.SUBTRACT:
      newPath = path1.booleanSubtractWith(path2);
      break;
    case ops.INTERSECT:
      newPath = path1.booleanIntersectWith(path2);
      break;
  }
  if (newPath) {
    var sg = MSShapeGroup.shapeWithBezierPath(newPath);
    return splitAndStylePath(sg, shape1, shape2, op);
  }
  return null;
};

var baseShapeBySubtractingOthers = function baseShapeBySubtractingOthers(selection) {
  var shape = selection[0];
  var layers = selection.count();
  var name = "";
  for (var i = layers - 1; i > 0; i--) {
    shape = MSShapeGroup.shapeWithBezierPath(shape.bezierPathWithTransforms().booleanSubtractWith(selection[i].bezierPathWithTransforms()));
    name += (name != "" ? " " + ops.SUBTRACT + " " : "") + selection[i].name();
  }
  shape.setName(name);
  shape.setStyle(selection[0].style());
  return shape;
};

var separate = function separate(context) {
  var selection = context.selection;
  var layers = selection.count();

  if (layers >= 2) {
    var separatedShapeGroups = [];

    var baseShape = baseShapeBySubtractingOthers(selection, layers);
    separatedShapeGroups.push(splitAndStylePath(baseShape, selection[0], baseShape, ops.SUBTRACT));

    for (var i = 1; i < layers; i++) {
      separatedShapeGroups.push(shapeGroupFromOp(selection[i], selection[0], ops.SUBTRACT));
      separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[i], ops.INTERSECT));
      selection[i].removeFromParent();
    }
    separatedShapeGroups = [].concat.apply([], separatedShapeGroups.filter(function (layer) {
      return layer;
    }));

    selection[0].parentGroup().insertLayers_afterLayer(separatedShapeGroups, selection[0]);
    context.document.currentPage().changeSelectionBySelectingLayers(separatedShapeGroups);

    selection[0].removeFromParent();
  } else {
    context.document.showMessage("Select more than one shape");
  }
};

exports["default"] = separate;

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
