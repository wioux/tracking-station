
AppLoader = function(options) {
  this.options = options || {};
};

AppLoader.prototype.loadSystem = function(container, startJd, callback) {
  var loader = this;
  this.loadBodies(container.dataset.href, function(bodies) {
    var root = bodies.find(function(x) { return x.id == container.dataset.root });

    var sys = new SystemBrowser(container, bodies, root);

    if (!root.sun)
      sys.setAmbientLight(0xffffff);

    if (container.dataset.focus) {
      var focus = bodies.find(function(x) { return x.id == container.dataset.focus });
      sys.setFocus(focus);
    }

    sys.start(startJd);
    loader.loadEphemerides(bodies);

    callback && callback(sys);
  });
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

AppLoader.prototype.loadEphemerides = function(bodies) {
  bodies
    .filter(function(body) { return body.ephemerides.href })
    .forEach(function(body) {
      $.get(body.ephemerides.href, function(ephemerides) {
        ephemerides.forEach(function(eph) { eph.jd = parseFloat(eph.jd) });
        ephemerides.sort(function(a, b) { return a.jd - b.jd });
        body.ephemerides.addAll(ephemerides);
      });
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
    body.ephemerides.addAll(json.ephemerides);
  }

  body.ephemerides.href = json.ephemerides_url;

  return body;
};
