import {LitElement} from "../../web_modules/lit-element.js";
import {directive, PropertyPart} from "../../web_modules/lit-html.js";

export const toFunctionalElement = (render, props = {}, styles = []) => {
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

const runHook = (hook) => {
    return new Promise((resolve) => {
        return resolve(hook())
    });
};

const createUseContext = (element) => {
    return (context) => {
        const { ['_contextName']: contextName, ...contextData } = element._context[context._contextName];
        return contextData;
    }
};

export const createContext = (defaultData) => {
    const contextName = weakUUID();
    const context = directive((contextData = defaultData) => (part) => {
        if (!(part instanceof PropertyPart)) {
            throw new Error('context directive can only be used in property bindings');
        }

        contextData._contextName = contextName;
        part.setValue(contextData)
        part.commit();
        setContext(part.committer.element, contextData);
    });
    context._contextName = contextName;
    return context;
};

const setContext = (element, context) => {
    if (isCustomElement(element.localName)) {
        if (typeof element._context === 'undefined') element._context = {};
        element._context[context._contextName] = context;
    }

    Array.from(element.children).forEach((child) => {
        setContext(child, context);
    })
};

const isCustomElement = (elementName) => {
    // Custom elements must have a dash in the name
    return elementName.includes('-');
};

const weakUUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

const createUseReducer = (element) => {
    return (reducer, initialState) => {
        if (typeof element._dynamicReducerState[element._reducerStateKey] === 'undefined') {
            element._dynamicReducerState[element._reducerStateKey] = Object.assign({}, element._dynamicReducerState[element._reducerStateKey], initialState);
        }

        const currentStateKey = element._reducerStateKey;
        const dispatch = (action) => {
            // debugger;
            const newState = reducer(element._dynamicReducerState[currentStateKey], action);
            element._dynamicReducerState[currentStateKey] = Object.assign({}, element._dynamicReducerState[currentStateKey], newState);
        };

        const stateAndDispatch = [element._dynamicReducerState[element._reducerStateKey], dispatch];
        element._reducerStateKey++;
        return stateAndDispatch;
    }
};

const createUseEffect = (element) => {
    return (effect, stateToWatch = []) => {
        if (element._hookState[element._hookKey] === undefined) {
            element._hookState[element._hookKey] = Array.of(stateToWatch.map(() => undefined));
        }

        if (stateToWatch.length === 0) {
            element._hookState[element._hookKey] = stateToWatch;
            element._hooks[element._hookKey] = effect;
            return;
        }

        for(let i = 0; i < stateToWatch.length; i++) {
            if (element._hookState[element._hookKey][i] !== stateToWatch[i]) {
                element._hooks[element._hookKey] = effect;
            }
        }
        element._hookState[element._hookKey] = stateToWatch;
    }
};

const createUseState = (element) => {
    // gets called once in the constructor of the el
    const useStateInstance = function (defaultValue = null) {
        // gets called every render
        if (typeof element._dynamicState[element._stateKey] === 'undefined') {
            element._dynamicState = Object.assign({}, element._dynamicState, {[element._stateKey]: defaultValue});
        }
        const currentStateKey = element._stateKey;
        const changeValue = (newValue) => {
            console.log('change value', newValue);
            element._dynamicState = Object.assign({}, element._dynamicState, {[currentStateKey]: newValue});
        };

        const valueAndChanger = [element._dynamicState[element._stateKey], changeValue];
        element._stateKey++;
        return valueAndChanger;
    };
    return useStateInstance;
};


let value = undefined;

export const useState = (defaultValue = null) => {
    if (typeof value === 'undefined') {
        value = defaultValue;
    }
    const changeValue = (newValue) => {
        value = newValue;
    };
    debugger;
    return [value, changeValue];
};

export default toFunctionalElement;