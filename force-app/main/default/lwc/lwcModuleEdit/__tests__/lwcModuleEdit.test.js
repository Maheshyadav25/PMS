import { createElement } from 'lwc';
import ModuleEdit from 'c/lwcmoduleedit';
//class name
describe('c-lwc-module setup', () => {
    afterEach(() => {
        while (document.body.firstChild){
            document.body.removeChild(document.body.firstChild);
        }
    });
    it('displaying fields', () => {
        //create element
        const element = createElement('c-lwc-module',{
            is:ModuleEdit
        })
        //adding our comp into DOM
        document.body.appendChild(element);
        //Verify button click
        
    })

});