import assert from 'assert';
import functionalElementFactory from '../src/functionalElement';

describe('functionalElement', () => {
    it('only provides defined props to render function', function (done) {
        this.timeout(500);
        const properties = {
            greeting: { type: String}
        };

        const render = (props) => {
            assert.deepStrictEqual(Object.keys(props), ['greeting']);
            done();
        };

        const element = getTestComponent(render, properties);
        element.render();
    });

    it('element properties cant be modified by changing modifying render props', function () {
        const properties = {
            test: { type: Object }
        };

        const render = (props) => {
            props.test = { hello: "bug" };
        };

        const element = getTestComponent(render, properties);
        element.test = { hello: "world" };
        element.render();

        assert.deepStrictEqual(element.test, { hello: "world" })
    });
});


const getTestComponent = (renderFn, props) => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        createUseReducer: () => {},
        createUseContext: () => {},
        createProvideContext: () => {}
    });

    const TestComponent = functionElement(renderFn, props);
    return new TestComponent();
};