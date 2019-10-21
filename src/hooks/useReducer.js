
export const createUseReducer = (element) => {
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