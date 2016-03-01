Orbit = function(body) {
  this.body = body;

  // Semi-major axis (au)
  this.a = 1.0;

  // Semi-minor axis (au)
  this.b = 1.0;

  // Major axis (unit vector)
  this.mja = new THREE.Vector3(1, 0, 0);

  // Minos axis (unit vector)
  this.mna = new THREE.Vector3(0, 1, 0);

  // Periapsis distance (au)
  this.qr = 1.0;

  // Julian day
  this.jd = 0.0;

  // True anomaly (DEG) at epoch
  this.ta = 0.0;

  // Eccentricity
  this.ec = 0.0;

  // Apoapsis distance (au)
  // this.ad = 1.0;

  // Inclination of orbit plane (DEG) wrt ecliptic
  // this.inc = 0.0;

  // Longitude of Ascending Node (DEG) wrt ecliptic/equinox
  // this.om = 0.0;

  // Argument of Periapsis (DEG) wrt ecliptic/equinox
  // this.w = 0.0;

  // Mean anomaly (DEG) at epoch
  this.ma = 0.0;

  // Mean motion (DEG/DAY)
  this.n = 0.9856;

  // Perihelion Julian Date
  // this.tp = 0.0;
};

Orbit.KM_PER_AU = 1.496e8;

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

/*
Orbit.setupAxisVectors = function(orbit) {
  // ascending node
  var an = new THREE.Vector3(Math.cos(Math.PI*orbit.om/180.0),
                             Math.sin(Math.PI*orbit.om/180.0),
                             0);

  // normalized rotation axis for finding orbital axis
  var ra = an.clone().cross(new THREE.Vector3(0, 0, 1)).normalize();

  // orbital axis. is starting with 0, 0, 1 right?
  var oa = new THREE.Vector3(0, 0, 1).applyAxisAngle(ra, Math.PI*orbit.inc/180.0);

  orbit.major_axis =
    an.clone().applyAxisAngle(oa, Math.PI*orbit.w/180.0).normalize();

  orbit.minor_axis =
    orbit.major_axis.clone().applyAxisAngle(oa, Math.PI/2).normalize();
};
*/
