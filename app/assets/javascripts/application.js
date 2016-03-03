//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  var bodies = {};

  $.get('bodies.json', function(resp) {
    resp.forEach(function(body) {
      var object = new Body(body.name);
      bodies[body.id] = object;
      window[body.name] = object;

      object.spacecraft = (body.classification == 'Spacecraft');
      object.sun = (body.classification == 'Star');

      object.radiusKm = body.radius_km;

      if (body.inner_ring_radius_km) {
        object.rings = new PlanetaryRing(body.inner_ring_radius_km,
                                         body.outer_ring_radius_km);
        object.rings.texture = "textures/"+body.ring_texture
      }

      object.npRA = body.north_pole_right_ascension || 0;
      object.npDEC = body.north_pole_declination || 0;

      object.color = body.color ? parseInt(body.color) : 0x808080;
      if (body.texture)
        object.texture = "textures/"+body.texture;

      if (body.parent_id)
        bodies[body.parent_id].addSatellite(object);

      if (body.ephemerides)
        object.addEphemerides(body.ephemerides);
    });

    var jd = Earth.ephemerides[0].jd;
    var ctx = new SystemBrowser(document.getElementById('ui'), Sun, jd);
  });
});
