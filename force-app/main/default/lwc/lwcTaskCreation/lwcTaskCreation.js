import { LightningElement, wire, track } from 'lwc';
// importing to refresh the apex if any record changes the datas
import { refreshApex } from '@salesforce/apex';
// importing to show toast notifictions
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getAllModules from '@salesforce/apex/CreateTask.getAllModules';


const actions = [
    { label: 'View', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Create Task', name: 'create_task' },
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'Date' },
    { label: 'End Date', fieldName: 'End_Date__c', type: 'Date' },
    //{ label: 'Project Name', fieldName: 'Projects__r.Name', type: 'Lookup' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class TaskCreation extends LightningElement {
    error;
    record = [];
    selectedRecords = [];
    @track currentRecordId;
    isEditForm = false;
    columns = columns;
    @wire(getAllModules)
    modules;
    @track bShowModal = false;
    @track clickedRowData;
 
    openModal() {
        this.bShowModal = true;
    }
 
    closeModal() {
        this.bShowModal = false;
    }
    handleRowAction(event){
        let actionName = event.detail.action.name;

        window.console.log('actionName ====> ' + actionName);

        let row = event.detail.row;

        window.console.log('row ====> ' + JSON.stringify(row));

        window.console.log('row ====> ' + row.Id);
        // eslint-disable-next-line default-case
        switch (actionName) {
            case 'record_details':
                this.viewCurrentRecord(row);
                break;
            case 'edit':
                this.editCurrentRecord(row);
                break;
            case 'create_task':
                this.createtask(row);
                break;
        }
    }
     // view the current record details
     viewCurrentRecord(currentRow) {
        this.isEditForm = false;
        //this.bShowModal=event.target.value;
        this.clickedRowData = currentRow;
        this.openModal();

    }

   

    editCurrentRecord(currentRow) {
        // open modal box
        this.openModal();
        this.isEditForm = true;

        // assign record id to the record edit form
        this.currentRecordId = currentRow.Id;
    }

    // handleing record edit form submit
    handleSubmit(event) {
        // prevending default type sumbit of record edit form
        event.preventDefault();

        // querying the record edit form and submiting fields to form
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

        // closing modal
        this.bShowModal = false;

        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: event.detail.fields.FirstName + ' '+ event.detail.fields.LastName +' Contact updated Successfully!!.',
            variant: 'success'
        }),);

    }

    // refreshing the datatable after record edit form success
    /*handleSuccess() {
        return refreshApex(this.refreshTable);
    }*/



    cShowModal = false;
 
    openModal1() {

        this.cShowModal = true;
    }
 
    closeModal1() {
        this.cShowModal = false;
    }

    createtask(currentRow) {
        // open modal box
        this.currentRecordId = currentRow.Id;
        window.console.log('!!!!!',currentRow.Id);
        this.openModal1();

    }

    handleSuccess(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: event.detail.Name + 'created.',
                variant: 'success',
            }),
        );
        return refreshApex(this.Project_Task__c);
   
    }


   


}