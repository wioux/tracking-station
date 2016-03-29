
BodyTooltip = function(system, parent) {
  var ui = _('div', {
    'parent': parent,
    'class': 'body-tooltip',
    'data-info': 'body-tooltip'
  });

  system.addEventListener('unhighlight', function(e) {
    $(ui).css('display', 'none');
  });

  system.addEventListener('highlight', function(e) {
    $(ui).text(e.body.name)
      .css({
        left: e.layerX,
        top: e.layerY,
        display: 'block'
      });
  });
};

