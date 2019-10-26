export default (dependencies) => {
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
                this._hookKey = 0;
                this._hooks = [];
                this._hookState = [];
            }

            _resetHooks() {
                this._stateKey = 0;
                this._reducerStateKey = 0;
                this._hookKey = 0;
                this._hooks = [];
            }

            _runEffects() {
                const effectPromises = this._hooks.map((effect) => {
                    return new Promise((resolve, reject) => {
                        try {
                            return resolve(effect());
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
                return effectPromises;
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
}