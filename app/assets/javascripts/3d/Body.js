
Body = function(name, attrs) {
  this.id = name;
  this.name = name;
  this.color = 'gray';

  this.ephemerides = [];
  this.orbit = new Orbit(this);

  this.radiusKm = 0.002;
  this.spacecraft = false;

  // Local system (moons, spacecraft, etc)
  this.satellites = [];

  this.flags = 0x00;

  for (var key in attrs)
    this[key] = attrs[key];
};

Body.HIDDEN    = 0x01;
Body.FADED     = 0x02;
Body.INVALID   = 0x04;

Body.prototype.addEphemerides = function(list) {
  for (var i=0; i < list.length; ++i)
    this.ephemerides.push(list[i]);
};

Body.prototype.selectEphemeris = function(jd) {
  var mid, low = 0, high = this.ephemerides.length;
  while (low != high) {
    mid = Math.floor((low + high) / 2);
    if (this.ephemerides[mid].jd <= jd)
      low = mid + 1;
    else
      high = mid;
  }

  if (low > 0) {
    this.orbit.load(this.ephemerides[low-1]);
    this.orbit.update(jd);
  }

  return low > 0 && this.ephemerides[low-1];
};

Body.prototype.addSatellite = function(satellite) {
  if (this.satellites.indexOf(satellite) != -1)
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
  this.orbit.updateObject3d(ctx)

  if (this == ctx.root)
    this.object3d.position.copy(position);
  else
    this.object3d.position.copy(this.orbit.satellitePosition);

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
  this.object3d = new THREE.Object3D();
  this.object3d.userData.body = this;
  ctx.scene.add(this.object3d);

  this.createBodyObject(ctx);
  this.createIndicatorObject(ctx);

  this.orbit.createObject3d(ctx, this.color);

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
      new THREE.SphereGeometry(this.bodyRadius(ctx), parts, parts)
    );

  this.object3d.add(this.object3d.body);
};

Body.prototype.createIndicatorObject = function(ctx) {
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

  // specific to Sun / /lensflare0_alpha_centered.png
  var scale = ctx.auToPx/6.7;
  this.object3d.sunlight.flare.scale.set(scale, scale, scale);
  this.object3d.add(this.object3d.sunlight.flare);
  this.object3d.add(this.object3d.sunlight);
};

Body.prototype.bodyRadius = function(ctx) {
  return this.radiusKm / Orbit.KM_PER_AU * ctx.auToPx;
};

Body.prototype.shellRadius = function(ctx) {
//  return Math.tan(2 * Math.PI / 180.0) * ctx.auToPx;
  return Math.tan(1 * Math.PI / 180.0) * ctx.auToPx;
};

Body.prototype.scaleIndicator = function(ctx, pos, arc) {
  var originalRadius = this.shellRadius(ctx);
  var camDistanceAu = pos.distanceTo(this.object3d.position) / ctx.auToPx;
  var newRadius = Math.tan(arc * Math.PI / 180.0) * camDistanceAu * ctx.auToPx;

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
  this.setIndicatorVisibility(visibility);
};

Body.prototype.setOpacity = function(opacity) {
  this.setOrbitOpacity(opacity);
  this.setIndicatorOpacity(opacity);
};

Body.prototype.setOrbitOpacity = function(opacity) {
  this.orbit.object3d && (this.orbit.object3d.material.opacity = opacity);
};

Body.prototype.setIndicatorOpacity = function(opacity) {
  this.object3d.indicator.material.opacity = opacity;
};

Body.prototype.setOrbitVisibility = function(visibility) {
  this.orbit.object3d && (this.orbit.object3d.visible = !!visibility);
};

Body.prototype.setBodyVisibility = function(visibility) {
  this.object3d.body.visible = !!visibility;
};

Body.prototype.setIndicatorVisibility = function(visibility) {
  this.object3d.indicator.visible = !!visibility;
};
