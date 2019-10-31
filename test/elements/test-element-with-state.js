import functionalElementFactory from '../../build/browser/functionalElement.js';
import { html, LitElement } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const TestWithState = (props, hooks) => {
    const { useState } = hooks;
    const [clicks, setClicks] = useState(0);

    return html`
        <p>Button clicked: <span>${clicks}</span></p>
        <button @click="${() => setClicks(clicks + 1)}">Button</button>
    `;
};

const TestWithStateElement = functionalElement(TestWithState);
customElements.define('test-element-with-state', TestWithStateElement);