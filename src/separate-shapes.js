var isNullOrNil = function(value) {
  if (value && value.isKindOfClass(NSNull)) {
    return true
  } else if (value) {
    return false
  }
  return true
};

var ops = {
  SUBTRACT: "-",
  INTERSECT: "∩"
};

var splitAndStylePath = function(sg, shape1, shape2, op) {
  if (!isNullOrNil(sg)) {
    sg.setStyle(shape1.style());
    let splitNS = sg.splitPathsIntoShapes();
    let count = splitNS.count();
    let splitJS = new Array(count);
    for (let i = count - 1; i >= 0; i--) {
      let shape = splitNS[i];
      shape.setName(shape1.name() + " " + op + " " + shape2.name() + (i > 0 ? " " + i : ""));
      splitJS[i] = shape;
    }
    return splitJS;
  }
}

var shapeGroupFromOp = function(shape1, shape2, op) {
  let path1 = shape1.bezierPathWithTransforms(),
      path2 = shape2.bezierPathWithTransforms(),
      newPath = null;
  switch(op) {
    case ops.SUBTRACT:
      newPath = path1.booleanSubtractWith(path2);
      break;
    case ops.INTERSECT:
      newPath = path1.booleanIntersectWith(path2);
      break;
  }
  if (newPath) {
    let sg = MSShapeGroup.shapeWithBezierPath(newPath);
    switch(op) {
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

var baseShapeBySubtractingOthers = function(selection) {
  let shape = selection[0];
  const layers = selection.count();
  let name = "";
  for (let i = layers - 1; i > 0; i--) {
    shape = MSShapeGroup.shapeWithBezierPath(shape.bezierPathWithTransforms().booleanSubtractWith(selection[i].bezierPathWithTransforms()));
    name += (name != "" ? " " + ops.SUBTRACT + " " : "") + selection[i].name();
  }
  shape.setName(name);
  shape.setStyle(selection[0].style());
  return shape;
}

var separate = function(context) {
  let selection = context.selection;
  let layers = selection.count();

  if (layers >= 2) {
    let separatedShapeGroups = [];

    let baseShape = baseShapeBySubtractingOthers(selection, layers);
    separatedShapeGroups.push(splitAndStylePath(baseShape, selection[0], baseShape, ops.SUBTRACT));

    for (let i = 1; i < layers; i++) {
      separatedShapeGroups.push(shapeGroupFromOp(selection[i], selection[0], ops.SUBTRACT));
      separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[i], ops.INTERSECT));
      selection[i].removeFromParent();
    }
    separatedShapeGroups = [].concat.apply([], separatedShapeGroups.filter(layer => layer));

    selection[0].parentGroup().insertLayers_afterLayer(separatedShapeGroups, selection[0]);
    context.document.currentPage().changeSelectionBySelectingLayers(separatedShapeGroups);

    selection[0].removeFromParent();
  }
  else {
    context.document.showMessage("Select more than one shape");
  }
}

export default separate;
