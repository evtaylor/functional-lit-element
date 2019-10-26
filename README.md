# Functional LitElement
A wrapper for [LitElement](https://github.com/Polymer/lit-element) which provides an API similar to React functional components. 

[![CircleCI](https://circleci.com/gh/evtaylor/functional-lit-element.svg?style=svg)](https://circleci.com/gh/evtaylor/functional-lit-element)


## Overview
The goal of Functional LitElement is to make web components as simple as possible.

## Usage
### Basic component
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