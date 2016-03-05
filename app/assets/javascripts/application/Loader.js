
Loader = function(options) {
  this.options = options || {};
};

Loader.prototype.loadBodies = function(callback) {
  var self = this, bodies = {};
  $.get('bodies.json', function(resp) {
    resp.forEach(function(body) {
      var object = self.createBodyFromJson(bodies, body);
      window[body.name] = object;
    });

    callback(bodies);
  });
};

// Private

Loader.prototype.createBodyFromJson = function(system, json) {
  var body = new Body(json.name);
  system[json.id] = body;

  body.spacecraft = (json.classification == 'Spacecraft');
  body.sun = (json.classification == 'Star');

  body.info = json.marked_up_info;

  body.radiusKm = json.radius_km;

  if (json.inner_ring_radius_km) {
    body.rings = new PlanetaryRing(json.inner_ring_radius_km,
                                     json.outer_ring_radius_km);
    body.rings.texture = this.options.textures + json.ring_texture
  }

  body.npRA = json.north_pole_right_ascension || 0;
  body.npDEC = json.north_pole_declination || 0;

  body.color = json.color ? parseInt(json.color) : 0x808080;
  if (json.texture)
    body.texture = this.options.textures + json.texture;

  if (json.sprite)
    body.sprite = this.options.textures + json.sprite;

  if (json.parent_id)
    system[json.parent_id].addSatellite(body);

  if (json.ephemerides) {
    json.ephemerides.forEach(function(eph) { eph.jd = parseFloat(eph.jd) });
    body.addEphemerides(json.ephemerides);
  }

  return body;
};
