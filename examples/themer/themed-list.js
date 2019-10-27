import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const props = {
    title: { type: String, reflect: true },
};

const ThemedList = (props, hooks) => {
    return html`
        <h5>${props.title}</h5>
        <ul>
            <themed-list-item>Some list item content one</themed-list-item>
        </ul>
    `;
};

const ThemedListComponent = functionalElement(ThemedList, props);

customElements.define('themed-list', ThemedListComponent);