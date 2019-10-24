const testFunc = () => {
    if (!showroom.component._clickedCount) showroom.component._clickedCount = 0;
    showroom.component._clickedCount++;
};

export default {
    component: 'test-element-with-props',
    alias: 'Functional Lit: <test-element-with-props>',
    section: 'Functional Lit-Element',
    path: './test/elements/element-with-props.js',
    functions: {
        clickButton: () => {
            showroom.component.shadowRoot.querySelector('button').click()
        }
    },
    properties: {
        testFunction: testFunc
    }
}