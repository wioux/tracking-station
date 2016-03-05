// lift .selectEphemeris calls
// lift scaleShell / rename
// lose the "draw" terminology

Body = function(name, orbitElements) {
  this.id = name;
  this.name = name;
  this.color = 'gray';

  this.ephemerides = [];
  this.orbit = new Orbit();
  for (var key in (orbitElements || {}))
    this.orbit[key] = orbitElements[key];

  this.radiusKm = 0.002;
  this.spacecraft = false;

  // Local system (moons, spacecraft, etc)
  this.satellites = [];

  this.flags = 0x00;
};

Body.HIDDEN    = 0x01;
Body.FADED     = 0x02;

Body.prototype.addEphemerides = function(list) {
  for (var i=0; i < list.length; ++i)
    this.ephemerides.push(list[i]);
};

Body.prototype.selectEphemeris = function(jd) {
  var eph = null;
  for (var i=0; i < this.ephemerides.length; ++i) {
    if (this.ephemerides[i].jd > jd)
      break;
    eph = this.ephemerides[i];
  }

  if (!eph)
    throw "No ephemeris for "+this.name+" on jd " + jd;

  this.orbit.load(eph);
  this.orbit.update(jd);
};

Body.prototype.addSatellite = function(satellite) {
  satellite.orbit.body = this;
  this.satellites.push(satellite);
  return satellite;
};

// This body, its ancestors, and its descendants (in no particular order)
Body.prototype.family = function() {
  if (this.cachedFamily)
    return this.cachedFamily;

  this.cachedFamily = [];

  var body = this;
  while (body) {
    this.cachedFamily.push(body);
    body = body.orbit.body;
  }

  var descendants = this.satellites.slice(0);
  for (var i=0; i < descendants.length; ++i) {
    descendants[i].satellites.forEach(function(x) { descendants.push(x) });
    this.cachedFamily.push(descendants[i]);
  }

  return this.cachedFamily;
};

Body.prototype.show = function() {
  this.flags &= ~Body.HIDDEN;
};

Body.prototype.hide = function() {
  this.flags |= Body.HIDDEN;
};

Body.prototype.highlight = function() {
  this.highlighted = true;
};

Body.prototype.unhighlight = function() {
  var wasHighlighted = this.highlighted;
  this.highlighted = false;
  return wasHighlighted;
};

Body.prototype.updateObject3d = function(ctx, jd, position) {
  if (this != ctx.root)
    this.selectEphemeris(ctx.jd);

  if (!this.object3d) {
    this.object3d = new THREE.Object3D();
    this.object3d.userData.body = this;
    ctx.scene.add(this.object3d);

    this.createBodyObject(ctx);
    this.createIndicatorObject(ctx);

    this.sun && this.createSunLightObject(ctx);
  }

  if (this == ctx.root)
    this.object3d.position.copy(position);
  else
    this.object3d.position.copy(
      this.orbit.updateObject3d(ctx, this.color)
    );

  this.rings && this.rings.updateObject3d(ctx, this);

  if (this.npDEC)
    this.applyAxialTilt(this.npRA, this.npDEC);

  for (var i=0; i < this.satellites.length; ++i)
    this.satellites[i].updateObject3d(ctx, jd);
};

Body.prototype.applyAxialTilt = function() {
  var raP = new THREE.Vector3();
  var np = new THREE.Vector3();
  var q = new THREE.Quaternion();

  return function(ra, dec) {
    raP.copy(Equatorial.EQUINOX);
    raP.applyAxisAngle(Equatorial.NORTH, Math.PI*ra/180.0)
    np.copy(raP).applyAxisAngle(raP.cross(Equatorial.NORTH), Math.PI*dec/180.0);

    // Default sphere rotation leaves body pointing to <0, 1, 0>
    q.setFromUnitVectors(Ecliptic.SOLSTICE, np);
    this.object3d.body.rotation.setFromQuaternion(q);

    // Default ring rotation leaves them pointing to <0, 0, 1>
    if (this.rings) {
      q.setFromUnitVectors(Ecliptic.NORTH, np);
      this.rings.object3d.rotation.setFromQuaternion(q);
    }
  };
}();

// Private

Body.prototype.createBodyObject = function(ctx) {
  if (!this.object3d.body) {
    this.object3d.body = new THREE.Mesh();
    this.object3d.body.userData.body = this;
    this.object3d.body.up.set(0, 0, 1);

    if (this.texture) {
      this.object3d.texture = ctx.loadTexture(this.texture);
      this.object3d.body.material = new THREE.MeshLambertMaterial({
        map: this.object3d.texture,
        emissive: 0xffffff,
        emissiveMap: this.object3d.texture,
        emissiveIntensity: this.sun ? 1.0 : 0.15
      });
    } else {
      this.object3d.body.material = new THREE.MeshLambertMaterial({
        color: this.color,
        emissive: this.color,
        emissiveIntensity: 0.2
      });
    }

    var parts = this.texture ? 50 : 8;
    this.object3d.body.geometry =
      new THREE.BufferGeometry().fromGeometry(
        new THREE.SphereGeometry(this.bodyRadius(ctx), parts, parts)
      );

    this.object3d.add(this.object3d.body);
  }
};

Body.prototype.createIndicatorObject = function(ctx) {
  if (!this.object3d.indicator) {
    if (this.sprite)
      this.object3d.indicator = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: ctx.loadTexture(this.sprite) })
      );
    else
      this.object3d.indicator = new THREE.Mesh(
        new THREE.BufferGeometry().fromGeometry(
          new THREE.SphereGeometry(this.shellRadius(ctx), 18, 18)
        ),
        new THREE.MeshBasicMaterial({
          color: this.color,
          transparent: true
        })
      );
    this.object3d.indicator.userData.body = this;
    this.object3d.add(this.object3d.indicator);
  }
};

Body.prototype.createRingsObject = function(ctx) {
  if (!this.object3d.rings) {
    this.object3d.rings = this.rings.createRingsObject(ctx, this);
    this.object3d.add(this.object3d.rings);
  }
};

Body.prototype.createSunLightObject = function(ctx) {
  if (!this.object3d.sunlight) {
    this.object3d.sunlight = new THREE.PointLight(0xffffff, 1.0, 0, 0);
    this.object3d.add(this.object3d.sunlight);
  }
};

Body.prototype.bodyRadius = function(ctx) {
  return this.radiusKm / Orbit.KM_PER_AU * ctx.auToPx;
};

Body.prototype.shellRadius = function(ctx) {
//  return Math.tan(2 * Math.PI / 180.0) * ctx.auToPx;
  return Math.tan(1 * Math.PI / 180.0) * ctx.auToPx;
};

Body.prototype.scaleShell = function(ctx, pos) {
  var originalRadius = this.shellRadius(ctx);
  var camDistanceAu = pos.distanceTo(this.object3d.position) / ctx.auToPx;
  var newRadius = Math.tan(2 * Math.PI / 180.0) * camDistanceAu * ctx.auToPx / 2;

  var m = this.sprite ? 60 : 1;
  this.object3d.indicator.scale.set(m*newRadius/originalRadius,
                                    m*newRadius/originalRadius,
                                    m*newRadius/originalRadius);

  if (this.orbit.body) {
    camDistanceAu = pos.distanceTo(this.orbit.body.object3d.position) / ctx.auToPx;

    if (Math.atan(this.orbit.a / camDistanceAu) < 0.035)
      this.flags |= Body.FADED;
    else
      this.flags &= ~Body.FADED;
  }

  return newRadius / this.bodyRadius(ctx);
};

Body.prototype.setVisibility = function(visibility) {
  this.setOrbitVisibility(visibility);
  this.setBodyVisibility(visibility);
  this.setShellVisibility(visibility);
};

Body.prototype.setOpacity = function(opacity) {
  this.object3d.indicator.material.opacity = opacity;
  this.orbit.object3d && (this.orbit.object3d.material.opacity = opacity);
};

Body.prototype.setOrbitVisibility = function(visibility) {
  this.orbit.object3d && (this.orbit.object3d.visible = !!visibility);
};

Body.prototype.setBodyVisibility = function(visibility) {
  this.object3d.body.visible = !!visibility;
};

Body.prototype.setShellVisibility = function(visibility) {
  this.object3d.indicator.visible = !!visibility;
};
