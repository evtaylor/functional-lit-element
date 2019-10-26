
export const createUseReducer = (element) => {
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