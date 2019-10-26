
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
        for(let i = 0; i < stateToWatch.length; i++) {
            if (effectState[i] !== stateToWatch[i]) {
                return true;
            }
        }
        return false;
    };

    // useEffect hook
    return (effect, stateToWatch = []) => {
        const currentKey = element._effectKey;
        if (getEffectState(currentKey) === undefined) {
            setEffectState(currentKey, Array.of(stateToWatch.map(() => undefined)));
        }

        if (stateToWatch.length === 0) {
            setEffectState(currentKey, stateToWatch);
            addEffect(effect);
            element._effectKey++;
            return;
        }

        if (effectStateHasChanged(stateToWatch, currentKey)) {
            addEffect(effect);
        }

        setEffectState(currentKey, stateToWatch);
        element._effectKey++;
    }
};