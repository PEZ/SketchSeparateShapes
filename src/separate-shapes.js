var isNullOrNil = function(value) {
  if (value && value.isKindOfClass(NSNull)) {
    return true
  } else if (value) {
    return false
  }
  return true
};

var shapeGroupFromOp = function(shape1, shape2, opName) {
  let path1 = shape1.bezierPath(),
      path2 = shape2.bezierPath(),
      newPath = null;
  switch(opName) {
    case "subtract":
      newPath = path1.booleanSubtractWith(path2);
      break;
    case "intersect":
      newPath = path1.booleanIntersectWith(path2);
      break;
  }
  if (newPath) {
    let sg = MSShapeGroup.shapeWithBezierPath(newPath);
    if (!isNullOrNil(sg)) {
      sg.setName(shape1.name() + " - " + shape2.name());
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
    separatedShapeGroups.push(shapeGroupFromOp(selection[1], selection[0], "subtract"));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], "subtract"));
    separatedShapeGroups.push(shapeGroupFromOp(selection[0], selection[1], "intersect"));
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