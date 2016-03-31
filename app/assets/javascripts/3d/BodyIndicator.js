
BodyIndicator = function(body) {
  this.body = body;
  this.radius3d = SystemBrowser.SCALE * Math.tan(1 * Math.PI / 180.0);
};

BodyIndicator.prototype.createObject3d = function(sys) {
  if (this.body.sprite)
    this.object3d = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: sys.loadTexture(this.body.sprite) })
    );
  else
    this.object3d = new THREE.Mesh(
      new THREE.BufferGeometry().fromGeometry(
        new THREE.SphereGeometry(this.radius3d, 18, 18)
      ),
      new THREE.MeshBasicMaterial({
        color: this.body.color,
        transparent: true
      })
    );

  this.object3d.userData.body = this.body;
  this.body.object3d.add(this.object3d);
};

BodyIndicator.prototype.deattenuate = function(camPos, arc) {
  var scale = SystemBrowser.SCALE;
  var camDistance = camPos.distanceTo(this.body.object3d.position);
  var newRadius = Math.tan(arc * Math.PI / 180.0) * camDistance;

  var m = this.body.sprite ? 60 : 1;
  this.object3d.scale.set(m*newRadius/this.radius3d,
                          m*newRadius/this.radius3d,
                          m*newRadius/this.radius3d);

  return newRadius / this.body.radius3d;
};

BodyIndicator.prototype.setVisibility = function(visibility) {
  this.object3d.visible = visibility;
};
