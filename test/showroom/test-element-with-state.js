const assert = require('assert');

describe('test-element-with-state', () => {
    it('should useState hook', async function() {
        await showroom.setTestSubject('test-element-with-state');
        // Workaround for showroom issue: https://github.com/eavichay/showroom/issues/11
        await new Promise(resolve=>setTimeout(()=>resolve(), 10));

        const span = await showroom.find('// span');
        const numClicks = parseInt(await showroom.getTextContent(span));
        assert.strictEqual(numClicks, 0);

        await showroom.trigger('clickButton');

        const numClicksUpdated = parseInt(await showroom.getTextContent(span));
        assert.strictEqual(numClicksUpdated, 1);
    });
});