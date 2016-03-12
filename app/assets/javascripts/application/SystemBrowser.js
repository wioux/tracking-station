if (!Float64Array.from)
  Float64Array.from = function(array) {
    var result = new Float64Array(array.length);
    for (var i=0; i < array.length; ++i)
      result[i] = array[i];
    return result;
  };

SystemBrowser = function(ui, bodies, root, jd) {
  this.bodies = {};
  for (var i=0; i < bodies.length; ++i)
    this.bodies[bodies[i].id] = bodies[i];

  this.root = root;
  this.focus = root;
  this.rootPosition = new THREE.Vector3();

  this.initializeUi(ui, root);
  this.ui.system.setJulianDay(jd);

  this.update(jd);
  this.setFocus(root);

  this.clock = new Clock(jd, this.ui.system.state.warp);
  this.clock.setWarp(17).start();
  this.animate();
};

SystemBrowser.prototype.eachBody = function(action) {
  for (var id in this.bodies)
    action.call(this.bodies[id], this.bodies[id]);
};

SystemBrowser.prototype.update = function(jd) {
  this.ui.system.setJulianDay(jd);

  for (var bodyId in this.bodies) {
    var body = this.bodies[bodyId];

    if (body == this.root)
      continue;

    if (body.selectEphemeris(jd)) {
      this.bodies[body.orbit.ephemeris.central_body_id].addSatellite(body);
      body.flags &= ~Body.INVALID;
    } else if (body.orbit.body) {
      body.orbit.body.removeSatellite(body);
      body.flags |= Body.INVALID;
    }
  }

  this.root.updateObject3d(this, this.rootPosition);

  this.pan(this.camera.controls.target, true);
  this.render();
};

SystemBrowser.prototype.setFocus = function(body) {
  this.focus = body;
  this.camera.controls.target = body.object3d.position;
  this.camera.controls.minDistance = 2*body.bodyRadius(this);
  this.pan(body.object3d.position, function() { this.centerCoordinates() });

  this.ui.system.setFocus(body);
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


// private methods

SystemBrowser.prototype.initializeUi = function(ui, root) {
  this.auToPx = 1e3;

  this.createHtmlComponents(ui, root);
  this.createWebGLComponents(this.canvas, this.auToPx);

  var context = this;
  this.eachBody(function() { this.createObject3d(context) });

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

  this.ui = { system: systemPanel, tooltip: $(tooltip) };
  this.canvas = canvas;
};

SystemBrowser.prototype.createWebGLComponents = function(canvas, auToPx) {
  var scene = new THREE.Scene();
  scene.up.set(0, 0, 1);

  var camera = new THREE.PerspectiveCamera(
    70 /* fov */,
    window.innerWidth / window.innerHeight /* ar */,
    auToPx/1000000 /* near clip */, 100*auToPx /* far clip */
  );
  camera.up.set(0, 0, 1);
  camera.position.z = 2 * auToPx;
  this.focusPosition = new THREE.Vector3(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true,
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvas.appendChild(renderer.domElement);

  // Tuck controls under this.camera
  var self = this;
  camera.controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.controls.enablePan = false;
  camera.controls.zoomSpeed = 2.0;

  var light = new THREE.AmbientLight(0x1a1a1a);
  scene.add(light);

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

  var moveCount = 0;
  this.canvas.addEventListener('mousemove', function(e) {
    if ((moveCount = moveCount++ % 5))
      return;

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
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
    self.render();
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

SystemBrowser.prototype.hideBodyTooltip = function() {
  var changed = false;
  this.eachBody(function() { changed = this.unhighlight() || changed });

  this.ui.tooltip.css('display', 'none');
  changed && this.render();
};

SystemBrowser.prototype.showBodyTooltip = function(body) {
  var pos = body.object3d.position.clone().project(this.camera);
  this.ui.tooltip.text(body.name);
  this.ui.tooltip.css({
    left: window.innerWidth * (1 + pos.x) / 2,
    top: window.innerHeight * (1 - pos.y) / 2 + 20,
    display: 'block'
  });

  body.highlight();
  this.render();
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

THREE.PerspectiveCamera.prototype.rayCast = function() {
  var raycaster = new THREE.Raycaster();
  var f64CamWorld = new THREE.Matrix4();
  var f64CamProjection = new THREE.Matrix4();
  var f64Proj = new THREE.Matrix4();
  f64CamWorld.elements = Float64Array.from(f64CamWorld.elements);
  f64CamProjection.elements = Float64Array.from(f64CamProjection.elements);
  f64Proj.elements = Float64Array.from(f64Proj.elements);

  return function(objects, mouse) {
    for (var i=0; i < 16; ++i) {
      f64CamWorld.elements[i] = this.matrixWorld.elements[i];
      f64CamProjection.elements[i] = this.projectionMatrix.elements[i];
    }

    f64Proj.identity()
      .multiplyMatrices(f64CamWorld, f64Proj.getInverse(f64CamProjection));

    raycaster.ray.origin
      .setFromMatrixPosition(f64CamWorld);

    raycaster.ray.direction
      .set(mouse.x, mouse.y, 0.5)
      .applyProjection(f64Proj)
      .sub(raycaster.ray.origin).normalize();

    var intersects = raycaster
        .intersectObjects(objects, true)
        .filter(function(intersect) {
          return intersect.object.visible;
        });

    return intersects;
  }
}();
