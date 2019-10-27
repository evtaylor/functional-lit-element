import assert from 'assert';
import { createUseContext, createContextProvider } from '../../src/hooks/useContext';
import functionalElementFactory from '../../src/functionalElement';
import sinon from "sinon";

describe('useContext', () => {
    it('createContext creates basic context with name', async function () {
        const directiveFake = sinon.fake.returns(() => {});
        const PropertyPart = class{};
        const contextData = {
            hello: "world"
        };

        const createContext = createContextProvider({directive: directiveFake, PropertyPart});
        const context = createContext(contextData);
        assert(context._contextName.length > 0)
    });

    it('useContext returns data from context property', async function () {

        const testContextName = 'abc123';
        const fakeContextData = {
            hello: "world"
        };
        const fakeContext = {
            _contextName: testContextName
        };

        let testResult = undefined;

        const render = (props, hooks) => {
            const { useContext } = hooks;
            testResult = useContext(fakeContext);
        };
        const component = getTestComponent(render);
        component._context[testContextName] = fakeContextData;
        component.render();

        assert.deepStrictEqual(testResult, fakeContextData)
    });
});

const getTestComponent = (renderFn) => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        createUseReducer: () => {},
        createUseContext: createUseContext
    });

    const TestComponent = functionElement(renderFn);
    return new TestComponent();
};