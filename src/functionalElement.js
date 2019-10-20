import { LitElement } from "lit-element";
import { directive, PropertyPart } from "lit-html";

const functionalElement = (render, props = {}, styles = []) => {
    return class extends LitElement {
        static get properties() {
            const dynamicState = {
                _dynamicState: { type: Object },
                _dynamicReducerState: { type: Object },
                _context: { type: Object }
            };
            return Object.assign({}, dynamicState, props);
        }

        static get styles() {
            return styles;
        }

        constructor() {
            super();
            this._dynamicReducerState = {};
            this._reducerStateKey = 0;

            this._dynamicState = {};
            this._stateKey = 0;

            this._hookKey = 0;
            this._hooks = [];
            this._hookState = [];

            this._context = {};

            this.useState = createUseState(this);
            this.useEffect = createUseEffect(this);
            this.useReducer = createUseReducer(this);
            this.useContext = createUseContext(this);
        }

        render() {
            super.render();
            this._stateKey = 0;
            this._reducerStateKey = 0;
            this._hookKey = 0;
            const hooks = {
                useState: this.useState,
                useEffect: this.useEffect,
                useReducer: this.useReducer,
                useContext: this.useContext
            };
            const template = render(this, hooks);
            this._hooks.forEach(runHook);
            this._hooks = [];
            return template;
        }
    };
};

export default functionalElement;