Orbit = function(body) {
  this.body = body;
  this.ephemerides = [];
};

Orbit.KM_PER_AU = 1.496e8;

Orbit.prototype.load = function(ephemeris) {
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

// Private
Orbit.ecliptic = {
  solstice: function(size) {
    return new THREE.Vector3(0, 1, 0);
  },

  equinox: function(size) {
    return new THREE.Vector3(size || 1, 0, 0);
  },

  pole: function(size) {
    return new THREE.Vector3(0, 0, size || 1);
  },

  obliquity: 23.4
};

Orbit.equatorial = {
  equinox: function(size) {
    var c = Math.cos(-Math.PI * Orbit.ecliptic.obliquity / 180.0),
        s = Math.sin(-Math.PI * Orbit.ecliptic.obliquity / 180.0);
    var m = new THREE.Matrix3()
        .set(1, 0, 0,
             0, c, -s,
             0, s, c);
    return Orbit.ecliptic.equinox(size).applyMatrix3(m);
  },

  pole: function(size) {
    // Why did I have to negate the obliquity? ...
    var c = Math.cos(-Math.PI * Orbit.ecliptic.obliquity / 180.0),
        s = Math.sin(-Math.PI * Orbit.ecliptic.obliquity / 180.0);
    var m = new THREE.Matrix3()
        .set(1, 0, 0,
             0, c, -s,
             0, s, c);
    return Orbit.ecliptic.pole(size).applyMatrix3(m);
  }
};

Orbit.ecliptic.NORTH = Orbit.ecliptic.pole(1);
Orbit.ecliptic.EQUINOX = Orbit.ecliptic.equinox(1);
Orbit.ecliptic.SOLSTICE = Orbit.ecliptic.solstice(1);

Orbit.equatorial.NORTH = Orbit.equatorial.pole(1);
Orbit.equatorial.EQUINOX = Orbit.equatorial.equinox(1);

Orbit.prototype.calculateAxisVectors = function() {
  // ascending node. this puts vernal at <1, 0, 0>
  var an = Orbit.ecliptic.equinox()
      .applyAxisAngle(Orbit.ecliptic.NORTH, Math.PI*this.om/180.0);

  this.oa = Orbit.ecliptic.pole().applyAxisAngle(an, Math.PI*this.inc/180.0);

  this.mja =
    an.clone().applyAxisAngle(this.oa, Math.PI*this.w/180.0).normalize();

  this.mna =
    this.mja.clone().applyAxisAngle(this.oa, Math.PI/2).normalize();
};

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
