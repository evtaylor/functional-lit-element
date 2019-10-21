

export const createUseEffect = (element) => {
    return (effect, stateToWatch = []) => {
        if (element._hookState[element._hookKey] === undefined) {
            element._hookState[element._hookKey] = Array.of(stateToWatch.map(() => undefined));
        }

        if (stateToWatch.length === 0) {
            element._hookState[element._hookKey] = stateToWatch;
            element._hooks[element._hookKey] = effect;
            return;
        }

        for(let i = 0; i < stateToWatch.length; i++) {
            if (element._hookState[element._hookKey][i] !== stateToWatch[i]) {
                element._hooks[element._hookKey] = effect;
            }
        }
        element._hookState[element._hookKey] = stateToWatch;
    }
};

export const runEffect = (hook) => {
    return new Promise((resolve) => {
        return resolve(hook())
    });
};