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
  let path1 = shape1.bezierPath(),
      path2 = shape2.bezierPath(),
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
      sg.setName(shape1.name() + " " + op + " " + shape2.name());
      sg.setStyle(shape1.style());
      return sg;
    }
  }
  return null;
};

export default function(context) {
  let selection = context.selection;

  if (selection.count() == 2) {
    let separatedShapeGroups = [];
    separatedShapeGroups.push(shapeGroupFromOp(selection[1], selection[0], ops.SUBTRACT));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], ops.SUBTRACT));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], ops.INTERSECT));
    const filteredGroups = separatedShapeGroups.filter(layer => layer);

    context.document.currentPage().addLayers(filteredGroups);
    context.document.currentPage().changeSelectionBySelectingLayers(filteredGroups);

    selection[0].removeFromParent();
    selection[1].removeFromParent();
  }
  else {
    context.document.showMessage("Select exactly two shapes");
  }
}