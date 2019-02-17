/* eslint camelcase: [0] */

export const rand = (min, max) => Math.random() * (max - min) + min;
export const randInt = (min, max) => Math.trunc(Math.random() * (max - min + 1)) + min;

// Get the norm for "val" between "min" and "max".
// Ex. norm(75, 0, 100) ---> 0.75
export const norm = (val, min, max) => (val - min) / (max - min);

// Apply "norm" (the linear interpolate value) to the range
// between "min" and "max" (usually between "0" and "1").
// Ex. lerp(0.5, 0, 100) ---> 50
export const lerp = (norm, min, max) => min + (max - min) * norm;

// Limit the value to a certain range.
// Ex. clamp(5000, 0, 100) ---> 100
export const clamp = (val, min, max) => Math.min(
  Math.max(val, Math.min(min, max)),
  Math.max(min, max)
);

// Get a distance between two points.
export const getDistance = (p1, p2) => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt((dx * dx) + (dy * dy));
};

export const toDeg = a => a * (180 / Math.PI);
export const toRad = a => a * (Math.PI / 180);

// Get an angle from "p2" to "p1" (in radian).
// Ex. toDeg(getAngle({ x: 10, y: 10 }, { x: 0, y: 0 })) ---> 45
export const getAngle = (p1, p2) => Math.atan2(p1.y - p2.y, p1.x - p2.x);

// Check if the value falls within the given range.
export const withinRange = (val, min, max) => (val >= min && val <= max);

// Check if "x" and "y" falls into the bounds made by "rect".
export const withinRect = (p, rect) => (
  withinRange(p.x, rect.x, rect.x + rect.width) &&
    withinRange(p.y, rect.y, rect.y + rect.height)
);

// Check if the given point falls within the arc's radius.
export const withinArc = (p, a) => getDistance(p, a) <= a.radius;

/**
 * @param {Function} [f] A function to debounce.
 * @param {number} [wait] Time to suppress the call.
 * @param {Object} [ctx] When you want to bind to a certain scope.
 */
export const debounce = (f, wait, ctx = null) => {
  let timeout = null;
  let args = null;
  const g = () => Reflect.apply(f, ctx, args);
  return function (...o) {
    ctx = ctx || this || {}; // Use the bound context (if there is one).
    args = o;
    if (timeout) {
      clearTimeout(timeout);
    }
    else {
      g();
    }
    timeout = setTimeout(g, wait);
  };
};

export default {
  rand,
  randInt,
  norm,
  lerp,
  clamp,
  getDistance,
  toDeg,
  toRad,
  getAngle,
  withinRange,
  withinRect,
  withinArc,
  debounce
}
