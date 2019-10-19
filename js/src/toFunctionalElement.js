import {LitElement} from "../../web_modules/lit-element.js";

export const toFunctionalElement = (render, props = {}, styles = []) => {
    return class extends LitElement {
        static get properties() {
            const dynamicState = {
                _dynamicState: { type: Object }
            };
            const allProps = Object.assign({}, dynamicState, props);
            debugger;
            return allProps;
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
            return render(this, this.useState);
        }
    };
};

const createUseState = (element) => {
    let stateKey = element._stateKey;
    element._dynamicState[stateKey] = undefined;
    const useStateInstance = function (defaultValue = null) {
        debugger;
        if (typeof element._dynamicState[stateKey] === 'undefined') {
            element._dynamicState[stateKey] = defaultValue;
        }
        const changeValue = (newValue) => {
            debugger;
            console.log('change value', newValue);
            element._dynamicState[stateKey] = newValue;
        };
        return [element._dynamicState[stateKey], changeValue];
    };
    element._stateKey ++;
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