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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/separate-shapes.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/separate-shapes.js":
/*!********************************!*\
  !*** ./src/separate-shapes.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
    var splitNS = sg.layers();
    var count = splitNS.count();
    var splitJS = new Array(count);

    for (var i = count - 1; i >= 0; i--) {
      var layer = splitNS[i];
      var path = layer.pathInFrameWithTransforms();
      var shape = MSLayer.layerWithPath(path);
      shape.setStyle(shape1.style());
      shape.frame().setX(sg.frame().x());
      shape.frame().setY(sg.frame().y());
      shape.setName(shape1.name() + " " + op + " " + shape2.name() + (i > 0 ? " " + i : ""));
      splitJS[i] = shape;
    }

    return splitJS;
  }
};

var shapeGroupFromOp = function shapeGroupFromOp(shape1, shape2, op) {
  var path1 = shape1.pathInFrameWithTransforms(),
      path2 = shape2.pathInFrameWithTransforms(),
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
    var sg = MSShapeGroup.layerWithPath(newPath);

    switch (op) {
      case ops.SUBTRACT:
        return splitAndStylePath(sg, shape1, shape2, op);
        break;

      case ops.INTERSECT:
        return splitAndStylePath(sg, shape2, shape1, op);
        break;
    }
  }

  return null;
};

var baseShapeBySubtractingOthers = function baseShapeBySubtractingOthers(selection) {
  var count = selection.count();
  var baseShape = selection[0];
  var name = selection[0].name();

  for (var i = count - 1; i > 0; i--) {
    baseShape = MSLayer.layerWithPath(baseShape.pathInFrameWithTransforms().booleanSubtractWith(selection[i].pathInFrameWithTransforms()));
    name += ops.SUBTRACT + " " + selection[i].name();
  }

  baseShape.setName(name);
  baseShape.setStyle(selection[0].style());
  return baseShape;
};

var separate = function separate(context) {
  var selection = context.selection;
  var layers = selection.count();

  if (layers >= 2) {
    var separatedShapeGroups = [];
    var baseShape = baseShapeBySubtractingOthers(selection, layers);
    separatedShapeGroups.push(baseShape); //separatedShapeGroups.push(splitAndStylePath(baseShape, selection[0], baseShape, ops.SUBTRACT));

    for (var i = 1; i < layers; i++) {
      separatedShapeGroups.push(shapeGroupFromOp(selection[i], selection[0], ops.SUBTRACT));
      separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[i], ops.INTERSECT));
      selection[i].removeFromParent();
    }

    separatedShapeGroups = [].concat.apply([], separatedShapeGroups.filter(function (layer) {
      return layer;
    }));
    selection[0].parentGroup().addLayers(separatedShapeGroups);
    context.document.currentPage().changeSelectionBySelectingLayers(separatedShapeGroups);
    selection[0].removeFromParent();
  } else {
    context.document.showMessage("Select more than one shape");
  }
};

/* harmony default export */ __webpack_exports__["default"] = (separate);

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=separate-shapes.js.map