// Import the LitElement base class and html helper function
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import toFunctionalElement from '../src/toFunctionalElement.js';

const props = {
    title: { type: String, reflect: true },
};

const initialState = {count: 0};

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1};
        case 'decrement':
            return {count: state.count - 1};
        default:
            throw new Error();
    }
}

const MainPage = (props, hooks) => {
    const { useState, useEffect, useReducer } = hooks;

    const [modalOpen, setModalOpen] = useState(false);
    const [someNum, setSomeNum] = useState(0);

    useEffect(() => {
        setTimeout(function() {
            console.log('done effect')
        }, 1000);
    }, [someNum]);

    const [state, dispatch] = useReducer(reducer, initialState);

    console.log('render', modalOpen, someNum)
    console.log('reducer state', state)

    const {
        title
    } = props;

    return html`
            <h1>${title}</h1>
            <button id="modal-open" @click="${() => setModalOpen(true)}">Open</button>
            <confirm-modal
                id="modal"
                title="My Modal"
                isopen="${modalOpen}"
                confirmButtonText="Ok"
                cancelButtonText="Cancel"
                .onClose="${() => setModalOpen(false)}"
                .onConfirm="${() => {
                    setModalOpen(false)
                    // setSomeNum(someNum+1)
                    dispatch({type: 'increment'})
                }}"
            >
                Are you sure you want to do this?
            </confirm-modal>
        `;
}

const MyMainPage = toFunctionalElement(MainPage, props);
customElements.define('main-page', MyMainPage);
