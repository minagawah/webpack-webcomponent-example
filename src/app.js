import './style.css';
import './components/merely-nothing';
import './components/slightly-big-input';
import './components/floating-particles';

const DEFAULT_NUM_FO_PARTICLES = 19;

const int = Math.trunc;
const print = s => console.log(`[app] ${s}`);

let floating;

const debounce = (f, wait, ctx = null) => {
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

const reset = () => {
  if (floating) {
    const body = document.body;
    const { width: fullWidth = 0 } = (body && body.getBoundingClientRect()) || {};
    const ratio = 16/9;
    const width = int(fullWidth * 0.75);
    const height = int(width / ratio);
    print(`${width} x ${height}`);
    floating.setAttribute('width', width);
    floating.setAttribute('height', height);
  }
};

const onNumberChange = function () {
  const { value = 0 } = this;
  if (floating && value > 0) {
    floating.setAttribute('num', value);
  }
};

const init = () => {
  const el = document.querySelector('#num');
  if (el) {
    el.addEventListener('input', debounce(onNumberChange, 1000), false);
    const value = el.value = DEFAULT_NUM_FO_PARTICLES;
    if (value > 0) {
      setTimeout(onNumberChange.bind({ value }), 400);
    }
  }
  floating = document.querySelector('floating-particles');
  window.addEventListener('resize', debounce(reset, 400), false);
  reset();
};

customElements.whenDefined('floating-particles').then(() => {
  print('"floating-particles" is defined.');
  init();
});

