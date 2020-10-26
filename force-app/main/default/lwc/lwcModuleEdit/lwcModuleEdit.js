import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LwcModuleEdit extends LightningElement {
    @api recordId;
    @api objectApiName='Module__c';


    /*save() {
        this.dispatchEvent(new ShowToastEvent({
          title: 'Success',
          message: 'record sucessfully updated ',
          variant: 'success',
        }));
        this.dispatchEvent(new CustomEvent('close'));
      }*/
    handleSubmit(event){
        event.preventDefault();
        // eslint-disable-next-line vars-on-top
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
            // eslint-disable-next-line no-console
            console.log(fields);
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        } else {
            this.handleError(event);
        }
    }

    handleSuccess(){
            if(ShowToastEvent){
                const event1 = new ShowToastEvent({
                    title: 'Module updated',
                    message: 'Success: Record {0} updated!',
                    variant: "success",
                });
                this.dispatchEvent(new CustomEvent('close'));
                this.dispatchEvent(event1);
            }
            
                 

        }
        handleError(event){
            if(ShowToastEvent){
                const event1 = new ShowToastEvent({
                    title: 'Module create',
                    message: 'End Date cant less than Start Date',
                    variant: "error",
                });
                this.dispatchEvent(event1);
            }
            // eslint-disable-next-line no-console
            console.log(event.detail);
        }
}