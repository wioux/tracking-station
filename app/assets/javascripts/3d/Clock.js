
Clock = function() {
  this.jd = null;
  this.warp = 1;
  this.updateInterval = 16;
  this.resetAfter = this.resetBefore = null;
};

Events(Clock.prototype, 'warp');

Clock.prototype.start = function(jd) {
  this.jd = jd;

  var self = this;
  this.intervalId = setInterval(function() { self.update() }, this.updateInterval);
  return this;
};

Clock.prototype.setWarp = function(n) {
  this.warp = n = Math.max(0, n);
  this.dt = Math.pow(2, n) / (24*60*60*1000 / this.updateInterval);
  this.resetAfter = this.resetBefore = null;
  this.dispatchEvent({ type: 'warp', warp: n });
  return this;
};

Clock.prototype.warpTo = function(t1) {
  this.dt = (t1 - this.jd) / (2000 / this.updateInterval);
  this.dispatchEvent({ type: 'warp', warp: '(auto)' });

  if (t1 < this.jd) {
    this.resetBefore = t1;
    this.resetAfter = null;
  } else {
    this.resetAfter = t1;
    this.resetBefore = null;
  }
  return this;
};

// Private

Clock.prototype.update = function() {
  this.jd += this.dt;
  if (this.resetAfter !== null && this.jd >= this.resetAfter)
    this.setWarp(this.warp);
  else if (this.resetBefore !== null && this.jd <= this.resetBefore)
    this.setWarp(this.warp);
};
