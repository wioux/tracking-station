
StatePanel = function(system, parent) {
  var state = _('div', { parent: parent, class: 'state' });
  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Date';
    _('span',  { parent: container, 'data-state': 'date' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Time Warp';
    _('span',  { parent: container, 'data-state': 'warp' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Focus';
    _('span',  { parent: container, 'data-state': 'focus' });
  });

  var ui = {
    focus: $(state).find('[data-state=focus]'),
    date: $(state).find('[data-state=date]'),
    warp: $(state).find('[data-state=warp]')
  };

  system.addEventListener('update', function(e) {
    ui.date.text(JulianDay.toString(e.jd));
  });

  system.addEventListener('focus', function(e) {
    ui.focus.text(e.body.name);
  });

  system.clock.addEventListener('warp', function(e) {
    ui.warp.text(e.warp);
  });
};