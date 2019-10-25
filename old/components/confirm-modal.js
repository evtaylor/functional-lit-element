// Import the LitElement base class and html helper function
import functionalElement, { html, css } from '../../dist/web/functionalElement.min.js';
import { ThemeContext } from '../pages/main-page.js';

// class ConfirmModal extends LitElement {
//
//     static get properties() {
//         return {
//             isOpen: { type: Boolean, reflect: true },
//             title: { type: String, reflect: true },
//             confirmButtonText: { type: String, reflect: true },
//             cancelButtonText: { type: String, reflect: true },
//             onClose: { type: Object },
//             onConfirm: { type: Object },
//         };
//     }
//
//     static get styles() {
//         const hostStyles = css`
//
//         :host {
//             font-family: sans-serif;
//         }
//
//         :host([isopen=true]) .confirm-modal {
//             visibility: visible;
//         }
//
//         :host([isopen=true]) .confirm-modal__bg {
//             opacity: 1;
//         }
//
//         .confirm-modal {
//             visibility: hidden;
//         }
//         `;
//
//         const wrapperStyles = css`
//          .confirm-modal__bg {
//             width: 100%;
//             height: 100%;
//             position: absolute;
//             top: 0px;
//             left: 0px;
//             opacity: 0;
//             transition: visibility 0s, opacity 0.2s ease-in;
//         }
//         `;
//
//         const contentStyles = css`
//         .confirm-modal__content {
//             width: 300px;
//             height: 300px;
//             position: absolute;
//             z-index: 100;
//             left: 50%;
//             top: 50%;
//             transform: translate(-50%, -50%);
//             background: #fff;
//             box-shadow: rgba(0, 0, 0, 0.25) 0 5px 5px 0px;
//             padding: 1em;
//             display: flex;
//             flex-direction: column;
//         }
//
//         .confirm-modal__body {
//             flex-grow: 1;
//         }
//
//         .confirm-modal__footer {
//             text-align: right;
//         }
//         `;
//
//         const bgStyles = css`
//         .confirm-modal__bg {
//             width: 100%;
//             height: 100%;
//             position: absolute;
//             top: 0px;
//             left: 0px;
//             background: rgba(0, 0, 0, 0.5);
//             cursor: pointer;
//         }`;
//
//         return [ hostStyles, wrapperStyles, contentStyles, bgStyles ];
//     }
//
//     constructor() {
//         super();
//         this.isOpen = false;
//         this.confirmButtonText = 'Ok';
//         this.cancelButtonText = 'Cancel';
//     }
//
//     render(){
//         return html`
//             <div class="confirm-modal">
//                 <div class="confirm-modal__content">
//                     <div class="confirm-modal__header">
//                         <h1>${this.title}</h1>
//                     </div>
//                     <div class="confirm-modal__body">
//                         <slot></slot>
//                     </div>
//                     <div class="confirm-modal__footer">
//                         <button @click="${this.onClose}">${this.cancelButtonText}</button>
//                         <button @click="${this.onConfirm}">${this.confirmButtonText}</button>
//                     </div>
//                 </div>
//                 <div class="confirm-modal__bg" @click="${this.onClose}"></div>
//             </div>
//         `
//     }
//
//     attributeChangedCallback(name, oldval, newval) {
//         console.log('attribute change: ', name, newval);
//         super.attributeChangedCallback(name, oldval, newval);
//
//         if (name === 'isopen') {
//             newval ? this.dispatchEvent(new Event('open')) : this.dispatchEvent(new Event('close'));
//         }
//     }
// }
// Register the new element with the browser.
// customElements.define('confirm-modal', ConfirmModal);

const hostStyles = css`   
        
        :host {
            font-family: sans-serif;
        }
            
        :host([isopen=true]) .confirm-modal {
            visibility: visible;
        }
        
        :host([isopen=true]) .confirm-modal__bg {
            opacity: 1;
        }
        
        .confirm-modal {
            visibility: hidden;
        }
        `;

const wrapperStyles = css`
         .confirm-modal__bg {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            opacity: 0;
            transition: visibility 0s, opacity 0.2s ease-in;
        }
        `;

const contentStyles = css`
        .confirm-modal__content {
            width: 300px;
            height: 300px;
            position: absolute;
            z-index: 100;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            box-shadow: rgba(0, 0, 0, 0.25) 0 5px 5px 0px;
            padding: 1em;
            display: flex;
            flex-direction: column;
        }

        .confirm-modal__body {
            flex-grow: 1;
        }
        
        .confirm-modal__footer {
            text-align: right;
        }
        `;

const bgStyles = css`
        .confirm-modal__bg {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            background: rgba(0, 0, 0, 0.5);
            cursor: pointer;
        }`;

const styles = [ hostStyles, wrapperStyles, contentStyles, bgStyles ];

const props = {
    isOpen: { type: Boolean, reflect: true },
    title: { type: String, reflect: true },
    confirmButtonText: { type: String, reflect: true },
    cancelButtonText: { type: String, reflect: true },
    onClose: { type: Object },
    onConfirm: { type: Object },
};

const MyConfirmModal = (props, hooks) => {

    const { useContext } = hooks;

    const theme = useContext(ThemeContext);

    console.log(theme);

    const {
        isOpen,
        title,
        confirmButtonText,
        cancelButtonText,
        onClose,
        onConfirm,
    } = props;

    return html`
        <div class="confirm-modal">
            <div class="confirm-modal__content">
                <div class="confirm-modal__header">
                    <h1>${title}</h1>
                </div>
                <div class="confirm-modal__body">
                    <slot></slot>
                </div>
                <div class="confirm-modal__footer">
                    <button @click="${onClose}">${cancelButtonText}</button>
                    <button @click="${onConfirm}">${confirmButtonText}</button>
                </div>
            </div>
            <div class="confirm-modal__bg" @click="${onClose}"></div>
        </div>
    `
};

const myFunctionalElement = functionalElement(MyConfirmModal, props, styles);
customElements.define('confirm-modal', myFunctionalElement);