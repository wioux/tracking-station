
AppLoader = function(options) {
  this.options = options || {};
};

AppLoader.prototype.loadBodies = function(href, callback) {
  var self = this, bodies = [];
  $.get(href, function(resp) {
    resp.forEach(function(body) {
      var object = self.createBodyFromJson(body);
      window[body.name.replace(/ /g, '_')] = object;
      bodies.push(object);
    });

    callback(bodies);
  });
};

// Private

AppLoader.prototype.createBodyFromJson = function(json) {
  var body = new Body(json.name);

  body.id = json.id;
  body.spacecraft = (json.classification == 'Spacecraft');
  body.sun = (json.classification == 'Star');
  body.major = json.classification.match(/Planet/);
  body.classification = json.classification;

  body.info = json.marked_up_info;
  body.timeline = json.timeline_events;

  body.radiusKm = json.radius_km || 0.001;

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

  body.parentId = json.parent_id;

  if (json.ephemerides) {
    json.ephemerides.forEach(function(eph) { eph.jd = parseFloat(eph.jd) });
    json.ephemerides.sort(function(a, b) { return a.jd - b.jd });
    body.addEphemerides(json.ephemerides);
  }

  return body;
};
