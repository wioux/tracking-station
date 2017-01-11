
SystemBrowser = function(ui, bodies, root, jd) {
  this.bodies = {};
  for (var i=0; i < bodies.length; ++i)
    this.bodies[bodies[i].id] = bodies[i];

  this.root = root;
  this.focus = root;
  this.rootPosition = new THREE.Vector3();

  this.clock = new Clock();
  this.clock.setWarp(17);

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

SystemBrowser.SCALE = 1000; // 3d coordinates per AU

SystemBrowser.prototype.start = function(jd) {
  this.update(jd);

  if (!this.focus)
    this.setFocus(this.root);

  // This is magical but works pretty well
  this.camera.position.z = Math.pow(150 * this.focus.radius3d, 1.19);

  this.clock.start(jd);
  this.animate();
};

SystemBrowser.prototype.eachBody = function(action) {
  for (var id in this.bodies)
    action.call(this.bodies[id], this.bodies[id]);
};

SystemBrowser.prototype.update = function(jd) {
  var sys = this;
  var bodies = this.bodies;
  this.eachBody(function(body) {
    if (body == sys.root)
      return;

    var eph;
    if ((eph = body.ephemerides.select(jd)) && bodies[eph.central_body_id]) {
      body.orbit.load(eph);
      body.orbit.update(jd);
      bodies[eph.central_body_id].addSatellite(body);
      body.flags &= ~Body.INVALID;
    } else {
      body.orbit.body && body.orbit.body.removeSatellite(body);
      body.flags |= Body.INVALID;
    }
  });

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
  this.applyVisibilityFeatures()
  this.renderer.render(this.scene, this.camera);
};

SystemBrowser.prototype.createMilkyWay = function(texture) {
  var mesh = new THREE.Mesh();
  mesh.up.set(0, 0, 1);
  mesh.geometry = new THREE.SphereGeometry(1000000*SystemBrowser.SCALE, 3, 3);
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
                 this.canvas.clientHeight * (1 - pos.y) / 2,
                 0);
};

// private methods

SystemBrowser.prototype.createWebGLComponents = function(ui) {
  var canvas  = _('div', {
    'parent': ui,
    'class': 'canvas',
    'style': 'height: 100%; width: 100%'
  });
  this.canvas = canvas;

  var scene = new THREE.Scene();
  scene.up.set(0, 0, 1);
  this.scene = scene;

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true,
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvas.appendChild(renderer.domElement);
  this.renderer = renderer;

  var context = this;
  this.eachBody(function() { this.createObject3d(context) });

  var camera = new Camera(this);
  this.camera = camera;

  var light = new THREE.AmbientLight(0x1a1a1a);
  scene.add(light);
  this.light = light;

  if (!this.root.sun)
    this.setAmbientLight(0xffffff);
};

SystemBrowser.prototype.bindEvents = function() {
  var self = this, sys = this;

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
      self.clock.setWarp(self.clock.warp - (e.shiftKey ? 5 : 1));
      break;

    case 190:
      self.clock.setWarp(self.clock.warp + (e.shiftKey ? 5 : 1));
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

SystemBrowser.prototype.applyVisibilityFeatures = function() {
  var body, localSystem = this.focus.localSystem();
  var focusR = this.focus.indicator.deattenuate(this.camera.position,
                                                this.focus.highlighted ? 1.0 : 0.7);

  var context = this;
  this.eachBody(function() {
    this.setCollapseThreshold(context.camera.position, 2);
    this.indicator.deattenuate(context.camera.position, this.highlighted ? 1.0 : 0.7);
    this.setVisibility(!(this.flags & (Body.HIDDEN | Body.COLLAPSED | Body.INVALID)));

    if (localSystem.indexOf(this) == -1)
      this.orbit.indicator.setFade(focusR < 2.5 ? -0.01 : 0.01);
    else
      this.orbit.indicator.setFade(0);
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
  this.animator = this.animator || function() {
    var skip = 0;
    return function() {
      skip = (skip + 1) % 3;
      skip || sys.update(sys.clock.jd);
      sys.animate()
    };
  }();

  this.animationFrameRequest = requestAnimationFrame(this.animator);
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
  return this.debugPlane(position, Ecliptic.pole(SystemBrowser.SCALE/1000), 0x0000ff);
};

SystemBrowser.prototype.debugEquatorial = function(position, radius) {
  return this.debugPlane(position, Equatorial.pole(SystemBrowser.SCALE/1000), 0xffffff);
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
  pos.add(raycaster.ray.direction.clone().setLength(SystemBrowser.SCALE/10));

  var intersects = this.camera.rayCast(this.scene.children, mouse);
  this.debugPosition(pos, intersects.length ? 0x00ff00 : 0xff0000);
};
