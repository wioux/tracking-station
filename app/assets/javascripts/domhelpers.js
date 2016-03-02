
window._ = function(tag, attrs, fn) {
  var el = document.createElement(tag);
  for (var key in (attrs || {})) {
    if (key == 'parent' && attrs.parent.jquery)
      $(attrs.parent).append(el)
    else if (key == 'parent' && !attrs.parent.jquery)
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
