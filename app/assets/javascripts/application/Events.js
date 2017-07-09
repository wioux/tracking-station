
Events = function(proto) {
  var args = arguments.length === 1 ? [arguments[0]]
                                    : Array.apply(null, arguments),
      types = args.slice(1);

  proto.getEventListeners = function(type) {
    if (!this.eventListeners) {
      this.eventListeners = {};
      for (var i=0; i < types.length; ++i)
        this.eventListeners[types[i]] = [];
    }

    return this.eventListeners[type];
  };

  proto.addEventListener = function(type, callback) {
    this.getEventListeners(type).push(callback);
    return callback;
  };

  proto.removeEventListener = function(type, callback) {
    var listeners = this.getEventListeners(type);
    listeners.splice(listeners.indexOf(callback), 1);
  };

  proto.dispatchEvent = function(e) {
    var listeners = this.getEventListeners(e.type);
    for (var i=0; i < listeners.length; ++i)
      listeners[i](e);
  };

  proto.trigger = function(type) {
    this.dispatchEvent({ type: type });
  };
}
