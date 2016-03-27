Orbit = function(satellite) {
  this.body = null;
  this.satellite = satellite;
  this.C = new THREE.Vector3();
  this.satellitePosition = new THREE.Vector3();
  this.oa = new THREE.Vector3();
  this.mja = new THREE.Vector3();
  this.mna = new THREE.Vector3();
};

Orbit.KM_PER_AU = 1.496e8;

Orbit.prototype.load = function(ctx, ephemeris) {
  if (ephemeris == this.ephemeris)
    return;

  this.ephemeris = ephemeris;

  // Eccentricity
  this.ec = parseFloat(ephemeris.ec);

  // Semi-major axis (au)
  this.a = parseFloat(ephemeris.a);

  // Periapsis distance (au)
  this.qr = parseFloat(ephemeris.qr);

  // Julian day (epoch)
  this.jd = parseFloat(ephemeris.jd);

  // True anomaly (DEG) (realtime)
  this.ta = parseFloat(ephemeris.ta);

  // Apoapsis distance (au)
  this.ad = parseFloat(ephemeris.ad);

  // Inclination of orbit plane (DEG) wrt ecliptic
  this.inc = parseFloat(ephemeris.inc);

  // Longitude of Ascending Node (DEG) wrt ecliptic/equinox
  this.om = parseFloat(ephemeris.om);

  // Argument of Periapsis (DEG) wrt ecliptic/equinox
  this.w = parseFloat(ephemeris.w);

  // Mean anomaly (DEG) at epoch
  this.ma = parseFloat(ephemeris.ma);

  // Mean motion (DEG/DAY)
  this.n = parseFloat(ephemeris.n);

  // Perihelion Julian Date
  this.tp = parseFloat(ephemeris.tp);

  // Semi-minor axis (au)
  // this.b = parseFloat(ephemeris.b);

  this.calculateAxisVectors(ctx);
};

// Update mean/true anomaly to Julian Day
Orbit.prototype.update = function(jd) {
  var newMA = this.ma + this.n * (jd - this.jd);
  while (this.ec < 1 && newMA > 360)
    newMA -= 360;

  var newEA = this.ec < 1 ? Orbit.solveEA(this.ec, newMA)
                          : Orbit.solveEAHyperbolic(this.ec, newMA);

  while (newEA < 0)
    newEA += 360.0;
  while (newEA > 360.0)
    newEA - 360.0;

  var newTA = this.ec < 1 ? Orbit.getTrueAnomaly(this.ec, newEA)
                          : Orbit.getTrueHyperbolicAnomaly(this.ec, newEA);

  while (newTA < 0)
    newTA += 360;

  this.ta = newTA;
};

Orbit.prototype.updateObject3d = function(ctx) {
  if (!this.body)
    return;

  if (this.object3d.parent != this.body.object3d) {
    this.object3d.parent && this.object3d.parent.remove(this.object3d);
    this.body.object3d.add(this.object3d);
  }

  if (this.lastPositionedEphemeris != this.ephemeris) {
    this.lastPositionedEphemeris = this.ephemeris;

    if (this.ec < 1)
      this.positionEllipticalGeometry(ctx);
    else
      this.positionHyperbolicGeometry(ctx);
  }

  if (this.ec < 1)
    return this.setSatellitePositionOnEllipse(ctx);
  else
    return this.setSatellitePositionOnHyperbola(ctx);
};

// Private

Orbit.prototype.calculateAxisVectors = function() {
  var an = new THREE.Vector3();
  return function(ctx) {
    an.copy(Ecliptic.EQUINOX).applyAxisAngle(Ecliptic.NORTH, Math.PI*this.om/180.0);

    this.oa.copy(Ecliptic.NORTH).applyAxisAngle(an, Math.PI*this.inc/180.0);

    this.mja.copy(an).applyAxisAngle(this.oa, Math.PI*this.w/180.0).normalize();

    this.mna.copy(this.mja).applyAxisAngle(this.oa, Math.PI/2).normalize();

    if (this.ec < 1)
      this.C.copy(this.mja).multiplyScalar(-ctx.auToPx * (this.a - this.qr));
    else
      this.C.copy(this.mja).multiplyScalar(ctx.auToPx * (Math.abs(this.a) + this.qr));
  };
}();

Orbit.prototype.createObject3d = function(ctx, color) {
  this.object3d = new THREE.Line();
  this.object3d.material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 2,
    transparent: true
  });

  this.object3d.geometry = new THREE.Geometry();

  for (var i=0; i <= 720; ++i)
    this.object3d.geometry.vertices.push(new THREE.Vector3());

  this.body && this.body.object3d.add(this.object3d);
}

Orbit.prototype.positionEllipticalGeometry = function(ctx) {
  var a = this.a,
      b = a * Math.sqrt(1.0 - Math.max(0, this.ec*this.ec)),
      mja = this.mja,
      mna = this.mna,
      geometry = this.object3d.geometry;
  for (var p, th, i=0; i < geometry.vertices.length; ++i) {
    th = 2 * Math.PI * i / (geometry.vertices.length - 1);

    geometry.vertices[i].copy(this.C)
      .addScaledVector(mja, ctx.auToPx * a * Math.cos(th))
      .addScaledVector(mna, ctx.auToPx * b * Math.sin(th));
  }
  geometry.verticesNeedUpdate = true;
};

Orbit.prototype.positionHyperbolicGeometry = function(ctx) {
  var a = this.a,
      c = Math.abs(a) + this.qr,
      b = Math.sqrt(c*c - a*a),
      mja = this.mja,
      mna = this.mna,
      geometry = this.object3d.geometry;
  for (var p, th, i=0; i < geometry.vertices.length; ++i) {
    th = 2 * Math.PI * i / (geometry.vertices.length - 1) - Math.PI;

    geometry.vertices[i].copy(this.C)
      .addScaledVector(mja, ctx.auToPx * a * Math.cosh(th))
      .addScaledVector(mna, ctx.auToPx * b * Math.sinh(th));
  }
  geometry.verticesNeedUpdate = true;
};

Orbit.prototype.setSatellitePositionOnEllipse = function(ctx) {
  var r = this.a*(1-this.ec*this.ec)/(1+this.ec*Math.cos(Math.PI*this.ta/180.0));
  this.satellitePosition
    .copy(this.mja).applyAxisAngle(this.oa, Math.PI*this.ta / 180.0)
    .setLength(ctx.auToPx * r)
    .add(this.body.object3d.position);
};

Orbit.prototype.setSatellitePositionOnHyperbola = function(ctx) {
  var r = -this.a*(this.ec*this.ec - 1.0) /
      (1.0 - this.ec*Math.cos(Math.PI*(180 - this.ta) / 180.0));
  this.satellitePosition
    .copy(this.mja).applyAxisAngle(this.oa, Math.PI*this.ta / 180.0)
    .setLength(ctx.auToPx * r)
    .add(this.body.object3d.position);
};

Orbit.getTrueAnomaly = function(ec, ea) {
  var E = Math.PI * ea / 180.0;
  var x = Math.sqrt(1 + ec)*Math.sin(E/2);
  var y = Math.sqrt(1 - ec)*Math.cos(E/2);
  return (180.0 / Math.PI) * 2 * Math.atan2(x, y);
};

Orbit.getTrueHyperbolicAnomaly = function(ec, ea) {
  var th, q, E = Math.PI * ea / 180.0;
  th = Math.acos((ec - Math.cosh(E)) / (ec * Math.cosh(E) - 1));
  th = ea == 0 ? 0 : ea < 180.0 ? th : -th;
  return (180.0 / Math.PI) * th;
};

// Approximate eccentric anomaly from mean anomaly
// Using Newton's method on Kepler's equation
// Takes and returns units in degrees
Orbit.solveEA = function(ec, ma) {
  ma = ma * Math.PI / 180.0;

  var ea = (ec < 0.8) ? ma : Math.PI;
  var f = ea - ec*Math.sin(ea) - ma;
  for (var i=0; i < 50; ++i) {
    ea = ea - f/(1 - ec*Math.cos(ea));
    f = ea - ec*Math.sin(ea) - ma;
  }

  return 180.0 * ea / Math.PI;
};

Orbit.solveEAHyperbolic = function(ec, ma) {
  ma = ma * Math.PI / 180.0;

  var ea = ma;
  var f = ec * Math.sinh(ea) - ea - ma;
  for (var i=0; i < 50; ++i) {
    ea = ea - f/(ec*Math.cosh(ea) - 1);
    f = ec * Math.sinh(ea) - ea - ma;
  }

  return 180.0 * ea / Math.PI;
};
