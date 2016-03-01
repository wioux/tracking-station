
SystemPanel = function(system, ui) {
  var overlay = _('div', { parent: ui,      class: 'overlay' });
  var info    = _('div', { parent: overlay, class: 'info' });

  _('div', { parent: info }, function(container) {
    _('label', { parent: container }).textContent = 'Date';
    _('span',  { parent: container, 'data-info': 'date' });
  });

  _('div', { parent: info }, function(container) {
    _('label', { parent: container }).textContent = 'Focus';
    _('span',  { parent: container, 'data-info': 'focus' });
  });

  this.system = system;
  this.panel = overlay;
  this.info = {
    panel: info,
    focus: $(info, '[data-info=focus]'),
    date: $(info, '[data-info=date]'),
    tooltip: $(ui, '[data-info=body-tooltip]')
  };

  this.initializeBodyList(system.root);
  this.bindEvents();
};

SystemPanel.prototype.setJulianDay = function(jd) {
  this.jd = jd;
  this.info.date.textContent = JulianDay.toString(jd);
};

SystemPanel.prototype.setFocus = function(body) {
  this.info.focus.textContent = body.name;
  this.info.focus.dispatchEvent(new Event('change'));
};


// Private

SystemPanel.prototype.initializeBodyList = function(root) {
  var bodyListContainer = _('div', {
    'parent': this.panel,
    'class': 'body-list',
    'children': [_('ul')]
  });

  var bodyList = $(bodyListContainer, 'ul');
  var populate = function(list, root, indent) {
    if (!root)
      return;

    var name = root.name;
    var li = _('li', {
      'class': 'indent-'+indent
    });

    var check = _('input', { 'parent': li, 'type': 'checkbox', 'name': name });
    check.checked = true;
    name == 'Sun' && (check.disabled = true);

    _('strong', { 'parent': li }).textContent = (indent > 1 ? '- '+name : name);

    list.appendChild(li);

    for (var i=0; i < root.satellites.length; ++i)
      populate(list, root.satellites[i], indent + 1);
  };

  populate(bodyList, root, 0);
};

SystemPanel.prototype.bindEvents = function() {
  var self = this,
      system = this.system,
      bodyList = $(this.panel, '.body-list');

  bodyList.addEventListener("change", function(e) {
    var body = system.bodies[e.target.name];

    var toggle = function(body, display) {
      display ? body.show() : body.hide();

      body.satellites.forEach(function(satellite) {
        var child = $(bodyList, 'input[type=checkbox][name='+satellite.name+']');
        toggle(satellite, display && child.checked);
        child.disabled = !display;
      });
    };

    toggle(body, e.target.checked);
    system.render();
  });

  bodyList.addEventListener("click", function(e) {
    var li = e.target;
    if (!li.matches('input') && !li.matches('ul')) {
      while (!li.matches('li'))
        li = li.parentNode;

      var id = $(li, 'input[type=checkbox]').name;
      var body = system.bodies[id];
      system.setFocus(body);
    }
  });

/*
  bodyList.addEventListener('mousemove', function(e) {
    var li = e.target;
    while (li && !li.matches('li'))
      li = li.parentNode;

    if (li) {
      var id = $(li, 'input[type=checkbox]').name;
      var body = system.bodies[id];
      body.highlight();
      ctx.render();
    }
  });
*/

  this.info.focus.addEventListener('change', function() {
    var body = system.focus;
    var bodyList = $(self.panel, '.body-list ul');
    var focus = $(bodyList, 'li.focused');
    focus && focus.classList.remove('focused');

    $(bodyList, 'li > input[type=checkbox][name='+body.name+']').
      parentNode.classList.add('focused');
  });
};
