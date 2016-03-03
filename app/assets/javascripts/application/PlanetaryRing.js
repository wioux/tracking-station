
PlanetaryRing = function(innerRadiusKm, outerRadiusKm) {
  this.innerRadiusKm = innerRadiusKm;
  this.outerRadiusKm = outerRadiusKm;
  this.texture = null;
};

PlanetaryRing.prototype.drawShadows = function(ctx, pos) {
  // this assumes Sun is root and has already been positioned
  var sunline = ctx.root.shell.position.clone().sub(pos).normalize();
  this.spotlight.position.copy(pos).addScaledVector(sunline, this.spotlightDistance);
};

PlanetaryRing.prototype.getRing = function(ctx, body) {
  this.mesh = new THREE.Mesh();
  this.mesh.geometry =
    new THREE.SweptRingGeometry(ctx.auToPx*this.innerRadiusKm/Orbit.KM_PER_AU,
                                ctx.auToPx*this.outerRadiusKm/Orbit.KM_PER_AU,
                                30, 30);
  this.mesh.material = new THREE.MeshPhongMaterial({
    map: ctx.loadTexture(this.texture),
    side: THREE.DoubleSide
  });
  this.mesh.rotation.set(-Math.PI/2, 0, 0);

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
  this.spotlight.target = body._body;
  this.spotlightDistance = 25 * body.bodyRadius(ctx);

  this.mesh.receiveShadow = true;

  ctx.scene.add(this.spotlight);

  return this.mesh;
};
