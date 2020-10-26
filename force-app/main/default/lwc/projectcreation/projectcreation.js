import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/CreateProject.getAllProjects';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];
const columns = [
    //{ label: 'Id', fieldName: 'Id',  editable: true },
    { label: 'Projects Name', fieldName: 'Name', editable: true },
    { label: 'Status', fieldName: 'Status__c', type: 'Picklist', editable: true },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class projectcreation extends NavigationMixin(LightningElement) {

    
    successHandler(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.Name + 'created.',
                variant: 'success',
            }),
        );
   
    
        //goToStepTwo() {
        this.currentStep = '2';

        this.template.querySelector('div.stepOne').classList.add('slds-hide');
        this.template
            .querySelector('div.stepTwo')
            .classList.remove('slds-hide');

        }
    //Fetching record
    @track Project__c;
    @track error;
    @track columns = columns;

    handleKeyChange(event) {
        const strName = event.target.value;
        if (strName) {
            getProject({ strName })
                .then(result => {
                    this.Project__c = result;
                    console.log('I am here', this.Project__c);
                    // console.log(JSON.stringify(result, null, '\t'));

                })
                .catch(error => {
                    this.error = error;
                });
        } else
            this.Projects = undefined;
    }

    //****Inline edit  Script******//
    handleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));

        Promise.all(promises).then(Project__c => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Projects updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];

            // Display fresh data in the datatable
            return refreshApex(this.Project__c);
        }).catch(error => {
            // Handle error
        });
    }

    //*****To do edit and view the record*****//

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        objectApiName : 'Project__c',
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Project__c',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }

    }



    //******Progress Indicators ****/
    @track currentStep;
    goBackToStepOne() {
        this.currentStep = '1';

        this.template.querySelector('div.stepTwo').classList.add('slds-hide');
        this.template
            .querySelector('div.stepOne')
            .classList.remove('slds-hide');
    }



    goToStepTwo() {
        this.currentStep = '2';

        this.template.querySelector('div.stepOne').classList.add('slds-hide');
        this.template
            .querySelector('div.stepTwo')
            .classList.remove('slds-hide');
    }
    goBackToStepTwo() {
        this.currentStep = '2';

        this.template.querySelector('div.stepThree').classList.add('slds-hide');
        this.template
            .querySelector('div.stepTwo')
            .classList.remove('slds-hide');
    }
    goToStepThree() {
        this.currentStep = '3';

        this.template.querySelector('div.stepTwo').classList.add('slds-hide');
        this.template
            .querySelector('div.stepThree')
            .classList.remove('slds-hide');
    }
    

    goBackToStepThree() {
        this.currentStep = '3';

        this.template.querySelector('div.stepFour').classList.add('slds-hide');
        this.template
            .querySelector('div.stepThree')
            .classList.remove('slds-hide');
    }
    goToStepFour() {
        this.currentStep = '4';

        this.template.querySelector('div.stepThree').classList.add('slds-hide');
        this.template
            .querySelector('div.stepFour')
            .classList.remove('slds-hide');
    }

    goBackToStepFour() {
        this.currentStep = '4';

        this.template.querySelector('div.stepFive').classList.add('slds-hide');
        this.template
            .querySelector('div.stepFour')
            .classList.remove('slds-hide');
    }

    goToStepFive() {
        this.currentStep = '5';

        this.template.querySelector('div.stepFour').classList.add('slds-hide');
        this.template
            .querySelector('div.stepFive')
            .classList.remove('slds-hide');
    }


}