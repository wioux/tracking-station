
EventPopups = function(system, parent) {
  var width = 200;

  var container = function(body, event) {
    var c = _('div', { class: "event-popup",
                       style: "width: "+width+"px",
                       parent: parent });
    _('header', { parent: c }).textContent = body.name;
    _('p', { parent: c }).textContent = event.description;
    return c;
  };

  var nrows = 5, ncols = 6;
  var sectors = [];
  for (var i=0; i < nrows; ++i) {
    sectors.push([]);
    for (var j=0; j < ncols; ++j)
      sectors[i].push({
        // top left
        pos: new THREE.Vector3(-1 + 2*(j+1)/ncols, -1 + 2*(i+1)/nrows, 0.5),

        // bottom right
        pos2: new THREE.Vector3(-1 + 2*(j+2)/ncols, -1 + 2*i/nrows, 0.5),

        occupied: false
      });
  }

  var map = function(pos) {
    pos = pos.clone().project(system.camera);

    if (Math.abs(pos.x) >= 1 || Math.abs(pos.y) >= 1)
      return null;

    var closest = null, dist = null;
    for (var i=0; i < sectors.length; ++i) {
      for (var j=0; j < sectors[i].length; ++j) {
        var sector = sectors[i][j];

        if (sector.occupied)
          continue;

        if (sector.pos.x <= pos.x && pos.x <= sector.pos2.x &&
            sector.pos.y >= pos.y && pos.y >= sector.pos2.y)
          continue;

        if (!closest || dist > sector.pos.distanceTo(pos)) {
          dist = sector.pos.distanceTo(pos);
          closest = sector;
        }
      }
    }

    return closest;
  };

  var position = function(sector) {
    return new THREE.Vector3(system.canvas.clientWidth * (1 + sector.pos.x)/2,
                             system.canvas.clientHeight * (1 - sector.pos.y)/2,
                             0);
  };

  system.eachBody(function(body) {
    body.timeline.forEach(function(event) {
      system.clock.on(event.jd, function() {
        var sector = map(body.object3d.position);
        if (!sector)
          return;

        sector.occupied = true;
        var popup = container(body, event);

        var pos2d1 = system.project(body.object3d.position);
        var pos2d2 = position(sector);

        popup.style.left = (pos2d1.x - width/2)+ 'px';
        popup.style.top = pos2d1.y + 'px';
        popup.style.transform = 'scale(0.1)';

        $(popup).animate({ left: pos2d2.x, top: pos2d2.y }, {
          progress: function(_, progress) {
            popup.style.transform = 'scale('+progress+')';
          },

          complete: function() {
            setTimeout(function() {
              sector.occupied = false;
              $(popup).remove();
            }, 3500);
          }
        });
      });
    });
  });
}
