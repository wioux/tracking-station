if (!Float64Array.from)
  Float64Array.from = function(array) {
    var result = new Float64Array(array.length);
    for (var i=0; i < array.length; ++i)
      result[i] = array[i];
    return result;
  };

SystemBrowser = function(ui, body, jd) {
  this.root = body;

  var loadBodies = function(container, satellites) {
    satellites.forEach(function(body) {
      container[body.id] = body;
      loadBodies(container, body.satellites);
    });

    return container;
  };
  this.bodies = loadBodies({}, body.satellites);
  this.bodies[body.id] = body;

  this.root = body;
  this.focus = body;

  this.initializeUi(ui, body);

  this.update(jd);

  this.ui.system.setJulianDay(jd);
  this.setFocus(body);
};

SystemBrowser.prototype.update = function(jd) {
  var oldCenter = this.camera.controls.target.clone();
  this.root.drawSystem(this, new THREE.Vector3(0, 0, 0), jd, true);

  this.pan(this.camera.controls.target, true);
  this.render();

  this.ui.system.setJulianDay(jd);
};

SystemBrowser.prototype.setFocus = function(body) {
  this.focus = body;
  this.camera.controls.target = body.shell.position;
  this.pan(body.shell.position, function() {
    this.centerCoordinates();
  });

  this.ui.system.setFocus(body);
};

SystemBrowser.prototype.render = function() {
  this.applyVisibilityFlags()
  this.renderer.render(this.scene, this.camera);
};

// private methods

SystemBrowser.prototype.initializeUi = function(ui, body) {
//  this.auToPx = 1e3;
  this.auToPx = 1e11;

  this.createHtmlComponents(ui, body);
  this.createWebGLComponents(this.canvas, this.auToPx);

  this.bindEvents(this);
};

SystemBrowser.prototype.createHtmlComponents = function(ui, root) {
  var systemPanel = new SystemPanel(this, ui);
  var canvas  = _('div', { parent: ui,      class: 'canvas' });

  var tooltip = _('div', {
    'parent': ui,
    'class': 'body-tooltip',
    'data-info': 'body-tooltip'
  });

  this.ui = { system: systemPanel, tooltip: tooltip };
  this.canvas = canvas;
};

SystemBrowser.prototype.createWebGLComponents = function(canvas, auToPx) {
  var scene = new THREE.Scene();
  scene.up.set(0, 0, 1);

  var camera = new THREE.PerspectiveCamera(
    90 /* fov */,
    window.innerWidth / window.innerHeight /* ar */,
    auToPx/1000000 /* near clip */, 100*auToPx /* far clip */
  );
  camera.up.set(0, 0, 1);
  camera.position.z = 2 * auToPx;
  this.focusPosition = new THREE.Vector3(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.appendChild(renderer.domElement);

  // Tuck controls under this.camera
  var self = this;
  camera.controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.controls.enablePan = false;
  camera.controls.addEventListener('change', function() {
    self.render();
  });

  this.scene = scene;
  this.renderer = renderer;
  this.camera = camera;
};

SystemBrowser.prototype.bindEvents = function() {
  var self = this;

  this.canvas.addEventListener('mousedown', function(e) {
  var mouse = new THREE.Vector3( e.clientX/window.innerWidth * 2 - 1,
                                -e.clientY/window.innerHeight * 2 + 1,
                                 0.5);

    var intersects = self.camera
        .rayCast(self.scene.children, mouse)
        .filter(function(t) {
          return t.object.userData.body;
        });

    if (intersects.length) {
      self.setFocus(intersects[0].object.userData.body);
      self.render();
    }
  });

  this.canvas.addEventListener('mousemove', function(e) {
    var mouse = new THREE.Vector3( e.clientX/window.innerWidth * 2 - 1,
                                  -e.clientY/window.innerHeight * 2 + 1,
                                   0.5);

    var intersects = self.camera
        .rayCast(self.scene.children, mouse)
        .filter(function(t) {
          return t.object.userData.body;
        });

    self.hideBodyTooltip();
    if (intersects.length)
      self.showBodyTooltip(intersects[0].object.userData.body);
  });

  window.addEventListener('resize', function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.render();
  }, false);
};

SystemBrowser.prototype.pan = function(position, immediate, callback) {
  var connect = position.clone().sub(this.focusPosition);
  var direction = connect.clone().normalize();
  var length = connect.length();

  if (typeof immediate == 'function') {
    callback = immediate;
    immediate = false;
  }

  this.focusPosition = position.clone();

  if (immediate) {
    this.camera.position.add(connect);
    return callback && callback.call(this);
  }

  var steps = 15;
  var ds = length / steps;

  var self = this;
  var animate = function() {
    self.camera.position.addScaledVector(direction, ds);
    self.render();

    if (--steps)
      requestAnimationFrame(animate);
    else
      callback && callback.call(self);
  };

  animate();
};

SystemBrowser.prototype.centerCoordinates = function() {
  var translation = this.root.shell.position.clone().sub(this.focusPosition);
  this.root.drawSystem(this, translation, this.ui.system.jd, true);

  this.camera.position.sub(this.focusPosition);
  this.focusPosition.set(0, 0, 0);

  this.render();
};


SystemBrowser.prototype.applyVisibilityFlags = function() {
  var body, localSystem = this.focus.family();
  var r = this.focus.scaleShell(this, this.camera.position);
  var op = Math.max(0.0, Math.min(0.5, r / 9.0));
  if (op < 0.01)
    op = 0.0;
  for (var id in this.bodies) {
    body = this.bodies[id];
    body.scaleShell(this, this.camera.position);

    if (body.highlighted) {
      body.setOpacity(1.0);
    } else if (localSystem.indexOf(body) == -1) {
      body.setOpacity(op);
      body.setVisibility(!(body.flags & (Body.HIDDEN | Body.FADED)));
      op == 0 && body.setVisibility(false);
    } else {
      body.setOpacity(0.5);
      body.setVisibility(!(body.flags & (Body.HIDDEN | Body.FADED)));
    }
  }
};

SystemBrowser.prototype.loadTexture = function(path) {
  if (!this._textureLoader) {
    this._textureLoader = new THREE.TextureLoader();
    this._textureLoader.crossOrigin = true;
  }

  return this._textureLoader.load(path);
};

SystemBrowser.prototype.hideBodyTooltip = function() {
  var changed = false;
  for (var id in this.bodies)
    changed = this.bodies[id].unhighlight() || changed;

  this.ui.tooltip.style.display = 'none';
  changed && this.render();
};

SystemBrowser.prototype.showBodyTooltip = function(body) {
  this.ui.tooltip.textContent = body.name;

  var x, y, pos = body.shell.position.clone().project(this.camera);
  x = window.innerWidth * (1 + pos.x) / 2;
  y = window.innerHeight * (1 - pos.y) / 2;

  this.ui.tooltip.style.left = x;
  this.ui.tooltip.style.top = y + 20;
  this.ui.tooltip.style.display = 'block';

  body.highlight();
  this.render();
};

SystemBrowser.prototype.debugPosition = function(pos, color) {
  var geom = new THREE.Geometry();
  geom.vertices.push(pos);

  var mat = new THREE.PointsMaterial({
    color: color || 0xff0000,
    size: 4.0,
    sizeAttenuation: false
  });

  var points = new THREE.Points(geom, mat);
  this.scene.add(points);

  this.render();
};

SystemBrowser.prototype.debugVector = function(pos, v, color) {
  var geom = new THREE.Geometry();

  geom.vertices.push(pos);
  geom.vertices.push(pos.clone().add(v));

  var mat = new THREE.LineBasicMaterial({
    linewidth: 2,
    color: color || 0xff0000
  });
  var line = new THREE.Line(geom, mat);
  this.scene.add(line);

  this.render();
};

SystemBrowser.prototype.debugRayCast = function() {
  if (this.visualizeRayCastEnabled) {
    console.log('stopping ray cast visualization');
    this.canvas.removeEventListener('mousemove', this.visualizeRayCast);
    return this.visualizeRayCastEnabled = false;
  }

  console.log('visualizing ray casts');
  this.visualizeRayCastEnabled = true;
  this.canvas.addEventListener('mousemove', this.visualizeRayCast);
};

SystemBrowser.prototype.visualizeRayCast =  function(e) {
  var camera = this.camera;
  var mouse = new THREE.Vector3()
  var raycaster = new THREE.Raycaster();

  mouse.set( e.clientX/window.innerWidth * 2 - 1,
             -e.clientY/window.innerHeight * 2 + 1,
             0.5);

  // Can't use real camera matrices since we need 64 bit precision
  var f64CamWorld = new THREE.Matrix4();
  var f64CamProjection = new THREE.Matrix4();
  f64CamWorld.elements = Float64Array.from(camera.matrixWorld.elements);
  f64CamProjection.elements = Float64Array.from(camera.projectionMatrix.elements);

  var f64Proj = new THREE.Matrix4();
  f64Proj.elements = Float64Array.from(f64Proj.elements);
  f64Proj.multiplyMatrices(f64CamWorld, f64Proj.getInverse(f64CamProjection));

  raycaster.ray.origin
    .setFromMatrixPosition(f64CamWorld);

  raycaster.ray.direction
    .set(mouse.x, mouse.y, 0.5)
    .applyProjection(f64Proj)
    .sub(raycaster.ray.origin).normalize();

  // why is camera position initally at Y=-2000?

  var pos = this.camera.position.clone();
  pos.add(raycaster.ray.direction.clone().setLength(this.auToPx/10));

  var intersects = this.camera
      .rayCast(this.scene.children, mouse)
      .filter(function(t) {
        return t.object.userData.body;
      });

  this.debugPosition(pos, intersects.length ? 0x00ff00 : 0xff0000);
};

THREE.PerspectiveCamera.prototype.rayCast = function(objects, mouse) {
  var raycaster = new THREE.Raycaster();

  var f64CamWorld = new THREE.Matrix4();
  var f64CamProjection = new THREE.Matrix4();
  f64CamWorld.elements = Float64Array.from(this.matrixWorld.elements);
  f64CamProjection.elements = Float64Array.from(this.projectionMatrix.elements);

  var f64Proj = new THREE.Matrix4();
  f64Proj.elements = Float64Array.from(f64Proj.elements);
  f64Proj.multiplyMatrices(f64CamWorld, f64Proj.getInverse(f64CamProjection));

  raycaster.ray.origin
    .setFromMatrixPosition(f64CamWorld);

  raycaster.ray.direction
    .set(mouse.x, mouse.y, 0.5)
    .applyProjection(f64Proj)
    .sub(raycaster.ray.origin).normalize();

  var intersects = raycaster
      .intersectObjects(objects, false)
      .filter(function(intersect) {
        return intersect.object.material.visible;
      });

  return intersects;
};
