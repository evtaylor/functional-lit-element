import functionalElement, { html } from './dist/web/functionalElement.js';

const Test = () => html`<p>Hello World</p>`;
const TestElement = functionalElement(Test);
customElements.define('test-element', TestElement);