import { LitElement } from "lit-element";

import { createUseState } from "./hooks/useState";
import { createUseEffect } from "./hooks/useEffect";
import { createUseReducer } from "./hooks/useReducer";
import { createUseContext, createContext, createProvideContext } from "./hooks/useContext";

import functionalElementProvider from './functionalElement';

const functionalElement = functionalElementProvider({ LitElement, createUseState, createUseEffect, createUseReducer, createUseContext, createProvideContext });

export default functionalElement;
export { createContext };

