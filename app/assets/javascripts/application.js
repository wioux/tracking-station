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

      sys.addEventListener('update', function(e) {
        sys.ui.system.setJulianDay(e.jd);
      });

      sys.addEventListener('focus', function(e) {
        sys.ui.system.setFocus(e.body);
      });

      sys.addEventListener('unhighlight', function(e) {
        sys.ui.tooltip.css('display', 'none');
      });

      sys.addEventListener('highlight', function(e) {
        sys.ui.tooltip
          .text(e.body.name)
          .css({
            left: e.layerX,
            top: e.layerY,
            display: 'block'
          });
      });

      sys.clock.addEventListener('warp', function(e) {
        sys.ui.system.state.warp.text(e.warp);
      });

      sys.start(jd);
    });
});
