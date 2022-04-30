const triggerEvent = (el, type) => {
  // IE9+ and other modern browsers
  if ('createEvent' in document) {
    const e = new Event(type);
    el.dispatchEvent(e);
  } else {
    // IE8
    const e = document.createEventObject();
    e.eventType = type;
    el.fireEvent(`on${e.eventType}`, e);
  }
};

module.exports.triggerEvent = triggerEvent;
