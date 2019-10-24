import assert from 'assert';
import { createUseState } from '../../src/hooks/useState';

describe('useState', () => {
    before(async function() {

    });

    after(async function() {

    });

    beforeEach(async function () {
    });

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

});

const getTestComponent = () => {
    return new class {
        constructor() {
            this._dynamicReducerState = {};
            this._reducerStateKey = 0;

            this._dynamicState = {};
            this._stateKey = 0;

            this._hookKey = 0;
            this._hooks = [];
            this._hookState = [];

            this._context = {};
        }

        render() {
            this._stateKey = 0;
            this._reducerStateKey = 0;
            this._hookKey = 0;
            this._hooks = [];
        }
    }
}