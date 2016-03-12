//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  new Loader({ textures: 'textures/' })
    .loadBodies(function(bodies) {
      var jd = Earth.ephemerides[0].jd;
      var container = document.getElementById('ui');
      window.sys = new SystemBrowser(container, Sun, parseFloat(jd));
      window.sys.createMilkyWay('textures/ESO_-_Milky_Way-Cropped.jpg');
    });
});
