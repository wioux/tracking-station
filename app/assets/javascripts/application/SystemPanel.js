
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
    focus: $(info).find('[data-info=focus]')[0],
    date: $(info).find('[data-info=date]')[0],
    tooltip: $(ui).find('[data-info=body-tooltip]')[0]
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

  var bodyList = $(bodyListContainer).find('ul')[0];
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

  $(this.panel).on('change', '.body-list', function(e) {
    var body = system.bodies[e.target.name];

    var toggle = function(body, display) {
      display ? body.show() : body.hide();

      body.satellites.forEach(function(satellite) {
        var child = $(bodyList).find('input[name='+satellite.name+']')[0];
        toggle(satellite, display && child.checked);
        child.disabled = !display;
      });
    };

    toggle(body, e.target.checked);
    system.render();
  });

  $(this.panel).on('click', '.body-list', function(e) {
    var li = e.target;
    if (!li.matches('input') && !li.matches('ul')) {
      while (!li.matches('li'))
        li = li.parentNode;

      var id = $(li).find('input[type=checkbox]')[0].name;
      var body = system.bodies[id];
      system.setFocus(body);
    }
  });

  $(this.info.focus).on('change', function() {
    var body = system.focus;
    var bodyList = $(self.panel).find('.body-list ul')[0];
    var focus = $(bodyList).find('li.focused')[0];
    focus && focus.classList.remove('focused');

    $(bodyList).find('li > input[type=checkbox][name='+body.name+']')[0].
      parentNode.classList.add('focused');
  });
};
