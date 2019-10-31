import { LitElement } from 'lit-element';

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

        element._stateKey++;
        return [getState(currentStateKey), changeValue];
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
    const getReducerState = (key) => {
        return element._dynamicReducerState.get(key);
    };

    const setReducerState = (key, value)  => {
        const newState = new Map(Array.from(element._dynamicReducerState.entries()));
        newState.set(key, value);
        element._dynamicReducerState = newState;
    };

    return (reducer, initialState) => {
        const currentKey = element._reducerStateKey;

        if (getReducerState(currentKey) === undefined) {
            setReducerState(currentKey, initialState);
        }

        const dispatch = (action) => {
            const newState = reducer(getReducerState(currentKey), action);
            setReducerState(currentKey, newState);
        };

        element._reducerStateKey++;
        return [getReducerState(currentKey), dispatch];
    }
};

const createProvideContext = (element) => {
    const dispatchContextChange = (context) => {
        const contextChanged = new Event(`contextChanged:${context.id}`);
        element.dispatchEvent(contextChanged);
    };

    const setContext = (id, data) => {
        element._context.set(id, data);
    };

    return (context, value = undefined, equalityCheck = shallowEqual) => {
        const providedValue = value !== undefined ? value : context.defaultData;
        const changed = equalityCheck(providedValue, element._context.get(context.id));

        if (changed) {
            setContext(context.id, providedValue);
            dispatchContextChange(context);
        }

        return (newContext) => {
            setContext(context.id, newContext);
            dispatchContextChange(context);
        }
    }
};

const createUseContext = (element) => {
    const contextListener = () => {
        element.requestUpdate();
    };

    return (context) => {
        const contextParent = element._contextParents.get(context.id);
        if (contextParent) {
            return contextParent._context.get(context.id);
        }

        const foundContextParent = getParentWithContext(element, context.id);
        element._contextParents.set(context.id, foundContextParent);

        foundContextParent.addEventListener(`contextChanged:${context.id}`, contextListener);
        element._contextListeners.set(context.id, contextListener);
        element._contextParents.set(context.id, foundContextParent);
        return foundContextParent._context.get(context.id);
    }
};

const getParentWithContext = (element, contextId) => {
    return getParent(element, contextId);
};

const getParent = (node, contextId) => {
    if (hasContext(node, contextId)) {
        return node;
    }

    if (node.parentNode) {
        return getParent(node.parentNode, contextId);
    }

    if (node.host) {
        return getParent(node.host, contextId);
    }

    return null;
};

const hasContext = (node, contextId) => {
    return node._context && node._context.get(contextId) !== undefined;
};

const createContext = (defaultData) => {
    return new class {
        constructor() {
            this.defaultData = defaultData;
            this.id = id(this);
        }
    }
};

const id = (() => {
    let currentId = 0;
    const map = new WeakMap();

    return (object) => {
        if (!map.has(object)) {
            map.set(object, ++currentId);
        }

        return map.get(object);
    };
})();

const shallowEqual = (a, b) => a !== b;

var functionalElementProvider = (dependencies) => {
    const { LitElement, createUseState, createUseEffect, createUseReducer, createUseContext, createProvideContext } = dependencies;

    return (render, props = {}, styles = []) => {
        const getProps = (element) => Object.keys(props).reduce((renderProps, propName) => {
            renderProps[propName] = element[propName];
            return renderProps;
        }, {});

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
                this._dynamicReducerState = new Map();
                this._dynamicState = new Map();
                this._context = new Map();

                this._reducerStateKey = 0;
                this._stateKey = 0;
                this._effectKey = 0;
                this._effects = [];
                this._effectsState = new Map();

                this._contextListeners = new Map();
                this._contextParents = new Map();

                this._createHooks();
            }

            _createHooks() {
                this._hooks = {};
                this._hooks.useState = createUseState(this);
                this._hooks.useEffect = createUseEffect(this);
                this._hooks.useReducer = createUseReducer(this);
                this._hooks.useContext = createUseContext(this);
                this._hooks.provideContext = createProvideContext(this);
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
                this._resetHooks();
                const hooks = {
                    useState: this._hooks.useState,
                    useEffect: this._hooks.useEffect,
                    useReducer: this._hooks.useReducer,
                    useContext: this._hooks.useContext,
                    provideContext: this._hooks.provideContext,
                };
                const template = render(getProps(this), hooks);
                this._runEffects();
                return template;
            }

            disconnectedCallback() {
                super.disconnectedCallback();
                const contexts = Array.from(this._contextListeners.keys());
                contexts.forEach((contextId) => {
                    const listener = this._contextListeners.get(contextId);
                    const parentContext = this._contextParents.get(contextId);
                    if (parentContext) {
                        parentContext.removeEventListener(`contextChanged:${contextId}`, listener);
                    }
                });
                this._contextListeners = null;
                this._contextParents = null;
            }
        };
    };
};

const functionalElement = functionalElementProvider({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext, createProvideContext });

export default functionalElement;
export { createContext };
