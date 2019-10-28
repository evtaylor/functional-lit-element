import functionalElementFactory, { createContext } from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

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

    const setContext = provideContext(
        ThemeContext,
        {
            theme: themes[theme],
            toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
        }
    );

    return html`
        <h2>${props.title}</h2>
        <p>Set the theme from parent</p>
        <button @click="${() => setTheme('dark')}">Dark</button>
        <button @click="${() => setTheme('light')}">Light</button>
        <div>
            <themed-list title="Super Themed List"></themed-list>
        </div>
    `;
};

const ThemerComponent = functionalElement(Themer, props);

customElements.define('my-themer', ThemerComponent);