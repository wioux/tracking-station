//= require jquery
//= require jquery-ui
//= require three
//= require OrbitControls
//= require_tree ./application
//= require_tree ./3d
//= require_tree ./Ui

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

        var sidebar = $(_('div', { parent: container, class: 'sidebar' }));
        new StatePanel(sys, sidebar);
        new BodyListPanel(sys, sidebar);

        new InfoPanels(sys, container);
        new BodyTooltip(sys, container);
        new EventPopups(sys, container);

        if (!root.sun)
          sys.setAmbientLight(0xffffff);

        sys.start(jd);

        bodies
          .filter(function(body) { return body.ephemerides.href })
          .forEach(function(body) {
            $.get(body.ephemerides.href, function(ephemerides) {
              ephemerides.forEach(function(eph) { eph.jd = parseFloat(eph.jd) });
              ephemerides.sort(function(a, b) { return a.jd - b.jd });
              body.ephemerides.addAll(ephemerides);
            });
          });
      });
  });
});
