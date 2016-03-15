
BodyListPanel = function(system, parent) {
  var list = _('div', {
    'parent': parent,
    'class': 'body-list',
    'children': [_('ul')]
  }).children[0];

  var populate = function(root, indent) {
    if (!root)
      return;

    var name = root.name;
    var id = root.id;
    var li = _('li', {
      'class': 'indent-'+indent
    });

    var check = _('input', { 'parent': li, 'type': 'checkbox', 'name': id });
    check.checked = true;
    name == 'Sun' && (check.disabled = true);

    _('strong', { 'parent': li }).textContent = (indent > 1 ? '- '+name : name);

    list.appendChild(li);

    for (var i=0; i < root.satellites.length; ++i)
      populate(root.satellites[i], indent + 1);
  };

  populate(BodyListPanel.createTree(system), 0);

  system.addEventListener('focus', function(e) {
    $(list).find('li.focused').removeClass('focused');
    $(list).find('li > input[type=checkbox][name='+system.focus.id+']').
      parent().addClass('focused');
  });

  $(list).on('change', 'input[type=checkbox]', function(e) {
    var body = system.bodies[e.target.name];

    var toggle = function(body, display) {
      display ? body.show() : body.hide();

      // broken
      body.satellites.forEach(function(satellite) {
        var child = $(list).find('input[name='+satellite.id+']');
        toggle(satellite, display && child.prop('checked'));
        child.prop('disabled', !display);
      });
    };

    toggle(body, e.target.checked);
  });

  $(list).on('click', 'li', function(e) {
    if ($(e.target).is('input[type=checkbox]'))
      return;

    var li = e.target;
    while (li.nodeName != 'LI')
      li = li.parentNode;

    var id = $(li).find('input[type=checkbox]').attr('name');
    var body = system.bodies[id] || system.bodies[parseInt(id)];
    system.setFocus(body);
  });
};

// Private

BodyListPanel.createTree = function(system) {
  var map = {}

  system.eachBody(function() {
    map[this.id] = { id: this.id, name: this.name, satellites: [] };
  });

  system.eachBody(function() {
    if (this != system.root)
      map[this.parentId || system.root.id].satellites.push(map[this.id]);
  });

  return map[system.root.id];
};
