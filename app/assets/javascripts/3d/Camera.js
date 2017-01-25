
Camera = function(system) {
  var canvas = system.canvas,
      scale = SystemBrowser.SCALE;

  THREE.PerspectiveCamera.call(this, 70, // fov
                               canvas.clientWidth / canvas.clientHeight, // ar
                               scale/1000000, 100 * scale); // near, far clip

  this.up.set(0, 0, 1);
  this.position.z = scale;

  // Tuck controls under this.camera
  this.controls = new THREE.OrbitControls(this, system.renderer.domElement);
  this.controls.enablePan = false;
  this.controls.zoomSpeed = 2.0;
};

Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.setTarget = function(body) {
  var r;
  if (body.object3d.body.geometry.boundingSphere) {
    r = body.object3d.body.geometry.boundingSphere.radius;
  } else {
    body.object3d.body.geometry.computeBoundingSphere();
    r = body.object3d.body.geometry.boundingSphere.radius;
    body.object3d.body.geometry.boundingSphere = null;
  }

  this.controls.minDistance = 1.6 * r;
  this.controls.target = body.object3d.position;
};

Camera.prototype.setDistance = function(km) {
  var p = this.position.clone().sub(this.controls.target);
  p = p.normalize().multiplyScalar(km / Orbit.KM_PER_AU).add(this.controls.target);
  this.position.set(p.x, p.y, p.z);
};

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
