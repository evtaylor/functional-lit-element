const assert = require('assert');

describe('showroom tests', () => {
    before(async function () {
        this.timeout(6000);
        await showroom.start();
    });

    require('./test-element');
    require('./test-element-with-props');
    require('./test-element-with-state');

    after(async function () {
        this.timeout(6000);
        await showroom.stop();
    });
});