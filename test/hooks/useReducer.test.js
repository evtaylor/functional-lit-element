import assert from 'assert';
import { createUseReducer } from '../../src/hooks/useReducer';
import functionalElementFactory from '../../src/functionalElement';

describe('useReducer', () => {
    it('returns updated value when changed on next render', async function() {
        const initialState = { count: 0 };
        const reducer = (state, action) => {
            switch (action.type) {
                case 'increment':
                    return {count: state.count + 1};
                case 'decrement':
                    return {count: state.count - 1};
                default:
                    throw new Error();
            }
        };

        let testState = undefined;
        let testDispatch = undefined;

        const render = (props, hooks) => {
            const { useReducer } = hooks;
            const [state, dispatch] = useReducer(reducer, initialState);
            testState = state;
            testDispatch = dispatch;
        };

        const element = getTestComponent(render);
        element.render();

        // assert default state is set
        assert.deepStrictEqual(testState, {count: 0});

        testDispatch({type: 'increment'});
        element.render();

        assert.deepStrictEqual(testState, {count: 1});
    });

    it('handles multiple instances of useReducer', async function() {
        const initialState1 = { count: 0 };
        const initialState2 = { isLoading: true };
        const reducer1 = (state, action) => {
            switch (action.type) {
                case 'increment':
                    return {count: state.count + 1};
                default:
                    throw new Error();
            }
        };

        const reducer2 = (state, action) => {
            switch (action.type) {
                case 'loaded':
                    return { isLoading: false };
                default:
                    throw new Error();
            }
        };

        let testState1 = undefined;
        let testDispatch1 = undefined;
        let testState2 = undefined;
        let testDispatch2 = undefined;

        const render = (props, hooks) => {
            const { useReducer } = hooks;
            const [state1, dispatch1] = useReducer(reducer1, initialState1);
            const [state2, dispatch2] = useReducer(reducer2, initialState2);
            testState1 = state1;
            testDispatch1 = dispatch1;
            testState2 = state2;
            testDispatch2 = dispatch2;
        };

        const element = getTestComponent(render);
        element.render();

        // assert initial reducer state
        assert.deepStrictEqual(testState1, {count: 0});
        assert.deepStrictEqual(testState2, {isLoading: true});

        testDispatch1({type: 'increment'});
        testDispatch2({type: 'loaded'});

        // simulate a component rerender
        element.render();

        assert.deepStrictEqual(testState1, {count: 1});
        assert.deepStrictEqual(testState2, {isLoading: false});
    });
});

const getTestComponent = (renderFn) => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        createUseReducer: createUseReducer,
        createUseContext: () => {},
        createProvideContext: () => {}
    });

    const TestComponent = functionElement(renderFn);
    return new TestComponent();
};