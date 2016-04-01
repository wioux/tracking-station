
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
      'class': 'indent-'+indent,
      'style': 'display: '+(indent > 1 ? "none" : "block")
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

  var childElements = function(el) {
    var children = [];
    var child = el.nextSibling;
    var level = parseInt(el.className.match(/indent-(\d+)/)[1]);
    while (child && level < parseInt(child.className.match(/indent-(\d+)/)[1])) {
      children.push(child);
      child = child.nextSibling;
    }

    return children;
  };

  system.addEventListener('focus', function(e) {
    var li = list.querySelector('li.focused');
    li && li.classList.remove('focused');

    li = list.querySelector('li > input[name="'+e.body.id+'"]').parentNode;
    li.classList.add('focused');
  });

  $(list).on('change', 'input[type=checkbox]', function(e) {
    var body = system.bodies[e.target.name];
    e.target.checked ? body.show() : body.hide();

    childElements(e.target.parentNode).forEach(function(li) {
      var checkbox = $(li).find('input[type=checkbox]')[0];
      body = system.bodies[checkbox.name];
      checkbox.checked = e.target.checked;
      checkbox.disabled = !e.target.checked;
      e.target.checked ? body.show() : body.hide();
    });
  });

  $(list).on('click', 'li', function(e) {
    if ($(e.target).is('input[type=checkbox]'))
      return;

    if (e.detail > 1)
      return;

    var li = e.target;
    while (li.nodeName != 'LI')
      li = li.parentNode;

    var id = $(li).find('input[type=checkbox]').attr('name');
    var body = system.bodies[id] || system.bodies[parseInt(id)];
    system.setFocus(body);
  });

  $(list).on('dblclick', 'li', function(e) {
    e.preventDefault();

    var li = $(e.target).closest('li')[0];
    childElements(li).forEach(function(li) {
      if (li.style.display == 'none')
        li.style.display = 'block';
      else
        li.style.display = 'none';
    });
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
