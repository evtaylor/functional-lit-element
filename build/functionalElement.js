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

    // useState hook
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

    const getEffectState = (key) => {
        return element._effectsState.get(key);
    };

    const setEffectState = (key, value)  => {
        const newState = new Map(Array.from(element._effectsState.entries()));
        newState.set(key, value);
        element._effectsState = newState;
    };

    const addEffect = (effect) => {
        element._effects.push(effect);
    };

    const effectStateHasChanged = (stateToWatch, key) => {
        const effectState = getEffectState(key);
        if (effectState.length === 0) {
            return false;
        }

        for(let i = 0; i < stateToWatch.length; i++) {
            if (effectState[i] !== stateToWatch[i]) {
                return true;
            }
        }
        return false;
    };

    // useEffect hook
    return (effect, stateToWatch = undefined) => {
        // If no state to watch, run effect every time
        if (stateToWatch === undefined) {
            addEffect(effect);
            return;
        }

        const currentKey = element._effectKey;

        // If first time useEffect called, set the effect state to watch and run effect
        if (getEffectState(currentKey) === undefined) {
            setEffectState(currentKey, stateToWatch);
            addEffect(effect);
            return;
        }

        // see if state has changed to decide whether effect should run again
        if (effectStateHasChanged(stateToWatch, currentKey)) {
            addEffect(effect);
        }

        setEffectState(currentKey, stateToWatch);
        element._effectKey++;
    }
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
    const { LitElement, createUseState, createUseEffect, createUseReducer, createUseContext } = dependencies;

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
                this._effectKey = 0;
                this._effects = [];
                this._effectsState = new Map();
            }

            _resetHooks() {
                this._stateKey = 0;
                this._reducerStateKey = 0;
                this._effectKey = 0;
                this._effects = [];
            }

            _runEffects() {
                return this._effects.map((effect) => {
                    return new Promise((resolve, reject) => {
                        try {
                            return resolve(effect());
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }

            render() {
                super.render();
                this._runEffects();
                this._resetHooks();
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
const functionalElement = functionalElementFactory({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext });

export default functionalElement;
export { createContext };
