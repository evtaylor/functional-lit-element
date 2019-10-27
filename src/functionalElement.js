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
}