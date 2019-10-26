import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html, css } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const properties = {
    title: { type: String, reflect: true }
};

const styles = css`
    .todo-list {
       list-style: none;
       padding: 0;
    }
`;

const TodoList = (props, hooks) => {
    const { useReducer, useState } = hooks;

    const [taskText, setTaskText] = useState('');
    const [state, dispatch] = useReducer(reducer, []);

    const addTask = (description) => {
        dispatch({
            type: 'ADD_TASK',
            task: {
                description: description,
            }
        })
    };

    const removeTask = (index) => {
        dispatch({
            type: 'REMOVE_TASK',
            index
        })
    };

    return html`
        <h1>${props.title}</h1>
        <button @click="${() => {
            addTask(taskText);
            setTaskText('');
        }}">
            Add Task
        </button>
        <input type="text" @input="${(e) => setTaskText(e.target.value)}" .value="${taskText}"/>
        <ul class="todo-list">
            ${state.map((task, index) => {
                return html`
                    <todo-item
                        .description="${task.description}"
                        .onDeleteClick="${() => removeTask(index)}"
                    />`
            })}
        </ul>
    `
};

const reducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TASK':
            state.push(action.task);
            return Array.from(state);
        case 'REMOVE_TASK':
            state.splice(action.index, 1);
            return Array.from(state);
        default:
            throw new Error();
    }
};

const TodoListComponent = functionalElement(TodoList, properties, styles);
customElements.define('todo-list', TodoListComponent);