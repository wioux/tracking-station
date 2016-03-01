
window.$ = function(parent, selector) {
  return parent.querySelector(selector);
};

window.$$ = function(parent, selector) {
  return parent.querySelectorAll(selector);
};

window._ = function(tag, attrs, fn) {
  var el = document.createElement(tag);
  for (var key in (attrs || {})) {
    if (key == 'parent')
      attrs.parent.appendChild(el);
    else if (key == 'children')
      attrs[key].forEach(function(child) { el.appendChild(child) });
    else
      el.setAttribute(key, attrs[key]);
  }

  if (fn)
    fn(el);

  return el;
};
