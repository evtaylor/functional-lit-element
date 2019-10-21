const showroom = require('showroom/puppeteer')();
const assert = require('assert');

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
        await showroom.setTestSubject('test-element');
    });

    it('should do stuff', async function() {
        await showroom.setAttribute('title', 'Cool Title');
        const p = await showroom.find('// p');
        const text = await showroom.getTextContent(p);
        assert.strictEqual(text, "Hello World");
    });
});