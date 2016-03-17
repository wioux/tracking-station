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

Orbit.prototype.load = function(ephemeris) {
  if (ephemeris == this.ephemeris)
    return;

  this.ephemeris = ephemeris;

  // Eccentricity
  this.ec = parseFloat(ephemeris.ec);

  // Semi-major axis (au)
  this.a = parseFloat(ephemeris.a);

  // Semi-minor axis (au) (act like orbit is elliptical even if it isn't)
  this.b = this.a * Math.sqrt(1.0 - Math.max(0, this.ec*this.ec));

  // Periapsis distance (au)
  this.qr = parseFloat(ephemeris.qr);

  // Julian day
  this.jd = parseFloat(ephemeris.jd);

  // True anomaly (DEG) at epoch
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

  this.calculateAxisVectors();
};

// Update mean/true anomaly to Julian Day
Orbit.prototype.update = function(jd) {
  var newMA = this.ma + this.n * (jd - this.jd);
  while (newMA > 360)
    newMA -= 360;

  var newEA = Orbit.solveEA(this.ec, newMA);

  var E = newEA * Math.PI / 180.0;
  var x = Math.sqrt(1 + this.ec)*Math.sin(E/2),
      y = Math.sqrt(1 - this.ec)*Math.cos(E/2);
  var newTA = (180.0 / Math.PI) * 2 * Math.atan2(x, y);
  while (newTA < 0)
    newTA += 360;

  this.ea = newEA; // save, for debugging
  this.ma = newMA;
  this.ta = newTA;
  this.jd = jd;
};

Orbit.prototype.updateObject3d = function(ctx) {
  if (!this.body)
    return;

  if (this.object3d.parent != this.body.object3d) {
    this.object3d.parent && this.object3d.parent.remove(this.object3d);
    this.body.object3d.add(this.object3d);
  }

  var mja = this.mja, mna = this.mna, geometry = this.object3d.geometry;
  var C   = this.C.copy(mja).multiplyScalar(-ctx.auToPx * (this.a - this.qr));

  if (this.lastPositionedEphemeris != this.ephemeris) {
    this.lastPositionedEphemeris = this.ephemeris;
    for (var p, th, i=0; i < geometry.vertices.length; ++i) {
      th = 2 * Math.PI * i / (geometry.vertices.length - 1);

      this.object3d.geometry.vertices[i].copy(C)
        .addScaledVector(mja, ctx.auToPx * this.a * Math.cos(th))
        .addScaledVector(mna, ctx.auToPx * this.b * Math.sin(th));
    }

    this.object3d.geometry.verticesNeedUpdate = true;
  }

  var r = this.a*(1-this.ec*this.ec)/(1+this.ec*Math.cos(Math.PI*this.ta/180.0));
  this.satellitePosition
    .copy(mja).applyAxisAngle(this.oa, Math.PI * this.ta / 180.0)
    .setLength(ctx.auToPx * r)
    .add(this.body.object3d.position);
};

// Private

Orbit.prototype.calculateAxisVectors = function() {
  var an = new THREE.Vector3();
  return function() {
    an.copy(Ecliptic.EQUINOX).applyAxisAngle(Ecliptic.NORTH, Math.PI*this.om/180.0);

    this.oa.copy(Ecliptic.NORTH).applyAxisAngle(an, Math.PI*this.inc/180.0);

    this.mja.copy(an).applyAxisAngle(this.oa, Math.PI*this.w/180.0).normalize();

    this.mna.copy(this.mja).applyAxisAngle(this.oa, Math.PI/2).normalize();
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
