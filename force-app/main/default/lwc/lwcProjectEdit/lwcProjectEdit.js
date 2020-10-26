import { LightningElement, api  } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class LwcProjectEdit extends NavigationMixin(LightningElement){
    @api recordId;
    @api objectApiName="Project__c";

    handleSubmit(event){
        event.preventDefault();
        var isVal = true;
        
        /*this.template.querySelectorAll('lightning-input-field').forEach(element => {
            
            if(element.fieldName==='Start_Date__c'){
                  var currentDate = new Date();
                  currentDate.setHours(0,0);  
                  if(new Date(element.value)<currentDate){  
                    isVal=false;
                    this.errorFlag = 'Incorrect Date! Past Dates are not allowed.'
                  }
            }
            if(element.fieldName==="Duration__c" && Number(element.value)<=0){
                isVal=false;
                this.errorFlag = 'Incorrect Duration ! Duration can not be negative.'
            }
            isVal = isVal && element.reportValidity();
        });*/
        if(isVal){
            const fields = event.detail.fields;
            console.log(fields);
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        } else {
            this.handleError(event);
        }
    }

    handleSuccess(event){
            if(ShowToastEvent){
                const event1 = new ShowToastEvent({
                    title: 'Project updated',
                    message: 'Success: Record {0} updated!',
                    variant: "success",
                });
                this.dispatchEvent(new CustomEvent('close'));
                this.dispatchEvent(event1);
            }
            
           /* this[NavigationMixin.Navigate]({
               
            type: 'standard__recordPage',
                attributes: {
                    recordId: event.detail.id,
                    objectApiName: 'Project__c',
                    actionName: 'view'
                },
            });    */
            /*this[NavigationMixin.Navigate]({
                type: "standard__objectPage",
                attributes: {
                    objectApiName: "Project__c",
                    actionName: "view"
                },
                state: {
                    nooverride: 1,
                    useRecordTypeCheck: 1,
                    navigationLocation: 'LIST_VIEW',
                    backgroundContext: '/project/Project__c/00B2w00000BOW7KEAX',
                }
            }); */
        
            /*this[NavigationMixin.Navigate]({
                "type": "standard__objectPage",
                "attributes": {
                    "objectApiName": "Project__c",
                    "actionName": "home"
                },
                state: {
                    filterName: '00B2w00000BOW7KEAX'
                },
            });*/
        

        }
        handleError(event){
            if(ShowToastEvent){
                const event1 = new ShowToastEvent({
                    title: 'Project create',
                    message: 'Error: '+this.errorFlag,
                    variant: "error",
                });
                this.dispatchEvent(event1);
            }
            console.log(event.detail);
        }

}