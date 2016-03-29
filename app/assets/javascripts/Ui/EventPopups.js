
EventPopups = function(system, parent) {
  var timeouts = {}, containers = {};

  var width = 200;

  system.eachBody(function(body) {
    body.timeline.forEach(function(event) {
      system.clock.on(event.jd, function() {
        var popup = containers[body.id];
        if (!popup) {
          popup = containers[body.id] = _('div', { class: "event-popup",
                                                   style: "width: "+width+"px",
                                                   parent: parent });
          _('header', { parent: popup }).textContent = body.name;
        }

        if (timeouts[body.id]) {
          clearTimeout(timeouts[body.id][1]);
        } else {
          var f = system.addEventListener('update', function() {
            var pos2d = system.project(body.object3d.position);
            popup.style.left = (pos2d.x - width/2) + 'px';
            popup.style.top = pos2d.y + 'px';
          });

          timeouts[body.id] = [function() {
            system.removeEventListener('update', f);
            $(popup).find('p').remove();
            popup.style.display = 'none';
            timeouts[body.id] = null;
          }];
        }

        timeouts[body.id][1] = setTimeout(timeouts[body.id][0], 6000);

        _('p', { parent: popup }).textContent = event.description;

        popup.style.display = 'block';

      });
    });
  });
}
