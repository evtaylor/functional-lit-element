import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const Test = () => html`<p>Hello World</p>`;
const TestElement = functionalElement(Test);
customElements.define('test-element', TestElement);