Orbit = function(body) {
  this.body = body;
  this.ephemerides = [];
};

Orbit.KM_PER_AU = 1.496e8;

Orbit.prototype.load = function(ephemeris) {
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
  var newEA = Orbit.solveEA(this.ec, newMA);

  var E = newEA * Math.PI / 180.0;
  var x = Math.sqrt(1 + this.ec)*Math.sin(E/2),
      y = Math.sqrt(1 - this.ec)*Math.cos(E/2);
  var newTA = (180.0 / Math.PI) * 2 * Math.atan2(x, y);

  this.ea = newEA; // save, for debugging
  this.ma = newMA;
  this.ta = newTA;
  this.jd = jd;
};

Orbit.prototype.updateObject3d = function(ctx, color) {
  if (!this.object3d)
    this.createOrbitObject(ctx, color);

  var mja = this.mja, mna = this.mna, geometry = this.object3d.geometry;
  var C   = mja.clone().multiplyScalar(-ctx.auToPx * (this.a - this.qr));

  if (this.lastPositionedEphemeris != this.ephemeris) {
    this.lastPositionedEphemeris = this.ephemeris;
    for (var p, th, i=0; i < geometry.vertices.length; ++i) {
      th = 2 * Math.PI * i / (geometry.vertices.length - 1);

      p = C.clone()
        .addScaledVector(mja, ctx.auToPx * this.a * Math.cos(th))
        .addScaledVector(mna, ctx.auToPx * this.b * Math.sin(th));

      this.object3d.geometry.vertices[i].copy(p);
    }

    this.object3d.geometry.verticesNeedUpdate = true;
  }

  var pos = this.body.object3d.position.clone().add(C)
      .addScaledVector(mja, ctx.auToPx * this.a * Math.cos(Math.PI*this.ta/180.0))
      .addScaledVector(mna, ctx.auToPx * this.b * Math.sin(Math.PI*this.ta/180.0));

  return pos;
};

// Private

Orbit.prototype.calculateAxisVectors = function() {
  var an = Ecliptic.equinox().applyAxisAngle(Ecliptic.NORTH, Math.PI*this.om/180.0);
  this.oa = Ecliptic.pole().applyAxisAngle(an, Math.PI*this.inc/180.0);

  this.mja = an.clone().applyAxisAngle(this.oa, Math.PI*this.w/180.0).normalize();

  this.mna = this.mja.clone().applyAxisAngle(this.oa, Math.PI/2).normalize();
};

Orbit.prototype.createOrbitObject = function(ctx, color) {
  if (!this.object3d) {
    this.object3d = new THREE.Line();
    this.object3d.material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: 2,
      transparent: true
    });

    this.object3d.geometry = new THREE.Geometry();
    for (var i=0; i <= 360; ++i)
      this.object3d.geometry.vertices.push(new THREE.Vector3());

    this.body.object3d.add(this.object3d);
  }
}

// Approximate eccentric anomaly from mean anomaly
// Using Newton's method on Kepler's equation
// Takes and returns units in degrees
Orbit.solveEA = function(ec, ma) {
  ma = ma * Math.PI / 180.0;

  var ea = (ec < 0.8) ? ma : Math.PI;
  var f = ea - ec*Math.sin(ma) - ma;
  for (var i=0; i < 50; ++i) {
    ea = ea - f/(1 - ec*Math.cos(ea));
    f = ea - ec*Math.sin(ma) - ma;
  }

  return 180.0 * ea / Math.PI;
};
