
Ecliptic = {
  solstice: function(size) {
    return new THREE.Vector3(0, 1, 0);
  },

  equinox: function(size) {
    return new THREE.Vector3(size || 1, 0, 0);
  },

  pole: function(size) {
    return new THREE.Vector3(0, 0, size || 1);
  },

  OBLIQUITY: 23.4
};

Equatorial = {
  equinox: function(size) {
    var c = Math.cos(-Math.PI * Ecliptic.OBLIQUITY / 180.0),
        s = Math.sin(-Math.PI * Ecliptic.OBLIQUITY / 180.0);
    var m = new THREE.Matrix3().set(1, 0, 0,
                                    0, c, -s,
                                    0, s, c);
    return Ecliptic.equinox(size).applyMatrix3(m);
  },

  pole: function(size) {
    // Why did I have to negate the obliquity? ...
    var c = Math.cos(-Math.PI * Ecliptic.OBLIQUITY / 180.0),
        s = Math.sin(-Math.PI * Ecliptic.OBLIQUITY / 180.0);
    var m = new THREE.Matrix3().set(1, 0, 0,
                                    0, c, -s,
                                    0, s, c);
    return Ecliptic.pole(size).applyMatrix3(m);
  }
};

Coord = {
  equ: function() {
    var coord = new THREE.Vector3();
    var axis = new THREE.Vector3();
    return function(result, ra, dec) {
      if (arguments.length != 3) {
        dec = ra;
        ra = result;
        result = new THREE.Vector3();
      }

      coord.copy(Equatorial.EQUINOX);
      coord.applyAxisAngle(Equatorial.NORTH, Math.PI*ra/180.0);
      axis.copy(coord).cross(Equatorial.NORTH);
      coord.applyAxisAngle(axis, Math.PI*dec/180.0);

      return result.copy(coord);
    }
  }()
};

Ecliptic.NORTH = Ecliptic.pole(1);
Ecliptic.EQUINOX = Ecliptic.equinox(1);
Ecliptic.SOLSTICE = Ecliptic.solstice(1);

Equatorial.NORTH = Equatorial.pole(1);
Equatorial.EQUINOX = Equatorial.equinox(1);
