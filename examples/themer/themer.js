import functionalElementFactory, { createContextFactory } from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';
import { directive, PropertyPart } from '../../web_modules/lit-html.js';

const functionalElement = functionalElementFactory(LitElement);
const createContext = createContextFactory(directive, PropertyPart);

const themes = {
    light: {
        foreground: '#000000',
        background: '#e5e5e5',
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
    },
};

const ThemeContext = createContext(themes.light);
export {
    ThemeContext
};

const props = {
    title: { type: String, reflect: true },
};

const Themer = (props, hooks) => {

    const { provideContext, useState } = hooks;
    const [theme, setTheme] = useState('light');
    const [test, setTest] = useState(false);

    const setContext = provideContext(ThemeContext, {
        theme: themes[theme],
        toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
    });

    return html`
        <h2>${props.title}</h2>
        <button @click="${() => setTheme('dark')}">Dark</button>
        <button @click="${() => setTheme('light')}">Light</button>
        <button @click="${() => setTest(!test)}">Wah</button> ${test}
        <div>
            <themed-list title="Super Themed List"></themed-list>
        </div>
    `;
};

const ThemerComponent = functionalElement(Themer, props);

customElements.define('my-themer', ThemerComponent);