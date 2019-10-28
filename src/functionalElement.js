export default (dependencies) => {
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
                // Todo: only pass props, not `this`
                const template = render(this, hooks);
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
}