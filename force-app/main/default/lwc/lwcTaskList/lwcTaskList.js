import { LightningElement, track, wire, api } from 'lwc';
// importing to refresh the apex if any record changes the datas
import { refreshApex } from '@salesforce/apex';
// importing to show toast notifictions
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getAllTasks from '@salesforce/apex/lwcTaskList.getAllTasks';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    
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
export default class lwcTaskList extends NavigationMixin (LightningElement) {
    error;
    @track wiredTasklist;
    record = [];
    @api recordId;
    @track currentRecordId;
    @track actions = [
        { label: 'View', name: 'view' },
        { label: 'Edit', name: 'edit' },
    ];
    
    @track columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Start Date', fieldName: 'Start_Date__c', type: 'Date' },
        { label: 'End Date', fieldName: 'End_Date__c', type: 'Date' },
        //{ label: 'Project Name', fieldName: 'Projects__r.Name', type: 'Lookup' },
        {
            type: 'action',
            typeAttributes: { rowActions: this.actions },
        },
    ];
    @wire(getObjectInfo, { objectApiName: '$objectApiName'})
    objectInfo({ error, data }){
        if(data){
            if(data.updateable){
                this.actions.push({ label: 'Edit', name: 'edit' });
            }
            if(data.deletable){
                this.actions.push({ label: 'Delete', name: 'delete' });
            }   
        } 
    }
    @wire(getAllTasks,{ recordId: '$recordId' })
    tasks;
    
    // and wired and apex method called imperatively

    refresh(event) {
    this.wiredTasklist = event.target.value;
    return refreshApex(this.tasks);
    /*if(result.data) {
        this.tasks = result.data;
    }*/
}

  /*renderedCallback() {
        console.log("allTasks >" + JSON.stringify(this.tasks));

        console.log("recordId >>>" + this.recordId);

    }*/

    connectedCallback(){
        console.log("allTasks >" + JSON.stringify(this.tasks));

        console.log("recordId row >>>" + this.recordId);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        window.console.log('Row'+actionName);

        const row = event.detail.row;
        window.console.log('Row========>' +JSON.stringify(row));
        //window.console.log('row'+row.id);

        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        objectApiName : 'Task_PM__c',
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
                case 'edit':
                   /* this.editmodule(row)
                     break;*/
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Task_PM__c',
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
    }

        //Task edit
    dShowModal = false;

    openModal2() {

        this.dShowModal = true;
    }

    closeModal2() {
        this.dShowModal = false;
    }

    editmodule(currentRow) {
        // open modal box
        this.currentRecordId = currentRow.Id;
        window.console.log('!!!!!', currentRow.Id);
        this.openModal2();
        //return refreshApex(this.Project_Task__c);
        //return refreshApex(this.refreshTable);

    }
     // handleing record edit form submit
    /* handleSubmit(event) {
        // prevending default type sumbit of record edit form
        event.preventDefault();

        // querying the record edit form and submiting fields to form
        this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);

        // closing modal
        this.dShowModal = false;

        // showing success message
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: event.detail.fields.Name + 'Task updated Successfully!!.',
            variant: 'success'
        }),);

    }*/

    // refreshing the datatable after record edit form success
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }

    // for start date validation
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
    //this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
        if(ShowToastEvent){
            const event1 = new ShowToastEvent({
                title: 'Task updated',
                message: 'Success: Record {0} updated!',
                ///message: event.detail.fields.Name +' Module updated Successfully!!.',
                variant: "success",
            });
            this.dShowModal = false;
            this.dispatchEvent(event1);
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