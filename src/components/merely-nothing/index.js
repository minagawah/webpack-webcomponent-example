/**
 * Unlike the other examples, this example intentionally places
 * "style.css" and "template.html" outside the module, expecting
 * the parent project is a Webpack project, and attempts to import
 * "style.css" and "template.html" using Webpack features.
 * It just illustrates how this is done, and means no more.
 * However, if you are not using Webpack, it means
 * that you need to have the followings done manually:
 * 1) Own transpiler for JS.
 * 2) Cross-browser descriptions for CSS.
 * 3) HTML template string (instead of importing the template).
 */
import './style.css';
import template from 'html-loader!./template.html';

// -------------------------------------------
// Custom HTMLElement Definitions
// -------------------------------------------

// Bringing a constructor and property descriptions to the top
// so that it may help others to grasp the whole idea quicker.
// (rest of the definitions are found at the bottom)

/** @constructor */
function MerelyNothing () {
  const superCtor = (typeof Reflect === 'object') ? function () {
    return Reflect.construct(HTMLElement, arguments, this.constructor);
  } : function () {
    return HTMLElement.apply(this, arguments) || this;
  };
  const $_ = superCtor.apply(this, arguments);
  $_.nothing = null;
  $_.padding = 0;
  $_.message = '';
  return $_;
}

MerelyNothing.prototype = Object.create(HTMLElement.prototype);
MerelyNothing.prototype.constructor = MerelyNothing;
Object.setPrototypeOf(MerelyNothing, HTMLElement);
Object.defineProperties(MerelyNothing, {
  observedAttributes: {
    get: () => (['padding', 'message'])
  }
});

// -------------------------------------------
// Private
// -------------------------------------------

const int = Math.trunc;
const print = s => console.log(`[Nothing] ${s}`);

/**
 * Alternatively, instead of using a partial application
 * to pass the context beforehand (as this example does),
 * you may simply bind the context when you use it.
 * @private
 * @param {Object} [$_] Execution context (scope).
 * @params {Function}
 */
const setPadding = $_ => (padding = 0) => {
  if ($_.nothing) {
    print(`padding: ${padding}px`);
    $_.nothing.style.padding = `${padding}px`;
  }
};

const setMessage = $_ => (message = '') => {
  if ($_.nothing) {
    print(`message: ${message}`);
    $_.nothing.innerHTML = message;
  }
};

// -------------------------------------------
// Custom HTMLElement (rest of the definitions)
// -------------------------------------------

// Defined at the bottom so that they can refer
// to private functions that are defined
// prior to this section using "const".
// (Ex. "setMessage", etc.)

function connectedCallback () {
  const el = document.createElement('template');
  const text = String.raw`${template}`;
  if (!text) throw new Error('No template.');
  el.innerHTML = text;

  const root = this.attachShadow({ mode: 'open' });
  root.appendChild(el.content.cloneNode(true));

  this.nothing = root.querySelector('#nothing');
  setPadding(this)(this.getAttribute('padding'));
  setMessage(this)(this.getAttribute('message'));
}

function disconnectedCallback () { }

function adoptedCallback () { }

function attributeChangedCallback (name, oldVal, newVal) {
  if (name === 'padding') {
    setPadding(this)(newVal);
  }
  if (name === 'message') {
    setMessage(this)(newVal);
  }
}

MerelyNothing.prototype.connectedCallback = connectedCallback;
MerelyNothing.prototype.disconnectedCallback = disconnectedCallback;
MerelyNothing.prototype.adoptedCallback = adoptedCallback;
MerelyNothing.prototype.attributeChangedCallback = attributeChangedCallback;

customElements.define('merely-nothing', MerelyNothing);

export default MerelyNothing
