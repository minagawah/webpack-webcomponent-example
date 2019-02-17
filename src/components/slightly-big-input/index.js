/**
 * Expects Webpack to transpile ES6 JS. Otherwise, either:
 * 1) Write the codes in ES5, or
 * 2) Transpile independently
 */

// -------------------------------------------
// Custom HTMLInputElement Definitions
// -------------------------------------------

// Bringing a constructor and property descriptions to the top
// so that it may help others to grasp the whole idea quicker.
// (rest of the definitions are found at the bottom)

/** @constructor */
function SlightlyBigInput () {
  const superCtor = (typeof Reflect === 'object') ? function () {
    return Reflect.construct(HTMLInputElement, arguments, this.constructor);
  } : function () {
    return HTMLInputElement.apply(this, arguments) || this;
  };
  return superCtor.apply(this, arguments);
}

SlightlyBigInput.prototype = Object.create(HTMLInputElement.prototype);
SlightlyBigInput.prototype.constructor = SlightlyBigInput;
Object.setPrototypeOf(SlightlyBigInput, HTMLInputElement);
Object.defineProperties(SlightlyBigInput, {
  observedAttributes: {
    get: () => (['disabled'])
  },
  disabled: {
    get: function () {
      return this.shadowRoot.hasAttribute('disabled');
    },
    set: function (val) {
      print(`"disabled" is set: ${val}`)
      if (val) {
        this.shadowRoot.setAttribute('disabled', '');
      } else {
        this.shadowRoot.removeAttribute('disabled');
      }
    }
  }
});

// -------------------------------------------
// Private
// -------------------------------------------

const print = s => console.log(`[Slightly] ${s}`);

// -------------------------------------------
// Custom HTMLInputElement (rest of the definitions)
// -------------------------------------------

// Defined at the bottom so that they can refer
// to private functions that are defined
// prior to this section using "const".
// (Ex. "reset", "step",  etc.)

function connectedCallback () {
  this.style = 'font-size: 1.5em;';
}

function disconnectedCallback () { }

function adoptedCallback () { }

function attributeChangedCallback () {}

SlightlyBigInput.prototype.connectedCallback = connectedCallback;
SlightlyBigInput.prototype.disconnectedCallback = disconnectedCallback;
SlightlyBigInput.prototype.adoptedCallback = adoptedCallback;
SlightlyBigInput.prototype.attributeChangedCallback = attributeChangedCallback;

customElements.define('slightly-big-input', SlightlyBigInput, { extends: 'input' });

export default SlightlyBigInput
