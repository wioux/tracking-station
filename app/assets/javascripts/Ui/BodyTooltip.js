
BodyTooltip = function(system, parent) {
  var width = 150;
  var ui = _('div', {
    'parent': parent,
    'class': 'body-tooltip',
    'style': 'width: '+width+'px; text-align: center',
    'data-info': 'body-tooltip'
  });

  system.addEventListener('unhighlight', function(e) {
    $(ui).css('display', 'none');
  });

  system.addEventListener('highlight', function(e) {
    var p = system.project(e.body.object3d.position);
    $(ui).text(e.body.name)
      .css({
        left: p.x - width/2,
        top: p.y + 15,
        display: 'block'
      });
  });
};

