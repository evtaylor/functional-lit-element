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

//
// const customElementObserver = () => new MutationObserver((mutationList, observer) => {
//     mutationList.forEach((mutation) => {
//         mutation.addedNodes.forEach((node) => {
//             node.childNodes.forEach((child) => {
//                 if (isCustomElement(child)) {
//                     console.log(child);
//                     child.addEventListener('connected', (e) => {
//                         // debugger;
//                         console.log('connected', e.target,  e.target._context);
//                         //console.log(e.target.shadowRoot)
//
//                         // e._context[context.name] = context._data;
//                     })
//                 }
//             })
//         });
//     })
// });
//
// observer.observe(element.shadowRoot, {subtree: true, childList: true});


const createProvideContext = (element) => {
    const updateWatchers = (context, newValue) => {
        element._context[context.name] = newValue;
        element._contextWatchers = element._contextWatchers.filter((watcher) => {
            watcher._context = Object.assign({}, {[context.name]: newValue});
            debugger;
            return element.contains(watcher)
        });
    };

    return (context, value = undefined) => {
        //shallow equals
        // const changed = value !== element._context[context.name];
        // deep equals
        const changed = JSON.stringify(value) !== JSON.stringify(element._context[context.name]);
        if (value === undefined) {
            element._context[context.name] = context._data;
        } else {
            element._context[context.name] = value;
        }

        if (changed) {
            updateWatchers(context, element._context[context.name]);
        }

        return (newContext) => {
            updateWatchers(context, newContext);
        }
    }

};

const createUseContext = (element) => {
    return (context) => {
        const contextParent = getParentWithContext(element, context.name);
        contextParent._contextWatchers.push(element);
        return contextParent._context[context.name];
    }
};

const getParentWithContext = (element, contextName) => {
    return getParent(element, contextName);
};

const getParent = (node, contextName) => {
    if (hasContext(node, contextName)) {
        return node;
    }

    if (node.parentNode) {
        return getParent(node.parentNode, contextName);
    }

    if (node.host) {
        return getParent(node.host, contextName);
    }

    return null;
};

const hasContext = (node, contextName) => {
    return node._context && node._context[contextName] !== undefined;
};

const createContextProvider = (dependencies) => {
    //createContext
    return (defaultData) => {
        return new class {
            constructor() {
                this._data = defaultData;
                this.name = weakUUID();
            }

            setContext(data) {
                debugger;
                this._data = data;
            }

            getContext() {
                return this._data;
            }
        }
    };
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

var functionalElementProvider = (dependencies) => {
    const { LitElement, createUseState, createUseEffect, createUseReducer, createUseContext, createProvideContext } = dependencies;

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
                this._dynamicReducerState = new Map();
                this._dynamicState = new Map();
                this._context = {};

                this._reducerStateKey = 0;
                this._stateKey = 0;
                this._effectKey = 0;
                this._effects = [];
                this._effectsState = new Map();

                this._contextWatchers = [];
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
                    useState: createUseState(this),
                    useEffect: createUseEffect(this),
                    useReducer: createUseReducer(this),
                    useContext: createUseContext(this),
                    provideContext: createProvideContext(this)
                };
                // Todo: only pass props, not `this`
                const template = render(this, hooks);
                this._runEffects();
                return template;
            }

            connectedCallback() {
                super.connectedCallback();
                let connected = new Event('connected');
                this.dispatchEvent(connected);
            }
        };
    };
};

const createContextFactory = (directive, PropertyPart) => {
    return createContextProvider();
};

const functionalElementFactory = (LitElement) => {
    return functionalElementProvider({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext, createProvideContext });
};

export default functionalElementFactory;
export { createContextFactory };
//# sourceMappingURL=functionalElement.js.map
