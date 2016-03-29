//= require jquery
//= require three
//= require OrbitControls
//= require_tree ./application
//= require_tree ./3d
//= require_tree ./Ui

$(document).ready(function() {
  $('.tracking-station').each(function() {
    var container = this;
    var root = parseInt($(this).data('root'));

    new AppLoader({ textures: 'public/textures/' }).
      loadBodies($(this).data('href'), function(bodies) {
//        var jd = 2450814.3755098176 - 14;
//        var jd = 2453755.3; // new horizons
        var jd = 2443392.038888889; // voyager 1, 2
//        var jd = 2455794.330554163;
//        var jd = 2450736.9;

        root = bodies.find(function(x) { return x.id == root });

        window.sys = new SystemBrowser(container, bodies, root);
        window.sys.createMilkyWay('public/textures/ESO_-_Milky_Way-Cropped.jpg');

        var sidebar = $(_('div', { parent: container, class: 'sidebar' }));
        new StatePanel(sys, sidebar);
        new BodyListPanel(sys, sidebar);

        new InfoPanels(sys, container);
        new BodyTooltip(sys, container);
        new EventPopups(sys, container);

        if (!root.sun)
          sys.setAmbientLight(0xffffff);

        sys.start(jd);
      });
  });
});
