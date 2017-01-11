
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

  _('div', { parent: state, style: "margin-top: 4px; text-align: center" }, function(container) {
    _('label', { parent: container });
    _('div',  { parent: container, 'data-state': 'warp' });

    $(container.children[1]).slider({
      min: -23,
      max: 23,
      slide: function(e, ui) {
        system.clock.setWarp(ui.value);
      }
    });
  });


  var ui = {
    focus: $(state).find('[data-state=focus]'),
    date: $(state).find('[data-state=date]'),
    warp: {
      slider: $(state).find('[data-state=warp]'),
      label: $(state).find('[data-state=warp]').parent().find('label')
    }
  };

  var lastJd;
  system.addEventListener('update', function(e) {
    var jd = Math.floor(e.jd);
    if (jd != lastJd)
      ui.date.text(JulianDay.toString(jd));
    lastJd = jd;
  });

  ui.focus.text(system.focus.name);
  system.addEventListener('focus', function(e) {
    ui.focus.text(e.body.name);
  });

  $(ui.warp.slider).slider('value', system.clock.warp);
  $(ui.warp.label).text('Time Warp: ' + system.clock.warp.toFixed(1));
  system.clock.addEventListener('warp', function(e) {
    $(ui.warp.slider).slider('value', system.clock.warp);
    $(ui.warp.label).text('Time Warp: ' + system.clock.warp.toFixed(1));
  });
};
