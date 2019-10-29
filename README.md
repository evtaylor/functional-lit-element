# Functional LitElement
A wrapper for [LitElement](https://github.com/Polymer/lit-element) which provides an API similar to React functional components. 

[![CircleCI](https://circleci.com/gh/evtaylor/functional-lit-element.svg?style=svg)](https://circleci.com/gh/evtaylor/functional-lit-element)


## Overview
The goal of Functional LitElement is to create web components from simple functions which receive some props and return some html (via a `TemplateResult`) which gets rendered into the DOM. Functional Lit Elements have access to 4 "Hooks" which allow for controlled side effects in the functional component and can be used in a similar way to React's [Hooks](https://reactjs.org/docs/hooks-intro.html).

## Usage
### Example
```js
import functionalLitElement from 'functional-lit-element';
import { html } from 'lit-element';

const properties = {
    greeting: { type: String, reflect: true }
};

const Component = (props, hooks) => {
    const { useState } = hooks;
    const [numClicks, setNumClicks] = useState(0);

    return html`
        <h2>${props.greeting}</h2>
        <p>You have clicked: ${numClicks} times.</p>
        <button @click="${() => setNumClicks(numClicks + 1)}">Click Me</button>
    `;
};

const MyComponent = functionalLitElement(Component, properties);
customElements.define('my-component', MyComponent);
```

### Syntax
```js
functionalLitElement(render, props = {}, styles = [])
```

#### Parameters
#### `render`
- A function `function(props, hooks)`
  - `props` _Optional_ object map containing the properties you specified
  - `hooks` _Optional_ object containing 4 hooks
  - **return**  `TemplateResult` produced using Lit Element's `html` [function](https://lit-html.polymer-project.org/api/modules/lit_html.html#html)
  
#### `props` _Optional_
- Object defining the components [properties](https://lit-element.polymer-project.org/guide/properties#declare)

#### `styles` _Optional_
 - `CSSResult` or array of `CSSResult` produced using Lit Element's `css` [function](https://lit-element.polymer-project.org/api/modules/_lib_css_tag_.html)

#### Return value
A JS class (constructor) which can be used to register the custom element in the browser.
```js
const Component = () => html`<h1>Hello World</h1>`;
const MyComponent = functionalLitElement(Component);
customElements.define('my-component', MyComponent);
``` 


## Usage Notes

### Properties
Properties are declared exactly the same as a Lit Element. See the Lit Element properties [documentation](https://lit-element.polymer-project.org/guide/properties) for more info. The properties you declare determine the "props" which will be provided as the first argument of your functional component.

### Styles
Styles are also declared exactly the same as a Lit Element. See the Lit Element styles [documentation](https://lit-element.polymer-project.org/guide/styles). The styles you provide are automatically scoped to your components shadow DOM tree and don't affect other elements.

### Hooks
There are 4 hooks available to your functional component as your render function's second argument.
- `useState`
- `useEffect`
- `useReducer`
- `useContext`

### `useState`
The `useState` hook is a function that creates some state with an initial value that you provide and returns an array which can be destructured into the current state value and a function to update the state. You can use this hook multiple times to create multiple different state variables.
```js
const Component = (props, hooks) => {
    const { useState } = hooks;
    const [numClicks, setNumClicks] = useState(0);

    return html`
        <h2>${props.greeting}</h2>
        <p>You have clicked: ${numClicks} times.</p>
        <button @click="${() => setNumClicks(numClicks + 1)}">Click Me</button>
    `;
};
```

### `useEffect`
The useEffect hook allows you to perform some work after render. The function (the "effect") you provide gets executed as a promise after the render function executes. Effects have access to state and other variables in your component.

```js
const Component = (props, hooks) => {
    const { useState, useEffect } = hooks;

    const [numClicks, setNumClicks] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${numClicks} times`;
    });

    return html`
        <h2>${props.greeting}</h2>
        <p>You have clicked: ${numClicks} times.</p>
        <button @click="${() => setNumClicks(numClicks + 1)}">Click Me</button>
    `;
};
```
You can pass an optional second argument to useEffect specifying an array of values. If none of the values in the array have changed since the last render then the effect will be skipped. An empty array means the effect will run only once when the component first renders.
```js
const Component = (props, hooks) => {
    const { useState, useEffect } = hooks;

    const [numClicks, setNumClicks] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${numClicks} times`;
    }, [count]);

    return html`
        <h2>${props.greeting}</h2>
        <p>You have clicked: ${numClicks} times.</p>
        <button @click="${() => setNumClicks(numClicks + 1)}">Click Me</button>
    `;
};
```

### `useReducer`
The `useReducer` hook is similar to the `useState` hook but allows for more complex state logic to be handled. If you are familiar with Redux that you are already familiar with how use Reducer works.
```js
const reducer = (state, action) => {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            throw new Error();
    }
};

const Component = (props, hooks) => {
    const { useReducer } = hooks;
    const [state, dispatch] = useReducer(reducer, {count: 0});

    return html`
        <p>Count: ${state.count}</p>
        <button @click="${() => dispatch({type: 'increment'})}">+</button>
        <button @click="${() => dispatch({type: 'decrement'})}">-</button>
    `;
};
```

### `useContext`
The `useContext` hook allows for variables to be shared with child functional lit elements in the DOM tree without needing to explicitly pass the properties all the way down. This hook consists of 3 related functions:
- `createContext` Creates a new context
  - Exported in the `functional-lit-element` module
- `provideContext` Makes a context available to other child Functional Lit Elements
  - Provided in the `hooks` argument of your render function
- `useContext` Consumes and makes available a context that has been provided by some parent component
  - Provided in the `hooks` argument of your render function

**`themer.js`**
```js
import { createContext } from 'functional-lit-element';

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

const Themer = (props, hooks) => {
    const { provideContext, useState } = hooks;
    const [theme, setTheme] = useState('light');

    provideContext(
        ThemeContext,
        {
            theme: themes[theme],
            toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
        }
    );

    return html`
         <themed-list></themed-list>
    `;
};

// etc...

```
**`themed-list.js`**
```js
import functionalLitElement from 'functional-lit-element';
import { ThemeContext } from "./themer";

const ThemedList = (props, hooks) => {
    const { useContext } = hooks;
    const { theme, toggleTheme } = useContext(ThemeContext);

    return html`
        <li style="background: ${theme.background}; color: ${theme.foreground};">
            Super Styled <button @click="${() => toggleTheme()}">Toggle Theme</button>
        </li>
    `;
};

const ThemedListComponent = functionalLitElement(ThemedList);
customElements.define('themed-list', ThemedListComponent);
```
In the example above the `Themer` component has also provided a function to toggle the theme as part of the ThemeContext's data. This allows the child component `ThemedList` to toggle the theme.