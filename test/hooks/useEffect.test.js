import assert from 'assert';
import sinon from 'sinon';
import { createUseEffect } from '../../src/hooks/useEffect';
import functionalElementFactory from '../../src/functionalElement';

describe('useEffect', () => {
    it('triggers effect to be run at render time', function() {
        const anEffect = sinon.spy();
        const render = (props, hooks) => {
            const { useEffect } = hooks;
            useEffect(anEffect);
        };
        const element = getTestComponent(render);
        element.render();

        assert(anEffect.calledOnce)
    });

    it('handles multiple effects', function() {

        const anEffect1 = sinon.spy();
        const anEffect2 = sinon.spy();

        const render = (props, hooks) => {
            const { useEffect } = hooks;
            useEffect(anEffect1);
            useEffect(anEffect2);
        };
        const element = getTestComponent(render);

        // simulate a component rerender
        element.render();

        assert(anEffect1.calledOnce);
        assert(anEffect2.calledOnce);
    });

    it('runs effect on each render when no state is watched', function() {
        const anEffect = sinon.spy();

        const render = (props, hooks) => {
            const { useEffect } = hooks;
            useEffect(anEffect);
        };
        const element = getTestComponent(render);

        element.render();
        element.render();

        assert(anEffect.calledTwice)
    });

    it('runs effect only once when state hasn\'t changed', function() {
        const anEffect = sinon.spy();
        const state = 1;

        const render = (props, hooks) => {
            const { useEffect } = hooks;
            useEffect(anEffect, [state]);
        };

        const element = getTestComponent(render);

        element.render();
        element.render();

        assert(anEffect.calledOnce)
    });

    it('runs effect only once empty state provided', function() {
        const anEffect = sinon.spy();
        const render = (props, hooks) => {
            const { useEffect } = hooks;
            useEffect(anEffect, []);
        };
        const element = getTestComponent(render);

        element.render();
        element.render();

        assert(anEffect.calledOnce)
    });
});

const getTestComponent = (renderFn) => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: createUseEffect,
        createUseReducer: () => {},
        createUseContext: () => {},
        createProvideContext: () => {}
    });

    const TestComponent = functionElement(renderFn);
    return new TestComponent();
};