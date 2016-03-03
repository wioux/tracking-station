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
  var family = [];

  var body = this;
  while (body) {
    family.push(body);
    body = body.orbit.body;
  }

  var descendants = this.satellites.slice(0);
  for (var i=0; i < descendants.length; ++i) {
    descendants[i].satellites.forEach(function(x) { descendants.push(x) });
    family.push(descendants[i]);
  }

  return family;
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

// Draw this body at `focus`, and its satellites.
Body.prototype.drawSystem = function(ctx, focus, jd, newGeometries) {
  this.shell = this.draw(ctx, focus);

  for (var body, pos, i=0; i < this.satellites.length; ++i) {
    body = this.satellites[i];
    body.selectEphemeris(jd);
    pos = body.drawOrbit(ctx, focus, newGeometries);
    body.drawSystem(ctx, pos, jd, newGeometries)
  }
};

Body.prototype.applyAxialTilt = function(ra, dec) {
  this.np = Equatorial.equinox();
  this.np.applyAxisAngle(Equatorial.pole(), Math.PI*ra/180.0)
  this.np.applyAxisAngle(this.np.clone().cross(Equatorial.NORTH), Math.PI*dec/180.0);

  // Default rotation leaves body pointing to <0, 1, 0>
  var q = new THREE.Quaternion().setFromUnitVectors(Ecliptic.SOLSTICE, this.np);
  this._body.rotation.setFromQuaternion(q);
};

// Private

// Compute geometry for this body's orbit around `focus`, and add it to `ctx.scene`.
// Return this body's position along its orbit
Body.prototype.drawOrbit = function(ctx, focus, newGeometries) {
  var orbit = this.orbit;
  var mja = orbit.mja, mna = orbit.mna;

  var peri = focus.clone().addScaledVector(mja,  ctx.auToPx * orbit.qr);
  var C    = focus.clone().addScaledVector(mja, -ctx.auToPx * (orbit.a - orbit.qr));

  var geometry = this.getOrbitGeometry(ctx, newGeometries);
  for (var p, th, i=0; i < geometry.vertices.length; ++i) {
    th = 2 * Math.PI * i / (geometry.vertices.length - 1);

    p = C.clone()
      .addScaledVector(mja, ctx.auToPx * orbit.a * Math.cos(th))
      .addScaledVector(mna, ctx.auToPx * orbit.b * Math.sin(th));

    geometry.vertices[i].copy(p);
  }

  geometry.verticesNeedUpdate = true;

  var pos = C.clone()
      .addScaledVector(mja, ctx.auToPx * orbit.a * Math.cos(Math.PI*orbit.ta/180.0))
      .addScaledVector(mna, ctx.auToPx * orbit.b * Math.sin(Math.PI*orbit.ta/180.0));

  return pos;
};

// Draw a sphere for this body, as well as a shell around it.
Body.prototype.draw = function(ctx, pos) {
  var body = this.getBodyGeometry(ctx);
  var shell = this.getShellGeometry(ctx);

  shell.position.set(pos.x, pos.y, pos.z);
  shell.userData.body = this;

  body.position.set(pos.x, pos.y, pos.z);
  body.userData.body = this;

  if (this.rings)
    this.rings.drawShadows(ctx, pos)

  if (this.sun)
    this.getLightSource(ctx).position.set(pos.x, pos.y, pos.z);

  return shell;
};

Body.prototype.getBodyGeometry = function(ctx) {
  if (!this._body) {
    this._body = new THREE.Mesh();
    this._body.up.set(0, 0, 1);

    if (this.texture) {
      this._texture = ctx.loadTexture(this.texture);
      this._body.material = new THREE.MeshLambertMaterial({
        map: this._texture,
        emissive: 0xffffff,
        emissiveMap: this._texture,
        emissiveIntensity: this.sun ? 1.0 : 0.15
      });
    } else {
      this._body.material = new THREE.MeshLambertMaterial({
        color: this.color,
        emissive: this.color,
        emissiveIntensity: 0.2
      });
    }

    this._body.geometry = new THREE.SphereGeometry(this.bodyRadius(ctx), 18, 18);

    if (this.npDEC)
      this.applyAxialTilt(this.npRA, this.npDEC);

    if (this.rings) {
      this._body.castShadow = true;
      this._body.add(this.rings.getRing(ctx, this));
    }

    ctx.scene.add(this._body);
  }
  return this._body;
};

Body.prototype.getShellGeometry = function(ctx) {
  if (!this._shell) {
    this._shell = new THREE.Mesh();
    this._shell.geometry = new THREE.SphereGeometry(this.shellRadius(ctx), 18, 18);
    this._shell.material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true
    });

    ctx.scene.add(this._shell);
  }
  return this._shell;
};

Body.prototype.getOrbitGeometry = function(ctx, newGeometries) {
  // Not yet sure why, but without recreating this._orbit
  // the orbit wouldn't render after SystemBrowser#centerCoordinates
  if (this._orbit && newGeometries)
    this._orbit.geometry.dispose();

  if (newGeometries || !this._orbit) {
    if (!this._orbit) {
      this._orbit = new THREE.Line();
      this._orbit.material = new THREE.LineBasicMaterial({
        color: this.color,
        linewidth: 2,
        transparent: true
      });

      ctx.scene.add(this._orbit);
    }

    this._orbit.geometry = new THREE.Geometry();
    for (var i=0; i <= 3*250; ++i)
      this._orbit.geometry.vertices.push(new THREE.Vector3());
  }

  return this._orbit.geometry;
};

Body.prototype.getLightSource = function(ctx) {
  if (!this._light) {
    this._light = new THREE.PointLight(0xffffff, 1.0, 0, 0);
    ctx.scene.add(this._light);
  }
  return this._light;
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
  var camDistanceAu = pos.distanceTo(this.shell.position) / ctx.auToPx;
  var newRadius = Math.tan(2 * Math.PI / 180.0) * camDistanceAu * ctx.auToPx / 2;

  this.shell.scale.set(newRadius/originalRadius,
                       newRadius/originalRadius,
                       newRadius/originalRadius);

  if (this.orbit.body) {
    camDistanceAu = pos.distanceTo(this.orbit.body.shell.position) / ctx.auToPx;

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
  this._shell.material.opacity = opacity;
  this._orbit && (this._orbit.material.opacity = opacity);
};

Body.prototype.setOrbitVisibility = function(visibility) {
  this._orbit && (this._orbit.material.visible = !!visibility);
};

Body.prototype.setBodyVisibility = function(visibility) {
  this._body.material.visible = !!visibility;
};

Body.prototype.setShellVisibility = function(visibility) {
  this._shell.material.visible = !!visibility;
};
