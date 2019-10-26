import assert from 'assert';
import { createUseState } from '../../src/hooks/useState';
import functionalElementFactory from '../../src/functionalElement';

describe('useState', () => {
    it('returns updated value when changed on next render', async function() {
        const element = getTestComponent();
        const useState = createUseState(element);
        const defaultState = 0;

        const [value, valueChanger] = useState(defaultState);

        // assert default value is set
        assert.strictEqual(value, 0);
        valueChanger(10);

        // simulate a component rerender
        element.render();

        const [updatedValue, updatedValueChanger] = useState(defaultState);
        // assert value was updated
        assert.strictEqual(updatedValue, 10);
    });

    it('handles multiple instances of useState per render', async function() {
        const element = getTestComponent();
        const useState = createUseState(element);
        const defaultState1 = 0;
        const defaultState2 = false;

        const [value1, valueChanger1] = useState(defaultState1);
        const [value2, valueChanger2] = useState(defaultState2);

        // assert default value is set
        assert.strictEqual(value1, defaultState1);
        assert.strictEqual(value2, defaultState2);

        valueChanger1(10);
        valueChanger2(true);

        // simulate a component rerender
        element.render();

        const [updatedValue1, updatedValueChanger1] = useState(defaultState1);
        const [updatedValue2, updatedValueChanger2] = useState(defaultState2);
        // assert values were updated
        assert.strictEqual(updatedValue1, 10);
        assert.strictEqual(updatedValue2, true);
    });
});

const getTestComponent = () => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        createUseReducer: () => {},
        createUseContext: () => {}
    });

    const TestComponent = functionElement(() => {});
    return new TestComponent();
};