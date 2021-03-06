
InfoPanels = function(system, parent, initialTimeline) {
  var panels = _('div', { parent: parent, class: 'panels' });
  panels.innerHTML =
    '<div class="buttons">' +
      '<div class="button" data-panel="info">I</div>' +
      '<div class="button" data-panel="timeline">T</div>' +
    '</div>' +
    '<div class="panel" style="display: none">' +
      '<h2 class="body-name"></h2>' +
      '<h3 class="panel-title"></h3>' +
      '<div class="content"></div>' +
    '</div>';

  var ui = {
    buttons: $(panels).find('.buttons'),
    container: $(panels).find('.panel')
  };

  var self = this;
  $(panels).find('.button[data-panel=info]').data('setup', function(panel) {
    var name = system.focus.name + ' (' + system.focus.classification + ')';
    panel.find('.body-name').text(name.toUpperCase());
    panel.find('.panel-title').text('Info');
    panel.find('.content').html(system.focus.info || 'No info for this body.');
  });

  $(panels).find('.button[data-panel=timeline]').data('setup', function(panel) {
    var name = system.focus.name + ' (' + system.focus.classification + ')';
    panel.find('.body-name').text(name.toUpperCase());
    panel.find('.panel-title').text('Timeline');
    panel.find('.content').html(self.getTimelineFor(system.focus, system.clock.jd));
  });

  ui.container.on('click', '.timeline-events a[data-jd]', function(e) {
    e.preventDefault();
    system.clock.warpTo(parseFloat(this.dataset.jd));
  });

  ui.buttons.on('click', '.button', function(e) {
    if ($(this).hasClass('selected')) {
      ui.container.hide();
      $(this).removeClass('selected');
    } else {
      $(this).data('setup')(ui.container);
      ui.container.find('.content').prop('scrollTop', 0);
      $(this).siblings().removeClass('selected');
      $(this).addClass('selected');
      ui.container.show();
    }
  });

  system.addEventListener('focus', function(e) {
    if (!e.body.timeline.length)
      return;

    $(panels).find('.button[data-panel=timeline]').trigger('click');
    if (!$(panels).find('.button[data-panel=timeline]').hasClass('selected'))
      $(panels).find('.button[data-panel=timeline]').trigger('click');
  });

  // ugly
  if (initialTimeline) {
    var setupTimeline;
    setupTimeline = system.addEventListener('update', function() {
      system.removeEventListener('update', setupTimeline);

      var focus = system.focus;
      system.focus = system.bodies[initialTimeline];

      $(panels).find('.button[data-panel=timeline]').trigger('click');

      system.focus = focus;
    });
  }
};

// Private

InfoPanels.prototype.getTimelineFor = function(body, jd) {
  var events = body.timeline.map(function(event) {
    return _('li', {
      "data-event_id": event.id,
      "class": event.jd <= jd ? "transpired" : "",
      children: [
        _('span', { class: 'date', children: [JulianDay.toString(event.jd)] }),
        _('a', { class: 'description', 'data-jd': event.jd, href: '#', children: [event.description] })
      ]
    });
  });

  if (events.length)
    return $('<ul>').addClass('timeline-events').append(events);
  else
    return "No known events";
};

