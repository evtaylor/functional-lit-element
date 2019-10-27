import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';
import { ThemeContext } from "./themer.js";

const functionalElement = functionalElementFactory(LitElement);

const ThemedListItem = (props, hooks) => {
    const { useContext } = hooks;
    const contextData = useContext(ThemeContext);
    const { theme, toggleTheme } = contextData;
    console.log('re-rendered')
    return html`
        <style>
            .list-item {
                background-color: ${contextData.theme.background};
                color: ${theme.foreground}
            }
            .list-item slot {
                color: ${theme.foreground}
            }
        </style>
        <li class="list-item">
            <slot></slot>
            <button @click="${() => toggleTheme()}">Toggle</button>
        </li>
    `;
};

const ThemedListComponent = functionalElement(ThemedListItem);

customElements.define('themed-list-item', ThemedListComponent);