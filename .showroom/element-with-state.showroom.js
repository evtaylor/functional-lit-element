
export default {
    component: 'test-element-with-state',
    alias: 'Functional Lit: <test-element-with-state>',
    section: 'Functional Lit-Element',
    path: './test/elements/test-element-with-state.js',
    functions: {
        clickButton: () => {
            showroom.component.shadowRoot.querySelector('button').click();
        }
    },
}