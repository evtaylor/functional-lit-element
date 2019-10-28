import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';
import { ThemeContext } from "./themer.js";

const functionalElement = functionalElementFactory(LitElement);

const ThemedListItem = (props, hooks) => {
    const { useContext } = hooks;
    const { theme, toggleTheme } = useContext(ThemeContext);

    return html`
        <style>
            .list-item {
                display: inline-block;
                float: left;
                clear: both;
                padding: 5px 10px 5px 5px;
                margin: 5px;
                background-color: ${theme.background};
                color: ${theme.foreground}
            }
            .list-item slot {
                color: ${theme.foreground}
            }
        </style>
        <li class="list-item">
            <button @click="${() => toggleTheme()}">Toggle</button>
            <slot></slot>
        </li>
    `;
};

const ThemedListComponent = functionalElement(ThemedListItem);

customElements.define('themed-list-item', ThemedListComponent);