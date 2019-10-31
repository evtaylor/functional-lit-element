const assert = require('assert');

describe('test-element-with-props', () => {
    it('should render from attributes', async function() {
        await showroom.setTestSubject('test-element-with-props');

        const checkbox = await showroom.find('// input');
        const p = await showroom.find('// p');

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