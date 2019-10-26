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
        const testElement = getTestComponent();
        const testContextName = 'abc123';
        const fakeContextData = {
            hello: "world"
        };
        const fakeContext = {
            _contextName: testContextName
        };
        testElement._context[testContextName] = fakeContextData;

        const useContext = createUseContext(testElement);
        const result = useContext(fakeContext);
        assert.deepStrictEqual(result, fakeContextData)
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