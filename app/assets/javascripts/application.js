//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  new AppLoader({ textures: 'textures/' })
    .loadBodies(function(bodies) {
      var jd = Earth.ephemerides[0].jd;
      var container = document.getElementById('ui');

      window.sys = new SystemBrowser(container, bodies, Sun);
      window.sys.createMilkyWay('textures/ESO_-_Milky_Way-Cropped.jpg');

      window.ui = new SystemPanel(sys, container);

      sys.start(jd);
    });
});
