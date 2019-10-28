import assert from 'assert';
import { createUseContext, createContext, createProvideContext } from '../../src/hooks/useContext';
import functionalElementFactory from '../../src/functionalElement';
import sinon from "sinon";

describe('useContext', () => {
    before(() => {
        global.Event = class{};
    });

    it('provideContext sets context on element', function () {
        const defaultData = { hello: "world" };
        const context = createContext(defaultData);
        const render = (props, hooks) => {
            const { provideContext } = hooks;

            provideContext(context)
        };
        const element = getTestComponent(render);
        element.render();

        assert.deepStrictEqual(element._context.get(context.id), defaultData)
    });

    after(() => {
        delete global.Event;
    })

});

const getTestComponent = (renderFn) => {
    const functionElement = functionalElementFactory({
        LitElement: class {
            render() {}
            addEventListener() {}
            dispatchEvent() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        createUseReducer: () => {},
        createUseContext: createUseContext,
        createProvideContext: createProvideContext
    });

    const TestComponent = functionElement(renderFn);
    return new TestComponent();
};