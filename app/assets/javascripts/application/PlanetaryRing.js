
PlanetaryRing = function(innerRadiusKm, outerRadiusKm) {
  this.innerRadiusKm = innerRadiusKm;
  this.outerRadiusKm = outerRadiusKm;
  this.texture = null;
};

PlanetaryRing.prototype.updateObject3d = function() {
  var sunline = new THREE.Vector3();

  return function(ctx, body) {
    // this assumes Sun is root and has already been positioned
    sunline.copy(ctx.root.object3d.position)
      .sub(body.object3d.position).normalize();
    this.spotlight.position.copy(body.object3d.position)
      .addScaledVector(sunline, this.spotlightDistance);
  };
}();

PlanetaryRing.prototype.createObject3d = function(ctx, body) {
  var emissivecolor = 0xffffff;
  this.object3d = new THREE.Mesh();
  this.object3d.up.set(0, 0, 1);

  this.object3d.geometry =
    new THREE.SweptRingGeometry(ctx.auToPx*this.innerRadiusKm/Orbit.KM_PER_AU,
                                ctx.auToPx*this.outerRadiusKm/Orbit.KM_PER_AU,
                                30, 30);
  this.object3d.material = new THREE.MeshPhongMaterial({
    map: ctx.loadTexture(this.texture),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
    emissive: emissivecolor,
    emissiveMap: ctx.loadTexture(this.texture),
    emissiveIntensity: 0.4
  });
  this.object3d.rotation.set(-Math.PI/2, 0, 0);

  // Shadows cast from the Sun don't look good (it is too far away).
  // So we invent a spotlight pointing at the rings from about 25 body radii away.
  // Still need to work on this problem... It creates a spotlight in the scene
  // which may have unwanted effects
  this.spotlight = new THREE.SpotLight(0xffffff);
  this.spotlight.castShadow = true;
  this.spotlight.angle = Math.PI / 30;
  this.spotlight.shadow.camera.near = body.bodyRadius(ctx);
  this.spotlight.shadow.camera.far = 30 * body.bodyRadius(ctx);
  this.spotlight.intensity = 0.25;
  this.spotlight.target = body.object3d;
  this.spotlightDistance = 25 * body.bodyRadius(ctx);

  body.object3d.body.castShadow = true;
  this.object3d.receiveShadow = true;

  ctx.scene.add(this.spotlight);

  body.object3d.add(this.object3d);
};
