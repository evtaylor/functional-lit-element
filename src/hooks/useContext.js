
export const createProvideContext = (element) => {
    const dispatchContextChange = (context) => {
        const contextChanged = new Event(`contextChanged:${context.id}`);
        element.dispatchEvent(contextChanged);
    };

    const getContext = (id) => {
        return element._context.get(id)
    };

    const setContext = (id, data) => {
        element._context.set(id, data)
    };

    return (context, value = undefined) => {
        //shallow equals
        // const changed = value !== element._context[context.id];
        // deep equals
        const changed = JSON.stringify(value) !== JSON.stringify(element._context[context.id]);
        if (value === undefined) {
            setContext(context.id, context.data);
        } else {
            setContext(context.id, value)
        }

        if (changed) {
            dispatchContextChange(context)
        }

        return (newContext) => {
            setContext(context.id, newContext);
            dispatchContextChange(context)
        }
    }

};

export const createUseContext = (element) => {
    return (context) => {
        if (element._contextListeners.get(context.id)) {
            return element._context.get(context.id);
        }

        const contextParent = getParentWithContext(element, context.id);
        const contextListener = () => {
            element._context.set(context.id, contextParent._context.get(context.id));
            element._context = new Map(Array.from(element._context.entries()))
        };

        contextParent.addEventListener(`contextChanged:${context.id}`, contextListener);
        element._contextListeners.set(context.id, contextListener);
        element._contextParents.set(context.id, contextParent);
        return contextParent._context.get(context.id);
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
