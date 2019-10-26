import { createUseState } from "./hooks/useState";
import { createUseEffect } from "./hooks/useEffect";
import { createUseReducer } from "./hooks/useReducer";
import { createUseContext, createContextProvider } from "./hooks/useContext";

import functionalElementProvider from './functionalElement';

const createContextFactory = (directive, PropertyPart) => {
    return createContextProvider({directive, PropertyPart});
};

const functionalElementFactory = (LitElement) => {
    return functionalElementProvider({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext });
};

export default functionalElementFactory;
export {
    createContextFactory
}

