
Ephemerides = function(body) {
  this.body = body;
  this.store = [];
  this.coverage = [];
  this.start = null;
};

Ephemerides.prototype.addAll = function(ephs) {
  for (var i=0; i < ephs.length; ++i)
    this.store.push(ephs[i]);
};

Ephemerides.prototype.add = function(eph) {
  this.store.push(eph);
};

Ephemerides.prototype.select = function(jd) {
  var mid, low = 0, high = this.store.length;
  while (low != high) {
    mid = Math.floor((low + high) / 2);
    if (this.store[mid].jd <= jd)
      low = mid + 1;
    else
      high = mid;
  }
  return low > 0 && this.store[low-1];
};
