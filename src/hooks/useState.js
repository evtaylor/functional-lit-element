

export const createUseState = (element) => {
    // gets called once in the constructor of the el
    return (defaultValue = null) => {
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
};