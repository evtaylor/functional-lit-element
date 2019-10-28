import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const styles = css`
    .themed-list {
        list-style: none;
        padding: 0;
    }
`;

const props = {
    title: { type: String, reflect: true },
};

const ThemedList = (props) => {
    return html`
        <h5>${props.title}</h5>
        <ul class="themed-list">
            <themed-list-item>Toggle the theme from a child component</themed-list-item>
            <themed-list-item>Toggle the theme from a child component</themed-list-item>
            <themed-list-item>Toggle the theme from a child component</themed-list-item>
        </ul>
    `;
};

const ThemedListComponent = functionalElement(ThemedList, props, styles);

customElements.define('themed-list', ThemedListComponent);