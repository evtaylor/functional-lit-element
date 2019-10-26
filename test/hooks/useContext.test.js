import assert from 'assert';
import { createUseContext } from '../../src/hooks/useContext';
import functionalElementFactory from '../../src/functionalElement';
import {runEffect} from "../../src/hooks/useEffect";

describe('useState', () => {
    it('returns updated value when changed on next render', async function () {
        const testElement = getTestComponent();
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