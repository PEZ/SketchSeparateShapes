var isNullOrNil = function (value) {
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

var splitAndStylePath = function (sg, shape1, shape2, op) {
  if (!isNullOrNil(sg)) {
    let splitNS = sg.layers();
    let count = splitNS.count();
    let splitJS = new Array(count);
    for (let i = count - 1; i >= 0; i--) {
      let layer = splitNS[i];
      let path = layer.pathInFrameWithTransforms();
      let shape = MSLayer.layerWithPath(path);
      shape.setStyle(shape1.style());
      shape.frame().setX(sg.frame().x());
      shape.frame().setY(sg.frame().y());
      shape.setName(shape1.name() + " " + op + " " + shape2.name() + (i > 0 ? " " + i : ""));
      splitJS[i] = shape;
    }
    return splitJS;
  }
}

var shapeGroupFromOp = function (shape1, shape2, op) {
  let path1 = shape1.pathInFrameWithTransforms(),
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
    let sg = MSShapeGroup.layerWithPath(newPath);
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

var baseShapeBySubtractingOthers = function (selection) {
  const count = selection.count();
  let baseShape = selection[0];
  let name = selection[0].name();

  for (let i = count - 1; i > 0; i--) {
    baseShape = MSLayer.layerWithPath(baseShape.pathInFrameWithTransforms().booleanSubtractWith(selection[i].pathInFrameWithTransforms()));
    name += ops.SUBTRACT + " " + selection[i].name();
  }
  baseShape.setName(name);
  baseShape.setStyle(selection[0].style());
  return baseShape;
}

var separate = function (context) {
  let selection = context.selection;
  let layers = selection.count();

  if (layers >= 2) {
    let separatedShapeGroups = [];

    let baseShape = baseShapeBySubtractingOthers(selection, layers);
    separatedShapeGroups.push(baseShape);
    //separatedShapeGroups.push(splitAndStylePath(baseShape, selection[0], baseShape, ops.SUBTRACT));

    for (let i = 1; i < layers; i++) {
      separatedShapeGroups.push(shapeGroupFromOp(selection[i], selection[0], ops.SUBTRACT));
      separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[i], ops.INTERSECT));
      selection[i].removeFromParent();
    }
    separatedShapeGroups = [].concat.apply([], separatedShapeGroups.filter(layer => layer));

    selection[0].parentGroup().addLayers(separatedShapeGroups);
    context.document.currentPage().changeSelectionBySelectingLayers(separatedShapeGroups);

    selection[0].removeFromParent();
  }
  else {
    context.document.showMessage("Select more than one shape");
  }
}

export default separate;
