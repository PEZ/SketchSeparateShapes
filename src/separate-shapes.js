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
  return null;
};

var separate = function(context) {
  let selection = context.selection;

  if (selection.count() == 2) {
    const separatedShapeGroups = [].concat.apply([], [
      shapeGroupFromOp(selection[1], selection[0], ops.SUBTRACT),
      shapeGroupFromOp(selection[0], selection[1], ops.SUBTRACT),
      shapeGroupFromOp(selection[0], selection[1], ops.INTERSECT)
    ].filter(layer => layer));

    selection[0].parentGroup().insertLayers_afterLayer(separatedShapeGroups, selection[0]);
    context.document.currentPage().changeSelectionBySelectingLayers(separatedShapeGroups);

    selection[0].removeFromParent();
    selection[1].removeFromParent();
  }
  else {
    context.document.showMessage("Select exactly two shapes");
  }
}

export default separate;