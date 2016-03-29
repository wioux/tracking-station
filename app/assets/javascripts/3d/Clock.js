
Clock = function() {
  this.jd = null;
  this.warp = 1;
  this.updateInterval = 16;
  this.resetAfter = this.resetBefore = null;

  this.events = [];
};

Events(Clock.prototype, 'warp');

Clock.prototype.start = function(jd) {
  this.jd = jd;

  var self = this;
  this.intervalId = setInterval(function() { self.update() }, this.updateInterval);
  return this;
};

Clock.prototype.setWarp = function(n) {
  this.warp = n;
  this.dt = Math.sign(n);
  this.dt *= Math.pow(2, Math.abs(n)) / (24*60*60*1000 / this.updateInterval);
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

Clock.prototype.on = function(jd, callback) {
  this.events.push({ jd: jd, callback: callback });
};

// Private

Clock.prototype.update = function() {
  var jd0 = this.jd;
  this.jd += this.dt;

  if (jd0 <= this.jd)
    this.dispatchEvents(jd0, this.jd);
  else
    this.dispatchEvents(this.jd, jd0);

  if (this.resetAfter !== null && this.jd >= this.resetAfter)
    this.setWarp(this.warp);
  else if (this.resetBefore !== null && this.jd <= this.resetBefore)
    this.setWarp(this.warp);
};

Clock.prototype.dispatchEvents = function(t0, t1) {
  for (var e, i=0; i < this.events.length; ++i) {
    e = this.events[i];
    if (t0 <= e.jd && e.jd <= t1)
      e['callback']();
  }
};
