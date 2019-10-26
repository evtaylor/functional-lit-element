import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const properties = {
    title: { type: String, reflect: true },
    description: { type: String },
    onDeleteClick: { type: Object },
};

const styles = css`
    .todo-item {
        width: 300px;
        border: 1px #ccc solid;
        padding: 1em;
        margin-bottom: 5px;
    }
    
    .todo-item p {
        display: inline-block;
        margin: 0;
    }
    
    .todo-item button {
        float: right;
    }
`;

const TodoItem = (props) => {
    return html`
        <li class="todo-item">
            <p>${props.description}</p>
            <button @click="${props.onDeleteClick}">Delete</button>
        </li>
    `;
};

const TodoItemComponent = functionalElement(TodoItem, properties, styles);

customElements.define('todo-item', TodoItemComponent);