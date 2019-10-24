import functionalElement, { html } from '../../dist/web/functionalElement.js';

const props = {
    testBool: { type: Boolean, reflect: true },
    testString: { type: String, reflect: true },
    testFunction: { type: Object },
};


const TestWithProps = (props) => {
    return html`
        <input type="checkbox" checked="${props.testBool}"/>
        <p>Hello ${props.testString}</p>
        <button @click="${props.testFunction}">Button</button>
    `;
};
const TestWithPropsElement = functionalElement(TestWithProps, props);
customElements.define('test-element-with-props', TestWithPropsElement);