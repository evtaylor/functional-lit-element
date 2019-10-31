const assert = require('assert');

describe('test-component', () => {
    it('do basic render', async function() {
        await showroom.setTestSubject('test-element');
        // Workaround for showroom issue: https://github.com/eavichay/showroom/issues/11
        await new Promise(resolve=>setTimeout(()=>resolve(), 10));

        const p = await showroom.find('// p');
        const text = await showroom.getTextContent(p);
        assert.strictEqual(text, "Hello World");
    });
});