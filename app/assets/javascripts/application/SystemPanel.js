
SystemPanel = function(system, ui) {
  var sidebar = _('div', { parent: ui,      class: 'sidebar' });
  var state    = _('div', { parent: sidebar, class: 'state' });
  var buttons = _('div', { parent: ui, class: 'buttons' });
  var panel   = _('div', { parent: ui, class: 'info-panel' });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Date';
    _('span',  { parent: container, 'data-state': 'date' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Time Warp';
    _('span',  { parent: container, 'data-state': 'warp' });
  });

  _('div', { parent: state }, function(container) {
    _('label', { parent: container }).textContent = 'Focus';
    _('span',  { parent: container, 'data-state': 'focus' });
  });

  _('div', { parent: buttons, class: 'button' }, function(container) {
    container.textContent = "I";
  });

  _('h2', { parent: panel });
  _('h3', { parent: panel }).textContent = 'Info';
  _('div', { parent: panel, class: 'description' });

  this.system = system;
  this.sidebar = $(sidebar);
  this.panel = {
    container: $(panel),
    buttons: $(buttons).find('.button'),
    name: $(panel).find('h2'),
    description: $(panel).find('.description')
  };

  this.state = {
    focus: $(state).find('[data-state=focus]'),
    date: $(state).find('[data-state=date]'),
    warp: $(state).find('[data-state=warp]')
  };

  this.initializeBodyList(SystemPanel.createTree(system));
  this.bindEvents();
};

SystemPanel.prototype.setJulianDay = function(jd) {
  this.jd = jd;
  this.state.date.text(JulianDay.toString(jd));
};

SystemPanel.prototype.setFocus = function(body) {
  this.panel.name.text(body.name.toUpperCase());
  this.panel.description.html(body.info);
  this.panel.description.prop('scrollTop', 0);
  this.state.focus.text(body.name);
  this.state.focus.trigger('change');
};


// Private

SystemPanel.prototype.initializeBodyList = function(root) {
  var list = _('div', {
    'parent': this.sidebar,
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

  populate(root, 0);
};

SystemPanel.prototype.bindEvents = function() {
  var self = this,
      system = this.system,
      list = this.sidebar.find('.body-list');

  this.sidebar.on('change', '.body-list', function(e) {
    var body = system.bodies[e.target.name];

    var toggle = function(body, display) {
      display ? body.show() : body.hide();

      body.satellites.forEach(function(satellite) {
        var child = $(list).find('input[name='+satellite.id+']');
        toggle(satellite, display && child.prop('checked'));
        child.prop('disabled', !display);
      });
    };

    toggle(body, e.target.checked);
  });

  this.sidebar.on('click', '.body-list li', function(e) {
    if ($(e.target).is('input[type=checkbox]'))
      return;

    var li = e.target;
    while (li.nodeName != 'LI')
      li = li.parentNode;

    var id = $(li).find('input[type=checkbox]').attr('name');
    var body = system.bodies[parseInt(id)];
    system.setFocus(body);
  });

  $(this.state.focus).on('change', function() {
    $(list).find('li.focused').removeClass('focused');
    $(list).find('li > input[type=checkbox][name='+system.focus.id+']').
      parent().addClass('focused');
  });


  this.panel.container.css('display', 'none');
  this.panel.buttons.on('click', function(e) {
    self.panel.container.toggle();
    $(this).toggleClass('selected');
  });
};

SystemPanel.createTree = function(system) {
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
