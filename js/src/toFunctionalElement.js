import {LitElement} from "../../web_modules/lit-element.js";

export const toFunctionalElement = (render, props = {}, styles = []) => {
    return class extends LitElement {
        static get properties() {
            const dynamicState = {
                _dynamicState: { type: Object }
            };
            return Object.assign({}, dynamicState, props);
        }

        static get styles() {
            return styles;
        }

        constructor() {
            super();
            this._dynamicState = {};
            this._stateKey = 0;
            this.useState = createUseState(this);
        }

        render() {
            super.render();
            this._stateKey = 0;
            return render(this, this.useState);
        }
    };
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