//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  new Loader({ textures: 'textures/' })
    .loadBodies(function(bodies) {
      var jd = Earth.ephemerides[0].jd;
      window.sys = new SystemBrowser(document.getElementById('ui'), Sun, jd);
    });
});
