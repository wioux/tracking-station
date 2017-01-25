
PlanetaryRing = function(innerRadiusKm, outerRadiusKm) {
  this.innerRadiusKm = innerRadiusKm;
  this.outerRadiusKm = outerRadiusKm;
  this.texture = null;
};

PlanetaryRing.prototype.updateObject3d = function() {
  var sunline = new THREE.Vector3();

  return function(ctx, body) {
    // this assumes Sun is root and has already been positioned
    sunline.copy(ctx.root.object3d.position)
      .sub(body.object3d.position).normalize();

    if (this.body.northPole) {
      var ecliptic = new THREE.Plane(Ecliptic.NORTH);
      var np = this.body.northPole.clone().normalize();
      var ray = new THREE.Ray( this.body.object3d.position.clone(), np );
  
      var plane = new THREE.Plane(this.body.northPole, -0.005);

      var p = sunline.clone().cross(this.body.northPole);
      var correction = sunline.clone().multiplyScalar(0.001);
      for (var th, i=0; i < this.shadow.geometry.vertices.length; ++i) {
        th = i * 2 * Math.PI / this.shadow.geometry.vertices.length;
        ray.origin.set(p.x, p.y, p.z)
          .applyAxisAngle(sunline, th)
          .normalize().multiplyScalar(-1.05 * this.body.radius3d);

        ray.direction.copy(sunline).multiplyScalar(-1);
        ray.intersectPlane(plane, this.shadow.geometry.vertices[i]);

        while (this.shadow.geometry.vertices[i].length() > 1.01 * this.outerRadiusKm/Orbit.KM_PER_AU*SystemBrowser.SCALE)
          this.shadow.geometry.vertices[i].add(correction);

        while (this.shadow.geometry.vertices[i].length() < 0.95 * this.innerRadiusKm/Orbit.KM_PER_AU*SystemBrowser.SCALE)
          this.shadow.geometry.vertices[i].sub(correction);

//        ctx.debugPosition(this.shadow.geometry.vertices[i].clone().add(body.object3d.position));
      }
  
      this.shadow.geometry.verticesNeedUpdate = true;
    }
  };
}();

PlanetaryRing.prototype.createObject3d = function(ctx, body) {
  var emissivecolor = 0xffffff;
  this.object3d = new THREE.Object3D();
  this.object3d.up.set(0, 0, 1);
  this.object3d.rotation.set(-Math.PI/2, 0, 0);

  this.object3d.ring = new THREE.Mesh();
  this.object3d.ring.up.set(0, 0, 1);

  this.object3d.ring.geometry =
    new THREE.SweptRingGeometry(SystemBrowser.SCALE*this.innerRadiusKm/Orbit.KM_PER_AU,
                                SystemBrowser.SCALE*this.outerRadiusKm/Orbit.KM_PER_AU,
                                30, 30);
  this.object3d.ring.material = new THREE.MeshPhongMaterial({
    map: ctx.loadTexture(this.texture),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55,
    emissive: emissivecolor,
    emissiveMap: ctx.loadTexture(this.texture),
    emissiveIntensity: 0.4
  });

  this.object3d.add(this.object3d.ring);
  body.object3d.add(this.object3d);

  var shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  this.shadow = new THREE.Mesh(new THREE.Geometry(), shadowMat);

  for (var i=0; i < 35; ++i)
    this.shadow.geometry.vertices.push(new THREE.Vector3());

  var F = 17;
  this.shadow.geometry.faces.push(new THREE.Face3(0, 1, F));
  this.shadow.geometry.faces.push(new THREE.Face3(0, 1, F-1));
  this.shadow.geometry.faces.push(new THREE.Face3(1, F-1, F));

  this.shadow.geometry.faces.push(new THREE.Face3(1, F-2, F-1));

  this.shadow.geometry.faces.push(new THREE.Face3(1, 2, F-2));
  this.shadow.geometry.faces.push(new THREE.Face3(2, F-3, F-2));

  this.shadow.geometry.faces.push(new THREE.Face3(2, 3, F-3));
  this.shadow.geometry.faces.push(new THREE.Face3(3, F-4, F-3));

  this.shadow.geometry.faces.push(new THREE.Face3(3, 4, F-4));
  this.shadow.geometry.faces.push(new THREE.Face3(4, F-5, F-4));

  this.shadow.geometry.faces.push(new THREE.Face3(4, 5, F-5));
  this.shadow.geometry.faces.push(new THREE.Face3(5, F-6, F-5));

  this.shadow.geometry.faces.push(new THREE.Face3(5, 6, F-6));
  this.shadow.geometry.faces.push(new THREE.Face3(6, F-7, F-6));

  this.shadow.geometry.faces.push(new THREE.Face3(6, 7, F-7));
  this.shadow.geometry.faces.push(new THREE.Face3(7, F-8, F-7));

  this.shadow.geometry.faces.push(new THREE.Face3(7, 8, 9));

  body.object3d.add(this.shadow);

  this.body = body;
};
