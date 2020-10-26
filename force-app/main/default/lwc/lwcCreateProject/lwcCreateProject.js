import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProject from '@salesforce/apex/CreateProject.getAllProjects';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Create Module', name: 'create_module' },
];
const columns = [
    { label: 'Projects', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c', type: 'Picklist' },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'Date' },
    { label: 'Category', fieldName: 'Category__c', type: 'Picklist' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class projectcreation extends NavigationMixin(LightningElement) {

    
    error;
    columns = columns;
    @wire(getProject)
    projects;
    @track bShowModal = false;
    @track currentRecordId;

    openModal() {
        this.bShowModal = true;
    }

    closeModal() {
        this.bShowModal = false;
        
    }

    successHandler(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.id + 'created.',
                variant: 'success',
            }),
        );        
        return refreshApex(this.Project__c);
    }

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
            case 'create_module':
                this.createmodule(row);
                break;
                default:
        }
        return refreshApex(this.Module__c);

    }


 cShowModal = false;
 
    openModal1() {

        this.cShowModal = true;
    }
 
    closeModal1() {
        this.cShowModal = false;
    }

    createmodule(currentRow) {
        // open modal box
        this.currentRecordId = currentRow.Id;
        window.console.log('!!!!!',currentRow.Id);
        this.openModal1();
        
    }

   /*handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.Name + 'created.',
                variant: 'success',
            }),
            
        );
        this.closeModal1();
        return refreshApex(this.refreshTable);
        
    }*/


    
        
}