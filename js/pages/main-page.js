// Import the LitElement base class and html helper function
import { LitElement, html, css } from '../../web_modules/lit-element.js';
import toFunctionalElement from '../src/toFunctionalElement.js';

const props = {
    title: { type: String, reflect: true },
};

const MainPage = (props, useState) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [someNum, setSomeNum] = useState(0);

    console.log('render', modalOpen, someNum)

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
                    setSomeNum(someNum+1)
                }}"
            >
                Are you sure you want to do this?
            </confirm-modal>
        `;
}

const MyMainPage = toFunctionalElement(MainPage, props);
customElements.define('main-page', MyMainPage);
