/**
 * Expects Webpack to transpile ES6 JS. Otherwise, either:
 * 1) Write the codes in ES5, or
 * 2) Transpile independently
 */
import { rand, clamp, withinRect, getDistance, getSpeed, getAngle } from './utils'

// -------------------------------------------
// Custom HTMLElement Definitions
// -------------------------------------------

// Bringing a constructor and property descriptions to the top
// so that it may help others to grasp the whole idea quicker.
// (rest of the definitions are found at the bottom)

/** @constructor */
function FloatingParticles () {
  const superCtor = (typeof Reflect === 'object') ? function () {
    return Reflect.construct(HTMLElement, arguments, this.constructor);
  } : function () {
    return HTMLElement.apply(this, arguments) || this;
  };
  const $_ = superCtor.apply(this, arguments);
  $_.canvas = null;
  $_.ctx = null;
  $_.width = 1;
  $_.height = 1;
  $_.num = 1;
  $_.lt = Date.now();
  $_.dt = 1;
  $_.et = 0;
  $_.tick = 0;
  return $_;
}

FloatingParticles.prototype = Object.create(HTMLElement.prototype);
FloatingParticles.prototype.constructor = FloatingParticles;
Object.setPrototypeOf(FloatingParticles, HTMLElement);

Object.defineProperties(FloatingParticles, {
  observedAttributes: {
    get: () => (['width', 'height', 'num'])
  }
});

// -------------------------------------------
// Private
// -------------------------------------------

const DEFAULT_PARTICLE_SIZE = 3;

const requestAnimFrame = function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (a) { window.setTimeout(a, 1E3/60) }
}();

const int = Math.trunc;
const print = s => console.log(`[Particles] ${s}`);

let particles = [];

/**
 * Defines behaviors of each particle.
 * @private
 */
const createParticle = ({ ctx, index, width, height, size }) => {
  const acc = 0.1;
  const dec = 0.92;
  const vmax = 1;

  let pos = { x: rand(0, width), y: rand(0, height) };
  let dest = { x: rand(0, width), y: rand(0, height) };
  let vel = { x: rand(-0.4, 0.4), y: rand(-0.4, 0.4) };

  const draw = (dt) => {
    const angle = getAngle(dest, pos);
    const distance = getDistance(dest, pos);
    const speed = getSpeed(vel);

    if (distance < 40) {
      dest = { x: rand(0, width), y: rand(0, height) };
    }
    vel.x += Math.cos(angle) * acc;
    vel.y += Math.sin(angle) * acc;
    if (speed > vmax) {
      vel.x *= dec;
      vel.y *= dec;
    }
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;
    ctx.fillRect(pos.x, pos.y, size, size);
  };

  return { pos, vel, draw };
};

/**
 * Alternatively, instead of using a partial application
 * to pass the context beforehand (as this example does),
 * you may simply bind the context when you use it.
 * @private
 * @param {Object} [$_] Execution context (scope).
 * @params {Function}
 */
const reset = ($_, options) => () => {
  const { size = DEFAULT_PARTICLE_SIZE } = options || {};
  const { canvas, ctx } = $_;
  if (canvas) {
    const width = $_.getAttribute('width') || 0;
    const height = $_.getAttribute('height') || 0;
    $_.canvas.width = width;
    $_.canvas.height = height;
    $_.lt = Date.now();
    $_.dt = 1;
    $_.et = 0;
    $_.tick = 0;
    particles.length = 0;
    for (let i = 0; i < $_.num; i++) {
      particles.push(createParticle({
        ctx, index: i, width, height, size
      }));
    }
  }
}

let inProcess = false;

/**
 * @private
 * @param {Object} [$_] Execution context (scope).
 * @params {Function}
 */
const step = $_ => () => {
  if (inProcess) {
    return;
  }
  inProcess = true;

  requestAnimFrame(step($_));

  $_.ctx.globalCompositeOperation = 'destination-in';
  // http://hslpicker.com/#fff
  $_.ctx.fillStyle = 'hsla(0, 0%, 100%, 1)';
  $_.ctx.fillRect(0, 0, $_.width, $_.height);
  $_.ctx.globalCompositeOperation = 'lighter';

  particles.forEach(p => {
    p.draw($_.dt);
  });

  let now = Date.now();
  $_.dt = clamp((now - $_.lt) / (1000 / 60), 0.001, 10);
  $_.lt = now;
  $_.et += $_.dt;
  $_.tick++;

  inProcess = false;
};

// -------------------------------------------
// Custom HTMLElement (rest of the definitions)
// -------------------------------------------

// Defined at the bottom so that they can refer
// to private functions that are defined
// prior to this section using "const".
// (Ex. "reset", "step",  etc.)

function connectedCallback () {
  const template = `
    <div>
      <div class="title"><slot name="title">TITLE</slot></div>
    </div>
  `;
  const el = document.createElement('template');
  el.innerHTML = String.raw`${template}`;

  const root = this.attachShadow({ mode: 'open' });
  root.appendChild(el.content.cloneNode(true));

  const style = document.createElement('style');
  style.textContent = `
    floating-particles:not(:defined) {
      opacity: 0;
      transition: opacity 1.0s ease-in-out;
    }
    floating-particles {
      opacity: 100;
    }
    .title {
      margin-bottom: 0.2em;
      font-size: 1.4em;
    }
  `;
  root.appendChild(style);

  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  // http://hslpicker.com/#0458b9
  this.canvas.style.backgroundColor = '#0458b9';

  root.appendChild(this.canvas);

  root.addEventListener('click', reset(this));

  reset(this)();
  step(this)();
}

function disconnectedCallback () { }

function adoptedCallback () { }

function attributeChangedCallback (name, oldVal, newVal) {
  if (['width', 'height', 'num'].includes(name)) {
    if (name === 'num') {
      print(`New order! ----> ${newVal}`);
      this.num = newVal;
    }
    reset(this)();
  }
}

FloatingParticles.prototype.connectedCallback = connectedCallback;
FloatingParticles.prototype.disconnectedCallback = disconnectedCallback;
FloatingParticles.prototype.adoptedCallback = adoptedCallback;
FloatingParticles.prototype.attributeChangedCallback = attributeChangedCallback;

customElements.define('floating-particles', FloatingParticles);

export default FloatingParticles
