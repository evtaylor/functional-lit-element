import assert from 'assert';
import { createUseReducer } from '../../src/hooks/useReducer';
import functionalElementFactory from '../../src/functionalElement';

describe('useReducer', () => {
    it('returns updated value when changed on next render', async function() {
        const element = getTestComponent();
        const useReducer = createUseReducer(element);
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

        const [state, dispatch] = useReducer(reducer, initialState);
        dispatch({type: 'increment'});

        // simulate a component rerender
        element.render();

        const [updatedState, newDispatch] = useReducer(reducer, initialState);
        assert.deepStrictEqual(updatedState, {count: 1});
    });

    it('handles multiple instances of useReducer', async function() {
        const element = getTestComponent();
        const useReducer = createUseReducer(element);
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

        const [state1, dispatch1] = useReducer(reducer1, initialState1);
        const [state2, dispatch2] = useReducer(reducer2, initialState2);

        // assert initial reducer state
        assert.deepStrictEqual(state1, {count: 0});
        assert.deepStrictEqual(state2, {isLoading: true});

        dispatch1({type: 'increment'});
        dispatch2({type: 'loaded'});

        // simulate a component rerender
        element.render();

        const [updatedState1, newDispatch1] = useReducer(reducer1, initialState1);
        const [updatedState2, newDispatch2] = useReducer(reducer2, initialState2);
        assert.deepStrictEqual(updatedState1, {count: 1});
        assert.deepStrictEqual(updatedState2, {isLoading: false});
    });
});

const getTestComponent = () => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        runEffect: () => {},
        createUseReducer: () => {},
        createUseContext: () => {}
    });

    const TestComponent = functionElement(() => {});
    return new TestComponent();
};