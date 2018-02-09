const findScene = obj => obj.parent == null || obj.parent.type == "Scene" ? obj.parent : findScene(obj.parent);

export const screenToWorldPoint = (camera, point, obj) => {
  const v2 = new THREE.Vector2(point.x, point.y);
  const raycaster = new THREE.Raycaster();

  const objScene = findScene(obj);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 0),
    new THREE.MeshBasicMaterial({visible: true})
  );
  objScene.add(plane);

  raycaster.setFromCamera(v2, camera);
  const intersects = raycaster.intersectObject(plane, true);
  const intersect = intersects[0] || {};
  const pos = intersect.point ? intersect.point.clone() : null;
  
  objScene.remove(plane);
  /*
  Pro Way?
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
