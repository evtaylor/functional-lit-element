import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const props = {
    greeting: { type: String, reflect: true },
};

const ClickCounter = (props, hooks) => {
    const { useState } = hooks;

    const [numClicks, setNumClicks] = useState(0);

    return html`
        <h2>${props.greeting}</h2>
        <p>You have clicked: ${numClicks} times.</p>
        <button @click="${() => setNumClicks(numClicks + 1)}">Click Me</button>
        <button @click="${() => setNumClicks(0)}">Reset</button>
    `;
};

const ClickCounterComponent = functionalElement(ClickCounter, props);

customElements.define('click-counter', ClickCounterComponent);