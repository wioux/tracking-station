
OrbitIndicator = function(orbit) {
  this.orbit = orbit;
};

OrbitIndicator.prototype.createObject3d = function(ctx, color) {
  color = new THREE.Color(color);
  color = new THREE.Vector4(color.r, color.g, color.b, 1.0);

  var material = new THREE.ShaderMaterial({
    linewidth: 1.5,
    transparent: true,

    uniforms: {
      ta: { type: "f", value: 0.0 },
      trail: { type: "f", value: 0.0 },
      opacity: { type: "f", value: 1.0 },
      color: { type: "v4", value: color },
    },

    vertexShader: [
      "attribute float theta;",
      "varying float fragTheta;",

      "void main() {",
      "fragTheta = theta;",
      "  gl_Position = projectionMatrix *",
      "                modelViewMatrix *",
      "                vec4(position, 1.0);",
      "}"
    ].join("\n"),

    // need to change the behavior here for retrograde orbits
    fragmentShader: [
      "uniform float ta;",
      "uniform float trail;",
      "uniform float opacity;",
      "uniform vec4 color;",
      "varying float fragTheta;",

      "void main() {",
      "  float th;",
      "  if (ta < fragTheta)",
      "    th = 6.283185307179586 - (fragTheta - ta);",
      "  else",
      "    th = ta - fragTheta;",

      "  float pie = pow(1.0 - th / 6.283185307179586, trail);",

      "  gl_FragColor = opacity * pie * color;",
      "}"
    ].join("\n")
  });
  material.depthWrite = false;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(3*720), 3));
  geometry.addAttribute("theta", new THREE.BufferAttribute(new Float32Array(720), 1));

  this.object3d = new THREE.Line(geometry, material);
  this.orbit.body && this.orbit.body.object3d.add(this.object3d);
};

OrbitIndicator.prototype.updateObject3d = function(ctx) {
  if (!this.orbit.body)
    return;

  if (this.object3d.parent != this.orbit.body.object3d) {
    this.object3d.parent && this.object3d.parent.remove(this.object3d);
    this.orbit.body.object3d.add(this.object3d);
  }

  if (this.ephemeris != this.orbit.ephemeris) {
    this.ephemeris = this.orbit.ephemeris;

    if (this.orbit.ec < 1) {
      this.positionEllipticalGeometry();
      this.object3d.material.uniforms.trail.value = 0.1;
    } else {
      this.positionHyperbolicGeometry();
      this.object3d.material.uniforms.trail.value = 12.8;
    }
  }

  this.object3d.material.uniforms.ta.value = Math.PI*this.orbit.ta/180.0;
  this.object3d.material.uniforms.opacity.value = this.object3d.material.opacity;
};

OrbitIndicator.prototype.setFade = function(fade) {
  if (fade) {
    this.object3d.material.opacity += (fade < 0 ? -0.01 : 0.01);
    this.object3d.material.opacity = Math.min(1.0, this.object3d.material.opacity);
    this.object3d.material.opacity = Math.max(0, this.object3d.material.opacity);
  } else {
    this.object3d.material.opacity = 1.0;
  }
};

OrbitIndicator.prototype.setVisibility = function(visibility) {
  this.object3d && (this.object3d.visible = visibility);
};

// private

OrbitIndicator.prototype.positionHyperbolicGeometry = function() {
  var ec = this.orbit.ec,
      a = this.orbit.a,
      oa = this.orbit.oa,
      mja = this.orbit.mja,
      geometry = this.object3d.geometry,
      vertices = geometry.getAttribute("position").array,
      thetas = geometry.getAttribute("theta").array,
      scale = SystemBrowser.SCALE;

  var p = new THREE.Vector3();
  var maxn = 180.0 * Math.acos(-1/ec) / Math.PI - 0.001; // true anomaly at infinity
  for (var ta, r, i=0; i < vertices.length; i += 3) {
    ta = 2 * maxn * (i/3) / (vertices.length/3 - 1) - maxn;

    r = -a*(ec*ec - 1.0) /
        (1.0 - ec*Math.cos(Math.PI*(180.0 - ta) / 180.0));

    p
      .copy(mja)
      .applyAxisAngle(oa,  Math.PI*ta/180.0)
      .setLength(scale * r);

    vertices[i + 0] = p.x;
    vertices[i + 1] = p.y;
    vertices[i + 2] = p.z;
    thetas[i/3] = Math.PI * ta / 180.0;
  }

  geometry.getAttribute("position").needsUpdate = true;
  geometry.getAttribute("theta").needsUpdate = true;
};

OrbitIndicator.prototype.positionEllipticalGeometry = function() {
  var ec = this.orbit.ec,
      a = this.orbit.a,
      oa = this.orbit.oa,
      mja = this.orbit.mja,
      geometry = this.object3d.geometry,
      vertices = geometry.getAttribute("position").array,
      thetas = geometry.getAttribute("theta").array,
      scale = SystemBrowser.SCALE;

  var p = new THREE.Vector3();
  for (var ta, r, i=0; i < vertices.length; i += 3) {
    ta = 360.0 * (i/3) / (vertices.length/3 - 1);

    r = a*(1-ec*ec)/(1+ec*Math.cos(Math.PI*ta/180.0));

    p
      .copy(mja)
      .applyAxisAngle(oa, Math.PI*ta/180.0)
      .setLength(scale * r);

    vertices[i + 0] = p.x;
    vertices[i + 1] = p.y;
    vertices[i + 2] = p.z;
    thetas[i/3] = Math.PI * ta / 180.0;
  }

  geometry.getAttribute("position").needsUpdate = true;
  geometry.getAttribute("theta").needsUpdate = true;
};

OrbitIndicator.prototype.createGhost = function() {
  if (!this.object3d.parent)
    return null;

  var ghost = new THREE.Line();
  ghost.material = this.object3d.material.clone();
  ghost.geometry = this.object3d.geometry.clone();
  this.object3d.parent.add(ghost);
  return ghost;
};
