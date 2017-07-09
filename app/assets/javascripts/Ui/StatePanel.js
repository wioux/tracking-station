
StatePanel = function(system, parent) {
  var state = _('div', { parent: parent, class: 'state' });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Date';
    _('span',  { parent: container, 'data-state': 'date' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Focus';
    _('span',  { parent: container, 'data-state': 'focus' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Warp';
    _('span',  { parent: container, 'data-state': 'warp' });
  });

  var ui = {
    focus: $(state).find('[data-state=focus]'),
    date: $(state).find('[data-state=date]'),
    warp: $(state).find('[data-state=warp]'),
  };

  var lastJd;
  system.addEventListener('update', function(e) {
    var jd = Math.floor(e.jd);
    if (jd != lastJd)
      ui.date.text(JulianDay.toString(jd));
    lastJd = jd;
  });

  ui.date.text(JulianDay.toString(system.clock.jd))


  ui.focus.text(system.focus.name);
  system.addEventListener('focus', function(e) {
    ui.focus.text(e.body.name);
  });


  system.clock.addEventListener('warp', function(e) {
    ui.warp.text(system.clock.warp.toFixed(1));
  });

  system.clock.trigger('warp');
};
