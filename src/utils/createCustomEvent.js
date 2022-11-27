const createCustomEvent = (eventName, detail) => new CustomEvent(eventName, { detail });

export default createCustomEvent;
