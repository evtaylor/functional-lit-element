export const createUseContext = (element) => {
    return (context) => {
        const { ['_contextName']: contextName, ...contextData } = element._context[context._contextName];
        return contextData;
    }
};

export const createContextFactory = (dependencies) => {
    const {directive, PropertyPart} = dependencies;
    //createContext
    return (defaultData) => {
        const contextName = weakUUID();
        const context = directive((contextData = defaultData) => (part) => {
            if (!(part instanceof PropertyPart)) {
                throw new Error('context directive can only be used in property bindings');
            }

            contextData._contextName = contextName;
            part.setValue(contextData);
            part.commit();
            setContext(part.committer.element, contextData);
        });
        context._contextName = contextName;
        return context;
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

const isCustomElement = (elementName) => {
    // Custom elements must have a dash in the name
    return elementName.includes('-');
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