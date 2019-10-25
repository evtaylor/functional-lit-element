import { LitElement } from "lit-element";
import { directive, PropertyPart } from "lit-html";

import { createUseState } from "./hooks/useState";
import { createUseEffect, runEffect } from "./hooks/useEffect";
import { createUseReducer } from "./hooks/useReducer";
import { createUseContext, createContextFactory } from "./hooks/useContext";

import functionalElementFactory from './functionalElement';

const createContext = createContextFactory({directive, PropertyPart});
const functionalElement = functionalElementFactory({ LitElement, createUseState, createUseEffect, runEffect, createUseReducer, createUseContext });

export default functionalElement;
export { createContext };
export { css, html } from "lit-element";

