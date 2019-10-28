import assert from 'assert';
import { createUseState } from '../../src/hooks/useState';
import functionalElementFactory from '../../src/functionalElement';

describe('useState', () => {
    it('returns updated value when changed on next render', async function() {
        const defaultState = 0;

        let testValue = undefined;
        let testChanger = undefined;

        const render = (props, hooks) => {
            const { useState } = hooks;
            const [value, valueChanger] = useState(defaultState);
            testValue = value;
            testChanger = valueChanger;
        };

        const element = getTestComponent(render);
        element.render();
        // assert default value is set
        assert.strictEqual(testValue, 0);

        testChanger(10);
        // simulate a component rerender
        element.render();

        // assert value was updated
        assert.strictEqual(testValue, 10);
    });

    it('handles multiple instances of useState per render', async function() {
        const defaultState1 = 0;
        const defaultState2 = false;

        let testValue1 = undefined;
        let testChanger1 = undefined;
        let testValue2 = undefined;
        let testChanger2 = undefined;

        const render = (props, hooks) => {
            const { useState } = hooks;
            const [value1, valueChanger1] = useState(defaultState1);
            const [value2, valueChanger2] = useState(defaultState2);
            testValue1 = value1;
            testChanger1 = valueChanger1;
            testValue2 = value2;
            testChanger2 = valueChanger2;
        };

        const element = getTestComponent(render);
        element.render();

        // assert default value is set
        assert.strictEqual(testValue1, defaultState1);
        assert.strictEqual(testValue2, defaultState2);

        testChanger1(10);
        testChanger2(true);

        // simulate a component rerender
        element.render();

        // assert values were updated
        assert.strictEqual(testValue1, 10);
        assert.strictEqual(testValue2, true);
    });
});

const getTestComponent = (renderFn) => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: createUseState,
        createUseEffect: () => {},
        createUseReducer: () => {},
        createUseContext: () => {},
        createProvideContext: () => {}
    });

    const TestComponent = functionElement(renderFn);
    return new TestComponent();
};