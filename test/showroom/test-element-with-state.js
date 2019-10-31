const assert = require('assert');

describe('test-element-with-state', () => {
    it('should useState hook', async function() {
        await showroom.setTestSubject('test-element-with-state');

        const span = await showroom.find('// span');
        const numClicks = parseInt(await showroom.getTextContent(span));
        assert.strictEqual(numClicks, 0);

        await showroom.trigger('clickButton');

        const numClicksUpdated = parseInt(await showroom.getTextContent(span));
        assert.strictEqual(numClicksUpdated, 1);
    });
});