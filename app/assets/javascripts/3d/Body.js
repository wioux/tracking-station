
Body = function(name, attrs) {
  this.id = name;
  this.name = name;
  this.color = 'gray';

  this.ephemerides = new Ephemerides(this);
  this.orbit = new Orbit(this);

  this.radiusKm = 0.002;
  this.spacecraft = false;

  // Local system (moons, spacecraft, etc)
  this.satellites = [];

  this.flags = 0x00;

  for (var key in attrs)
    this[key] = attrs[key];

  this.indicator = new BodyIndicator(this);
};

Body.HIDDEN        = 0x01;
Body.COLLAPSED     = 0x02;
Body.INVALID       = 0x04;

Body.prototype.addSatellite = function(satellite) {
  if (satellite.orbit.body == this)
    return;

  if (satellite.orbit.body)
    satellite.orbit.body.removeSatellite(satellite);

  var parent = this;
  while (parent) {
    parent.localSystemCache = null;
    parent = parent.orbit.body;
  }

  satellite.orbit.body = this;
  this.satellites.push(satellite);

  return satellite;
};

Body.prototype.removeSatellite = function(satellite) {
  var i = this.satellites.indexOf(satellite);
  if (i != -1) {
    this.satellites.splice(i, 1);

    var parent = this;
    while (parent) {
      parent.localSystemCache = null;
      parent = parent.orbit.body;
    }

    satellite.orbit.body = null;
  }
};

Body.prototype.descendants = function() {
  var descendants = [];
  var satellites = this.satellites.slice(0);
  for (var i=0; i < satellites.length; ++i) {
    satellites[i].satellites.forEach(function(x) { satellites.push(x) });
    descendants.push(satellites[i]);
  }
  return descendants;
};

Body.prototype.localSystem = function() {
  if (this.localSystemCache)
    return this.localSystemCache;

  var root = this;
  while (!root.major && root.orbit.body)
    root = root.orbit.body;

  this.localSystemCache = root.descendants();
  return this.localSystemCache;
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

Body.prototype.updateObject3d = function(ctx, position) {
  this.orbit.indicator.updateObject3d(ctx)

  if (this == ctx.root) {
    this.object3d.position.copy(position);
  } else {
    this.object3d.position
      .copy(this.orbit.satellitePosition)
      .multiplyScalar(SystemBrowser.SCALE)
      .add(this.orbit.body.object3d.position);
  }

  this.rings && this.rings.updateObject3d(ctx, this);

  if (this.npDEC)
    this.applyAxialTilt(this.npRA, this.npDEC);

  for (var i=0; i < this.satellites.length; ++i)
    this.satellites[i].updateObject3d(ctx);
};

Body.prototype.applyAxialTilt = function() {
  var np = new THREE.Vector3();
  var q = new THREE.Quaternion();

  return function(ra, dec) {
    Coord.equ(np, ra, dec);

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

Body.prototype.createObject3d = function(ctx) {
  this.radius3d = SystemBrowser.SCALE * this.radiusKm / Orbit.KM_PER_AU;

  this.object3d = new THREE.Object3D();
  this.object3d.userData.body = this;
  ctx.scene.add(this.object3d);

  this.createBodyObject(ctx);
  this.indicator.createObject3d(ctx);
  this.orbit.indicator.createObject3d(ctx, this.color);

  this.sun && this.createSunLightObject(ctx);
  this.rings && this.rings.createObject3d(ctx, this);
}


Body.prototype.createBodyObject = function(ctx) {
  this.object3d.body = new THREE.Mesh();
  this.object3d.body.userData.body = this;
  this.object3d.body.up.set(0, 0, 1);

  var props = {};
  if (this.texture) {
    props.map = ctx.loadTexture(this.texture);
    if (this.sun) {
      props.emissive = 0xffffff;
      props.emissiveMap = props.map;
      props.emissiveIntensity = 1.0;
    }
  } else {
    props.color = this.color;
    if (this.sun) {
      props.emissive = this.color;
      props.emissiveIntensity = 1.0;
    }
  }
  this.object3d.body.material = new THREE.MeshLambertMaterial(props);

  var parts = this.texture ? 50 : 8;
  this.object3d.body.geometry =
    new THREE.BufferGeometry().fromGeometry(
      new THREE.SphereGeometry(this.radius3d, parts, parts)
    );

  this.object3d.add(this.object3d.body);
};

Body.prototype.createSunLightObject = function(ctx) {
  this.object3d.sunlight = new THREE.PointLight(0xffffff, 1.0, 0, 0);
  this.object3d.sunlight.flare = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: ctx.loadTexture("/assets/lensflare0_alpha_centered.png"),
      transparent: true,
      opacity: 0.7
    })
  );
  this.object3d.sunlight.flare.userData = { body: this };

  // specific to Sun / /lensflare0_alpha_centered.png
  var scale = SystemBrowser.SCALE / 6.7;
  this.object3d.sunlight.flare.scale.set(scale, scale, scale);
  this.object3d.add(this.object3d.sunlight.flare);
  this.object3d.add(this.object3d.sunlight);
};

// Collapse this body if its orbital radius, when
// viewed from above at pos, is less than min degrees
Body.prototype.setCollapseThreshold = function(pos, min) {
  if (this.orbit.body) {
    var scale = SystemBrowser.SCALE;
    var camDistanceAu = pos.distanceTo(this.orbit.body.object3d.position) / scale;
    var rAu = Math.abs(this.orbit.a);
    if (180.0*Math.atan(rAu / camDistanceAu)/Math.PI < min)
      this.flags |= Body.COLLAPSED;
    else
      this.flags &= ~Body.COLLAPSED;
  }
};

Body.prototype.setVisibility = function(visibility) {
  this.orbit.indicator.setVisibility(visibility);
  this.indicator.setVisibility(visibility);
  this.object3d.visibile = visibility;
};
