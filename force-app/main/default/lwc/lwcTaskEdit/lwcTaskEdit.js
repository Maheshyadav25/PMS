import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAssignTeamMember from '@salesforce/apex/ProjectController.getAssignTeamMember'
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';

export default class LwcTaskEdit extends LightningElement {
    @api recordId;
    @api objectApiName='Task_PM__c';
    @api readOnly=false;
    @wire(getRecord, { recordId: '$recordId',  layoutTypes: ['Full'], modes: ['View'] })
    result({error,data}){
        if(data){
            console.log(data);
            console.log(data.id);
            /*if(data.CreatedById!=Id){
                this.readOnly=true;
            } else {
                this.readOnly=false;
            }*/

            this.getteamMember(data.id);
        }
        else if(error){
            this.readOnly=true;
        }
    }
    getteamMember(recordIdVal){
        getAssignTeamMember({recordId: recordIdVal })
        .then(result => {
            let values= [];
            result.forEach(compet => {
                values.push({compet});
               console.log(Id,'teamMember',compet);
            });
            
            for (let i = 0, l = values.length; i < l; i += 1) {
                if (values[i].compet === Id){
                
                    this.readOnly=true;
                    console.log('this.readOnly11...',this.readOnly);
                } 
              }
           
            console.log('this.readOnly...',this.readOnly);
        })
        .catch(error => {
            this.error = error;
        });
    }
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
            }*/
            /*if(element.fieldName==="End_Date__c"){
                  var startdate = new Date();
                  if(new Date(element.value)<startdate){
                isVal=false;
                this.errorFlag = 'Incorrect End Date ! EndDate can not be before Start Date.'
                }
            }*/
            //isVal = isVal && element.reportValidity();
        //});
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
                    title: 'Task updated',
                    message: 'Success: Record {0} updated!',
                    variant: "success",
                   
                });
                this.dispatchEvent(new CustomEvent('close'));
                this.dispatchEvent(event1);
                window.console.log('++++++++++++');
            }
            
           
        }
        handleError(event){
            if(ShowToastEvent){
                const event1 = new ShowToastEvent({
                    title: 'Task Update',
                    message: 'Error: '+this.errorFlag,
                    variant: "error",
                });
                this.dispatchEvent(event1);
            }
            console.log(event.detail);
        }
}