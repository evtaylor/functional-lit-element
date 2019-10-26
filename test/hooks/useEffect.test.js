import assert from 'assert';
import sinon from 'sinon';
import { createUseEffect, runEffect } from '../../src/hooks/useEffect';
import functionalElementFactory from '../../src/functionalElement';

describe('useEffect', () => {
    it('triggers effect to be run at render time', async function() {
        const element = getTestComponent();
        const useEffect = createUseEffect(element);
        const anEffect = sinon.spy();

        useEffect(anEffect);

        // simulate a component rerender
        element.render();

        assert(anEffect.calledOnce)
    });

    it('handles multiple effects', async function() {
        const element = getTestComponent();
        const useEffect = createUseEffect(element);
        const anEffect1 = sinon.spy();
        const anEffect2 = sinon.spy();

        useEffect(anEffect1);
        useEffect(anEffect2);

        // simulate a component rerender
        element.render();

        assert(anEffect1.calledOnce);
        assert(anEffect2.calledOnce);
    });

    it('runs effect on each render when no state is watched', async function() {
        const element = getTestComponent();
        const useEffect = createUseEffect(element);
        const anEffect = sinon.spy();

        useEffect(anEffect);
        element.render();

        useEffect(anEffect);
        element.render();

        assert(anEffect.calledTwice)
    });

    it('runs effect only once when state hasn\'t changed', async function() {
        const element = getTestComponent();
        const useEffect = createUseEffect(element);
        const anEffect = sinon.spy();
        const state = 1;

        useEffect(anEffect, [state]);
        element.render();

        useEffect(anEffect, [state]);
        element.render();

        assert(anEffect.calledOnce)
    });

    it('runs effect only once empty state provided', async function() {
        const element = getTestComponent();
        const useEffect = createUseEffect(element);
        const anEffect = sinon.spy();

        useEffect(anEffect, []);
        element.render();

        useEffect(anEffect, []);
        element.render();

        assert(anEffect.calledOnce)
    });
});

const getTestComponent = () => {
    const functionElement = functionalElementFactory({
        LitElement: class{
            render() {}
        },
        createUseState: () => {},
        createUseEffect: () => {},
        runEffect: runEffect,
        createUseReducer: () => {},
        createUseContext: () => {}
    });

    const TestComponent = functionElement(() => {});
    return new TestComponent();
};