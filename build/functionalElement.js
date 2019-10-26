import { LitElement } from 'lit-element';
export { css, html } from 'lit-element';
import { directive, PropertyPart } from 'lit-html';

const createUseState = (element) => {

    const getState = (key) => {
        return element._dynamicState.get(key);
    };

    const setState = (key, value)  => {
        const newState = new Map(Array.from(element._dynamicState.entries()));
        newState.set(key, value);
        element._dynamicState = newState;
    };

    return (defaultValue = null) => {
        const currentStateKey = element._stateKey;

        if (getState(currentStateKey) === undefined) {
            setState(currentStateKey, defaultValue);
        }

        const changeValue = (newValue) => {
            setState(currentStateKey, newValue);
        };

        const valueAndChanger = [getState(currentStateKey), changeValue];
        element._stateKey++;
        return valueAndChanger;
    };
};

const createUseEffect = (element) => {
    return (effect, stateToWatch = []) => {
        if (element._hookState[element._hookKey] === undefined) {
            element._hookState[element._hookKey] = Array.of(stateToWatch.map(() => undefined));
        }

        if (stateToWatch.length === 0) {
            element._hookState[element._hookKey] = stateToWatch;
            element._hooks[element._hookKey] = effect;
            element._hookKey++;
            return;
        }

        for(let i = 0; i < stateToWatch.length; i++) {
            if (element._hookState[element._hookKey][i] !== stateToWatch[i]) {
                element._hooks[element._hookKey] = effect;
            }
        }
        element._hookState[element._hookKey] = stateToWatch;
        element._hookKey++;
    }
};

const runEffect = (hook) => {
    return new Promise((resolve) => {
        return resolve(hook())
    });
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

const createUseContext = (element) => {
    return (context) => {
        const { ['_contextName']: contextName, ...contextData } = element._context[context._contextName];
        return contextData;
    }
};

const createContextFactory = (dependencies) => {
    const {directive, PropertyPart} = dependencies;
    //createContext
    return (defaultData) => {
        const contextName = weakUUID();
        const context = directive((contextData = defaultData) => (part) => {
            if (!(part instanceof PropertyPart)) {
                throw new Error('context directive can only be used in property bindings');
            }

            contextData._contextName = contextName;
            part.setValue(contextData);
            part.commit();
            setContext(part.committer.element, contextData);
        });
        context._contextName = contextName;
        return context;
    };
};

const setContext = (element, context) => {
    if (isCustomElement(element.localName)) {
        if (typeof element._context === 'undefined') element._context = {};
        element._context[context._contextName] = context;
    }

    Array.from(element.children).forEach((child) => {
        setContext(child, context);
    });
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

var functionalElementFactory = (dependencies) => {
    const { LitElement, createUseState, createUseEffect, runEffect, createUseReducer, createUseContext } = dependencies;

    return (render, props = {}, styles = []) => {
        return class extends LitElement {
            static get properties() {
                const dynamicState = {
                    _dynamicState: {type: Object},
                    _dynamicReducerState: {type: Object},
                    _context: {type: Object}
                };
                return Object.assign({}, dynamicState, props);
            }

            static get styles() {
                return styles;
            }

            constructor() {
                super();
                this._dynamicReducerState = {};
                this._dynamicState = new Map();
                this._context = {};

                this._reducerStateKey = 0;
                this._stateKey = 0;
                this._hookKey = 0;
                this._hooks = [];
                this._hookState = [];
            }

            _resetHooks() {
                this._stateKey = 0;
                this._reducerStateKey = 0;
                this._hookKey = 0;
            }

            _runEffects() {
                this._hooks.forEach((effect) => {
                    return new Promise((resolve) => {
                        return resolve(effect())
                    });
                });
            }

            render() {
                super.render();
                this._resetHooks();
                this._runEffects();
                const hooks = {
                    useState: createUseState(this),
                    useEffect: createUseEffect(this),
                    useReducer: createUseReducer(this),
                    useContext: createUseContext(this)
                };
                return render(this, hooks);
            }
        };
    };
};

const createContext = createContextFactory({directive, PropertyPart});
const functionalElement = functionalElementFactory({ LitElement, createUseState, createUseEffect, runEffect, createUseReducer, createUseContext });

export default functionalElement;
export { createContext };
