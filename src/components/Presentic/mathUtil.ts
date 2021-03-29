// XXX: most probably these calculations could be done better just by using
// matrix operations, without decomposing the matrices

export type Point = {
  x: number;
  y: number;
};

export type DecomposedMatrix = {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  rotation: number;
};
// http://stackoverflow.com/questions/16359246/how-to-extract-position-rotation-and-scale-from-matrix-svg
export function decomposeMatrix(matrix: SVGMatrix): DecomposedMatrix {
  // @see https://gist.github.com/2052247

  // calculate delta transform point
  var px = deltaTransformPoint(matrix, { x: 0, y: 1 });
  var py = deltaTransformPoint(matrix, { x: 1, y: 0 });

  // calculate skew
  var skewX = (180 / Math.PI) * Math.atan2(px.y, px.x) - 90;
  var skewY = (180 / Math.PI) * Math.atan2(py.y, py.x);

  return {
    translateX: matrix.e,
    translateY: matrix.f,
    scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
    scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
    skewX: skewX,
    skewY: skewY,
    rotation: skewX, // rotation is the same as skew x
  };
}

export function deltaTransformPoint(matrix: SVGMatrix, point: Point): Point {
  var dx = point.x * matrix.a + point.y * matrix.c + 0;
  var dy = point.x * matrix.b + point.y * matrix.d + 0;
  return { x: dx, y: dy };
}

// Fixes rotations so that each step rotates as little as possible
// to make the presentation more pleasant to follow
// Takes array of rotations and returns array of fixed rotations
export function normalizeRotations(rotations: number[]) {
  return rotations.map((rotation, i) => {
    if (i === 0) {
      return rotation;
    }

    const prevRotation = rotations[i - 1];
    const diff = rotationDiff(prevRotation, rotation);
    return prevRotation + diff;
  });
}

// http://stackoverflow.com/questions/4310311/how-to-rotate-an-image-clockwise-or-counterclockwise-whichever-is-shorter
export function rotationDiff(x: number, y: number): number {
  const a = (x * Math.PI) / 180 - Math.PI;
  const b = (y * Math.PI) / 180 - Math.PI;
  return Math.atan2(Math.sin(b - a), Math.cos(b - a)) * (180 / Math.PI);
}
