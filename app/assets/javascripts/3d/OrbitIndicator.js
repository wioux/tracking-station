
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
  var ec = this.orbit.ec,
      a = this.orbit.a,
      oa = this.orbit.oa,
      mja = this.orbit.mja,
      geometry = this.object3d.geometry,
      scale = SystemBrowser.SCALE;

  for (var ta, r, i=0; i < geometry.vertices.length; ++i) {
    ta = 180.0 * i / (geometry.vertices.length - 1) - 90.0;

    r = -a*(ec*ec - 1.0) /
        (1.0 - ec*Math.cos(Math.PI*(180.0 - ta) / 180.0));

    geometry.vertices[i]
      .copy(mja)
      .applyAxisAngle(oa,  Math.PI*ta/180.0)
      .setLength(scale * r);
  }

  geometry.verticesNeedUpdate = true;
};

OrbitIndicator.prototype.positionEllipticalGeometry = function() {
  var ec = this.orbit.ec,
      a = this.orbit.a,
      oa = this.orbit.oa,
      mja = this.orbit.mja,
      geometry = this.object3d.geometry,
      scale = SystemBrowser.SCALE;

  for (var ta, r, i=0; i < geometry.vertices.length; ++i) {
    ta = 360.0 * i / (geometry.vertices.length - 1);

    r = a*(1-ec*ec)/(1+ec*Math.cos(Math.PI*ta/180.0));

    geometry.vertices[i]
      .copy(mja)
      .applyAxisAngle(oa, Math.PI*ta/180.0)
      .setLength(scale * r);
  }

  geometry.verticesNeedUpdate = true;
};
