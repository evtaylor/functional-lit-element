const assert = require('assert');

describe('test-component', () => {
    it('do basic render', async function() {
        await showroom.setTestSubject('test-element');
        const p = await showroom.find('// p');
        const text = await showroom.getTextContent(p);
        assert.strictEqual(text, "Hello World");
    });
});