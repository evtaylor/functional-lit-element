
export const createProvideContext = (element) => {
    const dispatchContextChange = (contextName) => {
        const contextChanged = new Event('contextChanged');
        element.dispatchEvent(contextChanged);
    };

    return (context, value = undefined) => {
        //shallow equals
        // const changed = value !== element._context[context.name];
        // deep equals
        const changed = JSON.stringify(value) !== JSON.stringify(element._context[context.name]);
        if (value === undefined) {
            element._context[context.name] = context._data;
        } else {
            element._context[context.name] = value;
        }

        if (changed) {
            dispatchContextChange(context.name)
        }

        return (newContext) => {
            element._context[context.name] = newContext;
            dispatchContextChange(context.name)
        }
    }

};

export const createUseContext = (element) => {
    return (context) => {
        if (element._contextListeners.get(context.name)) {
            return element._context[context.name];
        }

        const contextParent = getParentWithContext(element, context.name);
        const contextListener = () => {
            element._context = Object.assign({}, {[context.name]: contextParent._context[context.name]});
        };
        contextParent.addEventListener('contextChanged', contextListener);
        element._contextListeners.set(context.name, contextListener);
        element._contextParents.set(context.name, contextParent);
        return contextParent._context[context.name];
    }
};

const getParentWithContext = (element, contextName) => {
    return getParent(element, contextName);
};

const getParent = (node, contextName) => {
    if (hasContext(node, contextName)) {
        return node;
    }

    if (node.parentNode) {
        return getParent(node.parentNode, contextName);
    }

    if (node.host) {
        return getParent(node.host, contextName);
    }

    return null;
};

const hasContext = (node, contextName) => {
    return node._context && node._context[contextName] !== undefined;
};

export const createContextProvider = (dependencies) => {
    const {directive, PropertyPart} = dependencies;
    //createContext
    return (defaultData) => {
        return new class {
            constructor() {
                this._data = defaultData;
                this.name = weakUUID();
            }

            setContext(data) {
                debugger;
                this._data = data
            }

            getContext() {
                return this._data;
            }
        }
    };
};

const setContext = (element, context) => {
    if (isCustomElement(element.localName)) {
        if (typeof element._context === 'undefined') element._context = {};
        element._context[context._contextName] = context;
    }

    Array.from(element.children).forEach((child) => {
        setContext(child, context);
    })
};

const isCustomElement = (node) => {
    if (node.localName === undefined) {
        return false;
    }
    return node.localName.includes('-');
};

const weakUUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};