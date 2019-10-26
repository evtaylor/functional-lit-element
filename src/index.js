import { LitElement } from "lit-element";
import { directive, PropertyPart } from "lit-html";

import { createUseState } from "./hooks/useState";
import { createUseEffect } from "./hooks/useEffect";
import { createUseReducer } from "./hooks/useReducer";
import { createUseContext, createContextProvider } from "./hooks/useContext";

import functionalElementProvider from './functionalElement';

const createContext = createContextProvider({directive, PropertyPart});
const functionalElement = functionalElementProvider({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext });

export default functionalElement;
export { createContext };

