
export const createUseEffect = (element) => {

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