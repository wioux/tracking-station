
OrbitIndicator = function(orbit) {
  this.orbit = orbit;
};

OrbitIndicator.prototype.createObject3d = function(ctx, color) {
  this.object3d = new THREE.Line();
  this.object3d.material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 2,
    transparent: true
  });

  this.object3d.geometry = new THREE.Geometry();

  for (var i=0; i <= 720; ++i)
    this.object3d.geometry.vertices.push(new THREE.Vector3());

  this.orbit.body && this.orbit.body.object3d.add(this.object3d);
};

OrbitIndicator.prototype.updateObject3d = function(ctx) {
  if (!this.orbit.body)
    return;

  if (this.object3d.parent != this.orbit.body.object3d) {
    this.object3d.parent && this.object3d.parent.remove(this.object3d);
    this.orbit.body.object3d.add(this.object3d);
  }

  if (this.ephemeris != this.orbit.ephemeris) {
    this.ephemeris = this.orbit.ephemeris;

    if (this.orbit.ec < 1)
      this.positionEllipticalGeometry();
    else
      this.positionHyperbolicGeometry();
  }
};

OrbitIndicator.prototype.setFade = function(fade) {
  if (fade) {
    this.object3d.material.opacity += (fade < 0 ? -0.01 : 0.01);
    this.object3d.material.opacity = Math.min(0.5, this.object3d.material.opacity);
    this.object3d.material.opacity = Math.max(0, this.object3d.material.opacity);
  } else {
    this.object3d.material.opacity = 0.5;
  }

  if (this.object3d.visible)
    this.object3d.visible = (this.object3d.material.opacity > 0.05);
};

OrbitIndicator.prototype.setVisibility = function(visibility) {
  this.object3d && (this.object3d.visible = visibility);
};

// private

OrbitIndicator.prototype.positionHyperbolicGeometry = function() {
  var a = this.orbit.a,
      c = Math.abs(a) + this.orbit.qr,
      b = Math.sqrt(c*c - a*a),
      mja = this.orbit.mja,
      mna = this.orbit.mna,
      geometry = this.object3d.geometry,
      scale = SystemBrowser.SCALE;
  for (var p, th, i=0; i < geometry.vertices.length; ++i) {
    th = 2 * Math.PI * i / (geometry.vertices.length - 1) - Math.PI;

    geometry.vertices[i].copy(this.orbit.C)
      .addScaledVector(mja, scale * a * Math.cosh(th))
      .addScaledVector(mna, scale * b * Math.sinh(th));
  }
  geometry.verticesNeedUpdate = true;
};

OrbitIndicator.prototype.positionEllipticalGeometry = function() {
  var a = this.orbit.a,
      b = a * Math.sqrt(1.0 - Math.max(0, this.orbit.ec*this.orbit.ec)),
      mja = this.orbit.mja,
      mna = this.orbit.mna,
      geometry = this.object3d.geometry,
      scale = SystemBrowser.SCALE;
  for (var p, th, i=0; i < geometry.vertices.length; ++i) {
    th = 2 * Math.PI * i / (geometry.vertices.length - 1);

    geometry.vertices[i].copy(this.orbit.C)
      .addScaledVector(mja, scale * a * Math.cos(th))
      .addScaledVector(mna, scale * b * Math.sin(th));
  }
  geometry.verticesNeedUpdate = true;
};
