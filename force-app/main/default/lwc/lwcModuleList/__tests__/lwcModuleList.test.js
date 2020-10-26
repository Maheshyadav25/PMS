import { createElement } from 'lwc';
import ModuleList from 'c/lwcModuleList';
describe('c-lwc-module', () => {
    afterEach(() => {
        while (document.body.firstChild){
            document.body.removeChild(document.body.firstChild);
        }
    });
    it('display Name', () => {
        //create element
        const element = createElement('c-lwc-module', {
            is: ModuleList
        });
        document.body.appendChild(element);
        //verify displayed wellcome message
        const div = element.shadowRoot.querySelector('lightning-card');
        expect(div.textContent).toBe('Modules'); 
    });
});