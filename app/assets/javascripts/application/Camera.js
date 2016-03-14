
Camera = function(system) {
  var canvas = system.canvas,
      auToPx = system.auToPx;

  THREE.PerspectiveCamera.call(this, 70, // fov
                               canvas.clientWidth / canvas.clientHeight, // ar
                               auToPx/1000000, 100 * auToPx); // near, far clip

  this.up.set(0, 0, 1);
  this.position.z = auToPx;

  // Tuck controls under this.camera
  this.controls = new THREE.OrbitControls(this, system.renderer.domElement);
  this.controls.enablePan = false;
  this.controls.zoomSpeed = 2.0;
};

Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.setTarget = function(object3d) {
  var r;
  if (object3d.geometry.boundingSphere) {
    r = object3d.geometry.boundingSphere.radius;
  } else {
    object3d.geometry.computeBoundingSphere();
    r = object3d.geometry.boundingSphere.radius;
    object3d.geometry.boundingSphere = null;
  }

  this.controls.minDistance = 1.6 * r;
  this.controls.target = object3d.position;
}

if (!Float64Array.from) {
  Float64Array.from = function(array) {
    var result = new Float64Array(array.length);
    for (var i=0; i < array.length; ++i)
      result[i] = array[i];
    return result;
  };
}

Camera.prototype.rayCast = function() {
  var raycaster = new THREE.Raycaster();
  var f64CamWorld = new THREE.Matrix4();
  var f64CamProjection = new THREE.Matrix4();
  var f64Proj = new THREE.Matrix4();

  f64CamWorld.elements = Float64Array.from(f64CamWorld.elements);
  f64CamProjection.elements = Float64Array.from(f64CamProjection.elements);
  f64Proj.elements = Float64Array.from(f64Proj.elements);

  return function(objects, mouse) {
    for (var i=0; i < 16; ++i) {
      f64CamWorld.elements[i] = this.matrixWorld.elements[i];
      f64CamProjection.elements[i] = this.projectionMatrix.elements[i];
    }

    f64Proj.identity()
      .multiplyMatrices(f64CamWorld, f64Proj.getInverse(f64CamProjection));

    raycaster.ray.origin
      .setFromMatrixPosition(f64CamWorld);

    raycaster.ray.direction
      .set(mouse.x, mouse.y, 0.5)
      .applyProjection(f64Proj)
      .sub(raycaster.ray.origin).normalize();

    var intersects = raycaster
        .intersectObjects(objects, true)
        .filter(function(x) {
          return x.object.visible && x.object.userData.body;
        });

    return intersects;
  }
}();
