
export const createProvideContext = (element) => {
    const dispatchContextChange = (context) => {
        const contextChanged = new Event(`contextChanged:${context.id}`);
        element.dispatchEvent(contextChanged);
    };

    const setContext = (id, data) => {
        element._context.set(id, data)
    };

    return (context, value = undefined, equalityCheck = shallowEqual) => {
        const providedValue = value !== undefined ? value : context.defaultData;
        const changed = equalityCheck(providedValue, element._context.get(context.id));

        if (changed) {
            setContext(context.id, providedValue);
            dispatchContextChange(context)
        }

        return (newContext) => {
            setContext(context.id, newContext);
            dispatchContextChange(context)
        }
    }
};

export const createUseContext = (element) => {
    const contextListener = () => {
        element.requestUpdate();
    };

    return (context) => {
        const contextParent = element._contextParents.get(context.id);
        if (contextParent) {
            return contextParent._context.get(context.id);
        }

        const foundContextParent = getParentWithContext(element, context.id);
        element._contextParents.set(context.id, foundContextParent);

        foundContextParent.addEventListener(`contextChanged:${context.id}`, contextListener);
        element._contextListeners.set(context.id, contextListener);
        element._contextParents.set(context.id, foundContextParent);
        return foundContextParent._context.get(context.id);
    }
};

const getParentWithContext = (element, contextId) => {
    return getParent(element, contextId);
};

const getParent = (node, contextId) => {
    if (hasContext(node, contextId)) {
        return node;
    }

    if (node.parentNode) {
        return getParent(node.parentNode, contextId);
    }

    if (node.host) {
        return getParent(node.host, contextId);
    }

    return null;
};

const hasContext = (node, contextId) => {
    return node._context && node._context.get(contextId) !== undefined;
};

export const createContext = (defaultData) => {
    return new class {
        constructor() {
            this.defaultData = defaultData;
            this.id = id(this);
        }
    }
};

const id = (() => {
    let currentId = 0;
    const map = new WeakMap();

    return (object) => {
        if (!map.has(object)) {
            map.set(object, ++currentId);
        }

        return map.get(object);
    };
})();

const shallowEqual = (a, b) => a !== b;