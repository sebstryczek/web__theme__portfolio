export const deg2rad = Math.PI / 180;

export const rotateAroundWorldAxis = (object, axis, radians) => {
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis( axis.normalize(), radians );
  rotationMatrix.multiply( object.matrix ); // pre-multiply
  object.matrix = rotationMatrix;
  object.rotation.setFromRotationMatrix( object.matrix );
}

export const getPointOnCircle = (originX, originY, radius, angleDeg) => {
  const angleRad = angleDeg * deg2rad;
  return {
    x: originX + radius * Math.cos(angleRad),
    y: originY + radius * Math.sin(angleRad)
  }
}

export const normalizeToRange = (val, min, max) => {
  return (val - min) / (max - min);
}