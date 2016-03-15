
SystemPanel = function(system, parent) {
  var sidebar = $(_('div', { parent: parent, class: 'sidebar' }));

  new StatePanel(system, sidebar);
  new BodyListPanel(system, sidebar);
  new InfoPanels(system, parent);
  new BodyTooltip(system, parent);
};

