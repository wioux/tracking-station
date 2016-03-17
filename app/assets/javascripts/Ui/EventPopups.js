
EventPopups = function(system, parent) {
  system.eachBody(function(body) {
    body.timeline.forEach(function(event) {
      system.clock.on(event.jd, function() {
        var popup = _('div', { class: "event-popup", parent: parent });
        popup.textContent = event.description;

        var pos3d = body.object3d.position.clone();
        var f = system.addEventListener('update', function() {
          var pos2d = system.project(pos3d);
          popup.style.left = pos2d.x + 'px';
          popup.style.top = pos2d.y + 'px';
        });

        setTimeout(function() {
          system.removeEventListener('update', f);
          popup.parentNode.removeChild(popup);
        }, 6000);
      });
    });
  });
}
