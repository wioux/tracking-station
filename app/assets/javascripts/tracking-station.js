//= require three
//= require OrbitControls
//= require_tree ./application
//= require_tree ./3d
//= require_tree ./Ui

$(document).ready(function() {
  $('.tracking-station').each(function() {
    var jd = 2443392.038888889; // voyager 1, 2

    var container = this;
    var root = parseInt($(this).data('root'));
    var trackingStation = this;

    var loader = new AppLoader({ textures: 'public/textures/' });
    loader.loadSystem(this, jd, function(sys) {
      sys.createMilkyWay('public/textures/ESO_-_Milky_Way-Cropped.jpg');

      var sidebar = $(_('div', { parent: container, class: 'sidebar' }));
      new StatePanel(sys, sidebar);
      new BodyListPanel(sys, sidebar);

      new InfoPanels(sys, container, $(container).data('timeline'));
      new BodyTooltip(sys, container);
      new EventPopups(sys, container);

      window.sys = sys;
    });
  });
});
