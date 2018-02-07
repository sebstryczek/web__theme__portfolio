export const screenToWorldPoint = (camera, screenPoint, z) => {
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshBasicMaterial()
  );
  plane.position.z = z;
  const v3 = new THREE.Vector3(screenPoint.x, screenPoint.y, 0);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(screenPoint, camera);
  const intersect = raycaster.intersectObject(plane, false);
  const pos = intersect[0].point.clone();
  /*
  Pro Way
  screenPoint.unproject( app.camera );
  const dir = screenPoint.sub( app.camera.position ).normalize();
  const distance = - app.camera.position.z / dir.z;
  const pos = app.camera.position.clone().add( dir.multiplyScalar( distance ) );
  */
  return pos;
}

export const isScreenPointOverObject = (camera, point, obj) => {
  const v2 = new THREE.Vector2(point.x, point.y);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(v2, camera);
  const intersects = raycaster.intersectObject(obj, true);
  return intersects.length > 0;
}

export const getObjectFaceOnPoint = (camera, point, obj) => {
  const v2 = new THREE.Vector2(point.x, point.y);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(v2, camera);
  const intersects = raycaster.intersectObject(obj);
  const intersect = intersects[0] || {};
  return intersect.face;
}
