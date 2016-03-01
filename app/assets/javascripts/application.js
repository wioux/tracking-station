//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  var bodies = {};

  $.get('/bodies.json', function(resp) {
    resp.forEach(function(body) {
      var object = new Body(body.name);
      bodies[body.id] = object;
      window[body.name] = object;

      object.radiusKm = body.radius_km;
      object.spacecraft = (body.classification == 'Spacecraft');
      object.sun = (body.classification == 'Star');

      object.color = body.color;
      object.texture = body.texture;

      if (body.parent_id)
        bodies[body.parent_id].addSatellite(object);

      if (body.ephemeris)
        object.orbit.load(body.ephemeris);
    });
  });

  var jd = 2455779.5;
  var ctx = new SystemBrowser(document.getElementById('ui'), Sun, jd);
});
