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

exports["default"] = function (context) {
  var selection = context.selection;

  if (selection.count() == 2) {
    var separatedShapeGroups = [];
    separatedShapeGroups.push(shapeGroupFromOp(selection[1], selection[0], ops.SUBTRACT));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], ops.SUBTRACT));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], ops.INTERSECT));
    var filteredGroups = separatedShapeGroups.filter(function (layer) {
      return layer;
    });

    context.document.currentPage().addLayers(filteredGroups);
    context.document.currentPage().changeSelectionBySelectingLayers(filteredGroups);

    selection[0].removeFromParent();
    selection[1].removeFromParent();
  } else {
    context.document.showMessage("Select exactly two shapes");
  }
};

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

var shapeGroupFromOp = function shapeGroupFromOp(shape1, shape2, op) {
  var path1 = shape1.bezierPath(),
      path2 = shape2.bezierPath(),
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
    if (!isNullOrNil(sg)) {
      sg.setName(shape1.name() + " " + op + " " + shape2.name());
      sg.setStyle(shape1.style());
      return sg;
    }
  }
  return null;
};

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
