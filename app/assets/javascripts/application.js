//= require jquery
//= require three
//= require OrbitControls
//= require domhelpers
//= require_tree ./application

$(document).ready(function() {
  $('.tracking-station').each(function() {
    var container = this;
    var root = parseInt($(this).data('root'));

    new AppLoader({ textures: '/textures/' }).
      loadBodies($(this).data('href'), function(bodies) {
        var jd = 2455794.330554163;

        root = bodies.find(function(x) { return x.id == root });

        window.sys = new SystemBrowser(container, bodies, root);
        window.sys.createMilkyWay('/textures/ESO_-_Milky_Way-Cropped.jpg');

        window.ui = new SystemPanel(sys, container);

        if (!root.sun)
          sys.setAmbientLight(0xffffff);

        sys.start(jd);
      });
  });
});
