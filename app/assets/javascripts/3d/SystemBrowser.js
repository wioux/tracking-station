
SystemBrowser = function(ui, bodies, root, jd) {
  this.bodies = {};
  for (var i=0; i < bodies.length; ++i)
    this.bodies[bodies[i].id] = bodies[i];

  this.root = root;
  this.focus = root;
  this.rootPosition = new THREE.Vector3();

  this.clock = new Clock();

  this.createWebGLComponents(ui);
  this.bindEvents();
};

Events(
  SystemBrowser.prototype,
  'update',
  'highlight',
  'unhighlight',
  'focus',
  'mousemove'
);

SystemBrowser.prototype.start = function(jd) {
  this.update(jd);
  this.setFocus(this.root);

  this.clock.setWarp(17).start(jd);
  this.animate();
};

SystemBrowser.prototype.eachBody = function(action) {
  for (var id in this.bodies)
    action.call(this.bodies[id], this.bodies[id]);
};

SystemBrowser.prototype.update = function(jd) {
  for (var bodyId in this.bodies) {
    var body = this.bodies[bodyId];

    if (body == this.root)
      continue;

    if (body.selectEphemeris(jd)) {
      this.bodies[body.orbit.ephemeris.central_body_id].addSatellite(body);
      body.flags &= ~Body.INVALID;
    } else {
      body.orbit.body && body.orbit.body.removeSatellite(body);
      body.flags |= Body.INVALID;
    }
  }

  this.root.updateObject3d(this, this.rootPosition);

  this.pan(this.camera.controls.target, true);
  this.dispatchEvent({ type: 'update', jd: jd });
  this.render();
};

SystemBrowser.prototype.setFocus = function(body) {
  this.focus = body;
  this.camera.setTarget(body);
  this.pan(body.object3d.position, function() { this.centerCoordinates() });
  this.dispatchEvent({ type: 'focus', body: body });
};

SystemBrowser.prototype.setAmbientLight = function(color) {
  this.light.color = new THREE.Color(color);
};

SystemBrowser.prototype.render = function() {
  this.applyVisibilityFlags()
  this.renderer.render(this.scene, this.camera);
};

SystemBrowser.prototype.createMilkyWay = function(texture) {
  var mesh = new THREE.Mesh();
  mesh.up.set(0, 0, 1);
  mesh.geometry = new THREE.SphereGeometry(1000000*this.auToPx, 3, 3);
  mesh.material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
    map: this.loadTexture(texture),
    transparent: true,
    opacity: 0.4
  });

  var np, q;
  np = Coord.equ(180.86, 27.13);
  q = new THREE.Quaternion().setFromUnitVectors(Ecliptic.SOLSTICE, np);
  mesh.rotation.setFromQuaternion(q);

  // this is not quite right, but ok for now
  mesh.rotateOnAxis(Ecliptic.SOLSTICE, 190*Math.PI/180.0);

  this.scene.add(mesh);
};


SystemBrowser.prototype.project = function(position) {
  var pos = position.clone().project(this.camera);
  return pos.set(this.canvas.clientWidth * (1 + pos.x) / 2,
                 this.canvas.clientHeight * (1 - pos.y) / 2 + 20,
                 0);
};

// private methods

SystemBrowser.prototype.createWebGLComponents = function(ui) {
  this.auToPx = 1e3;

  var canvas  = _('div', {
    'parent': ui,
    'class': 'canvas',
    'style': 'height: 100%; width: 100%'
  });
  this.canvas = canvas;

  var scene = new THREE.Scene();
  scene.up.set(0, 0, 1);
  this.scene = scene;

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true,
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvas.appendChild(renderer.domElement);
  this.renderer = renderer;

  var camera = new Camera(this);
  // This is magical but works pretty well
  camera.position.z = Math.pow(150 * this.root.bodyRadius(this), 1.19);
  this.focusPosition = new THREE.Vector3(0, 0, 0);
  this.camera = camera;

  var light = new THREE.AmbientLight(0x1a1a1a);
  scene.add(light);
  this.light = light;

  var context = this;
  this.eachBody(function() { this.createObject3d(context) });
};

SystemBrowser.prototype.bindEvents = function() {
  var self = this;

  this.canvas.addEventListener('mousedown', function(e) {
    var mouse = self.localizeMouse(e);
    var intersects = self.camera.rayCast(self.scene.children, mouse);
    if (intersects.length)
      self.setFocus(intersects[0].object.userData.body);
  });

  var moveCount = 0;
  this.canvas.addEventListener('mousemove', function(e) {
    if ((moveCount = moveCount++ % 5))
      return;

    var changed = false;
    sys.eachBody(function() { changed = this.unhighlight() || changed });
    changed && self.dispatchEvent({ type: 'unhighlight' });

    var mouse = self.localizeMouse(e);
    var intersects = self.camera.rayCast(self.scene.children, mouse);
    if (intersects.length) {
      var body = intersects[0].object.userData.body;
      var pos = self.project(body.object3d.position);
      self.dispatchEvent({ type: 'highlight',
                           body: body,
                           layerX: pos.x,
                           layerY: pos.y
                         });
      body.highlight();
    }
  });

  document.addEventListener('keydown', function(e) {
    switch(e.which) {
    case 188:
      self.clock.setWarp(self.clock.warp - 1);
      break;

    case 190:
      self.clock.setWarp(self.clock.warp + 1);
      break;
    }
  });

  this.canvas.addEventListener('mousemove', function(e) {
    self.visualizeRayCastEnabled && self.visualizeRayCast(e);
  });

  window.addEventListener('resize', function() {
    self.camera.aspect = self.canvas.clientWidth / self.canvas.clientHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(self.canvas.clientWidth, self.canvas.clientHeight);
  }, false);
};

SystemBrowser.prototype.pan = function() {
  var connect = new THREE.Vector3();
  var direction = new THREE.Vector3();
  var ds = new THREE.Vector3();
  var focusPosition = new THREE.Vector3();

  return function(position, immediate, callback) {
    connect.copy(position).sub(focusPosition);
    direction.copy(connect).normalize();
    focusPosition.copy(position);

    if (typeof immediate == 'function') {
      callback = immediate;
      immediate = false;
    }

    if (immediate) {
      this.camera.position.add(connect);
      return callback && callback.call(this);
    }

    var steps = 15;
    ds.copy(connect).multiplyScalar(1 / steps);

    var self = this;
    var animate = function() {
      self.camera.position.add(ds);

      if (--steps)
        requestAnimationFrame(animate);
      else
        callback && callback.call(self);
    };

    animate();
  };
}();

SystemBrowser.prototype.centerCoordinates = function() {
  this.rootPosition.sub(this.focus.object3d.position);
};

SystemBrowser.prototype.applyVisibilityFlags = function() {
  var body, localSystem = this.focus.localSystem();
  var focusR = this.focus.scaleIndicator(this, this.camera.position, 2);
  var fadeOpacity = Math.min(0.5, focusR / 9.0);
  fadeOpacity = (fadeOpacity < 0.025) ? 0 : fadeOpacity;

  var context = this;
  this.eachBody(function() {
    if (this.flags & Body.INVALID)
      return this.setVisibility(false);

    this.scaleIndicator(context, context.camera.position, this.highlighted ? 1.0 : 0.7);
    this.setVisibility(!(this.flags & (Body.HIDDEN | Body.FADED)));

    if (localSystem.indexOf(this) == -1) {
      this.setOrbitOpacity(fadeOpacity);
      this.setIndicatorOpacity(this == context.root || this.major ? 0.5 : fadeOpacity);
      if (fadeOpacity == 0) {
        this.setOrbitVisibility(false);
        this == context.root || this.major || this.setIndicatorVisibility(false);
      }
    } else {
      this.setOrbitOpacity(0.5);
      this.setIndicatorOpacity(0.5);
    }
  });
};

SystemBrowser.prototype.loadTexture = function(path) {
  if (!this._textureLoader) {
    this._textureLoader = new THREE.TextureLoader();
    this._textureLoader.crossOrigin = true;
  }

  return this._textureLoader.load(path);
};

SystemBrowser.prototype.animate = function() {
  var sys = this;
  this.animator = this.animator || function() { sys.animate() };

  this.animationFrameRequest = requestAnimationFrame(this.animator);
  this.update(this.clock.jd);
};

SystemBrowser.prototype.stopAnimation = function() {
  cancelAnimationFrame(this.animationFrameRequest);
};

SystemBrowser.prototype.localizeMouse = function(e) {
  var parentOff = $(this.canvas).offset();
  var x = e.pageX - parentOff.left;
  var y = e.pageY - parentOff.top;
  var mouse = new THREE.Vector3( x / this.canvas.clientWidth * 2 - 1,
                                -(y / this.canvas.clientHeight * 2 - 1),
                                 0.5);
  return mouse;
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
  return points;
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
  return line;
};

SystemBrowser.prototype.debugPlane = function(position, normal, color) {
  var planemat = new THREE.MeshBasicMaterial({
    color: color || 0xff0000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2
  });
  var wiremat = new THREE.MeshBasicMaterial({
    color: color || 0xff0000,
    side: THREE.DoubleSide,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  })

  var radius = normal.length();
  var rings = new THREE.Object3D();
  geo = new THREE.RingGeometry(0.1, radius, 360/5, 1);
  mesh = new THREE.Mesh(geo, planemat);
  mesh.add(new THREE.Mesh(geo, wiremat));
  rings.add(mesh);

  mesh = new THREE.Mesh(geo, planemat);
  mesh.add(new THREE.Mesh(geo, wiremat));
  mesh.rotation.x += Math.PI/2;
  rings.add(mesh);

  rings.position.add(position);

  var q = new THREE.Quaternion();
  q.setFromUnitVectors(Ecliptic.pole().normalize(), normal.clone().normalize());
  rings.rotation.setFromQuaternion(q);

  this.scene.add(rings);

  this.render();
  return rings;
};


SystemBrowser.prototype.debugEcliptic = function(position, radius) {
  return this.debugPlane(position, Ecliptic.pole(this.auToPx/1000), 0x0000ff);
};

SystemBrowser.prototype.debugEquatorial = function(position, radius) {
  return this.debugPlane(position, Equatorial.pole(this.auToPx/1000), 0xffffff);
};

SystemBrowser.prototype.debugRayCast = function() {
  if (this.visualizeRayCastEnabled) {
    console.log('stopping ray cast visualization');
    this.visualizeRayCastEnabled = false;
  } else {
    console.log('visualizing ray casts');
    this.visualizeRayCastEnabled = true;
  }
};

SystemBrowser.prototype.visualizeRayCast =  function(e) {
  var camera = this.camera;
  var mouse = this.localizeMouse(e);
  var raycaster = new THREE.Raycaster();

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

  var intersects = this.camera.rayCast(this.scene.children, mouse);
  this.debugPosition(pos, intersects.length ? 0x00ff00 : 0xff0000);
};