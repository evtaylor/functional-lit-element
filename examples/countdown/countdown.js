import functionalElementFactory from '../../build/browser/functionalElement.js';
import { LitElement, html } from '../../web_modules/lit-element.js';

const functionalElement = functionalElementFactory(LitElement);

const props = {
    title: { type: String, reflect: true },
};

const Countdown = (props, hooks) => {
    const { useState, useEffect } = hooks;

    const [timeLength, setTimeLength] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (isRunning) {
            setTimeout(() => {
                if (countdown <= 100) {
                    setCountdown(0);
                    setIsRunning(false);
                    return;
                }
                setCountdown(countdown - 100);
            }, 100)
        }
    }, [isRunning, countdown]);

    return html`
        <h2>${props.title}</h2>
        <p>Countdown is ${!isRunning ? 'not' : ''} running.</p>
        <p></p><b>${countdown/1000} seconds</b></p>
        <button @click="${() => {
            setIsRunning(true);
            setCountdown(timeLength * 1000);
        }}" ?disabled="${isRunning}">Start</button>
        <input type="number" @input="${(e) => setTimeLength(e.target.value)}" .value="${timeLength}"/> seconds
    `;
};

const CountdownComponent = functionalElement(Countdown, props);

customElements.define('my-countdown', CountdownComponent);