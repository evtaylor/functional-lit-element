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
