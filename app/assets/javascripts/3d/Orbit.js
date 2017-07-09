Orbit = function(satellite) {
  this.body = null;
  this.satellite = satellite;
  this.satellitePosition = new THREE.Vector3();
  this.oa = new THREE.Vector3();
  this.mja = new THREE.Vector3();

  this.indicator = new OrbitIndicator(this);
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

  this.calculateAxisVectors();
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

  if (this.ec < 1)
    this.setSatellitePositionOnEllipse();
  else
    this.setSatellitePositionOnHyperbola();
};

// Private

Orbit.prototype.calculateAxisVectors = function() {
  var an = new THREE.Vector3();
  return function() {
    an.copy(Ecliptic.EQUINOX).applyAxisAngle(Ecliptic.NORTH, Math.PI*this.om/180.0);

    this.oa.copy(Ecliptic.NORTH).applyAxisAngle(an, Math.PI*this.inc/180.0);

    this.mja.copy(an).applyAxisAngle(this.oa, Math.PI*this.w/180.0).normalize();
  };
}();

Orbit.prototype.setSatellitePositionOnEllipse = function() {
  var r = this.a*(1-this.ec*this.ec)/(1+this.ec*Math.cos(Math.PI*this.ta/180.0));
  this.satellitePosition
    .copy(this.mja).applyAxisAngle(this.oa, Math.PI*this.ta / 180.0)
    .setLength(r);
};

Orbit.prototype.setSatellitePositionOnHyperbola = function() {
  var r = -this.a*(this.ec*this.ec - 1.0) /
      (1.0 - this.ec*Math.cos(Math.PI*(180 - this.ta) / 180.0));
  this.satellitePosition
    .copy(this.mja).applyAxisAngle(this.oa, Math.PI*this.ta / 180.0)
    .setLength(r);
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
