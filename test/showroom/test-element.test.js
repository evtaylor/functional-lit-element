const showroom = require('showroom/puppeteer')();
// const showroom = require('showroom/puppeteer')({headless:false});
const assert = require('assert');
const sinon = require('sinon');

describe('test-component', () => {
    before(async function() {
        this.timeout(5000);
        await showroom.start();
    });

    after(async function() {
        this.timeout(5000);
        await showroom.stop();
    });

    beforeEach(async function () {
    });

    it('do basic render', async function() {
        await showroom.setTestSubject('test-element');
        const p = await showroom.find('// p');
        const text = await showroom.getTextContent(p);
        assert.strictEqual(text, "Hello World");
    });

    it('should render from attributes', async function() {
        await showroom.setTestSubject('test-element-with-props');

        const checkbox = await showroom.find('// input');
        const p = await showroom.find('// p');
        const button = await showroom.find('// button');

        // const mockFn = sinon.spy();

        await showroom.setAttribute('testString', 'Bar');
        await showroom.setAttribute('testBool', true);

        const isChecked = await showroom.hasAttribute('checked', checkbox);
        const pText = await showroom.getTextContent(p);
        await showroom.trigger('clickButton');

        const updatedClickCount = await showroom.getProperty('_clickedCount');

        assert.strictEqual(isChecked, true);
        assert.strictEqual(pText, "Hello Bar");
        assert.strictEqual(updatedClickCount, 1);
    });
});