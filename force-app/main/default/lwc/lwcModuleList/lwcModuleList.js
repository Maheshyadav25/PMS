import { LightningElement, wire, track, api } from 'lwc';
// importing to refresh the apex if any record changes the datas
import { refreshApex } from '@salesforce/apex';
// importing to show toast notifictions
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import getAllModules from '@salesforce/apex/lwcModuleList.getAllModules';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { deleteRecord } from 'lightning/uiRecordApi';
export default class lwcModuleList extends NavigationMixin(LightningElement) {
    error;
    record = [];
    @api objectApiName = "Module__c"
    @api recordId;
    @track wiredTasklist;
    @track searchString='';
    selectedRecords = [];
    @track currentRecordId;
    isEditForm = false;
    @track actions = [
        { label: 'View', name: 'view' },
        //{ label: 'Edit', name: 'edit' },
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
            this.actions.push({ label: 'Create Task', name: 'create_task' });
            this.actions.push({ label: 'View Task', name: 'related_task' });
        } else if(error){
            this.isCreateable= false;
        }
    }    
    @wire(getAllModules, { recordId: '$recordId', searchString : '$searchString' })
    modules;
   
    refresh(event) {
        this.wiredTasklist = event.target.value;
        return refreshApex(this.modules);
        /*if(result.data) {
            this.tasks = result.data;
        }*/
    }

    @track clickedRowData;
    renderedCallback() {
        // eslint-disable-next-line no-console
        console.log("allmodule >" + JSON.stringify(this.modules));

        // eslint-disable-next-line no-console
        console.log("recordId >" + this.recordId);

    }
    connectedCallback(){
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        //window.console.log('Action name' + actionName);

        const row = event.detail.row;
        /*window.console.log('Row========>' + JSON.stringify(row));
        window.console.log('Row==>' + row.id);*/

        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        objectApiName: 'Module__c',
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
               this.editmodule(row)
                break;
                /*this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: 'Module__c',
                        actionName: 'edit'
                    }
                });*/
                
                case 'delete':
                    deleteRecord(row.Id)
                    .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Record deleted',
                                variant: 'success'
                            })
                        );
                        this[NavigationMixin.Navigate]({
                            type: 'standard__objectPage',
                            attributes: {
                                objectApiName: 'Project__c',
                                actionName: 'home',
                            },
                        });
                        return refreshApex(this.modules);
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error deleting record',
                                message: error.body.message,
                                variant: 'error'
                            })
                        );
                    });
                    break;    
            case 'create_task':
                this.createtask(row);
                break;
            
            case 'related_task':
                    this.relatedstask(row);
                    break;
            default:

        }
        //return refreshApex(this.Task_PM__c);
       // closeModal1();
    }
    //Module edit
    @track dShowModal = false;

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
           // message: event.detail.fields.Name + ' '+ event.detail.fields.LastName +' Module updated Successfully!!.',
            message: event.detail.fields.Name +' Module updated Successfully!!.',
            variant: 'success'
        }),);

    }*/

    // refreshing the datatable after record edit form success
    handleSuccess() {
        return refreshApex(this.refreshTable);
    }


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
        window.console.log('!!!!!', currentRow.Id);
        this.openModal1();
        //return refreshApex(this.Project_Task__c);
        //return refreshApex(this.refreshTable);

    }
    @track bShowModal = false;

    openModal() {

        this.bShowModal = true;
    }

    closeModal() {
        this.bShowModal = false;
    }

    relatedstask(currentRow) {
        // open modal box
        this.currentRecordId = currentRow.Id;
        window.console.log('!!!!!RElated', currentRow.Id);
        this.openModal();
        
    }
    handleEvent(){
        this.closeModal1();
        
    }
    closeCreateModel(){
        this.closeModal1();
    }
    // eslint-disable-next-line consistent-return
    handleSearch(event){
        if(event.keyCode===13){
            this.searchString= event.target.value;
            return refreshApex(this.modules);
        }
    }

// for start date validation
handleSubmit(event){
    event.preventDefault();
    // eslint-disable-next-line vars-on-top
    var isVal = true;
    
   /* this.template.querySelectorAll('lightning-input-field').forEach(element => {
        
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

// eslint-disable-next-line no-dupe-class-members
handleSuccess(){
    //this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
        if(ShowToastEvent){
            const event1 = new ShowToastEvent({
                title: 'Module updated',
                ///message: event.detail.fields.Name +' Module updated Successfully!!.',
                variant: "success",
            });
            this.dShowModal = false;
            this.dispatchEvent(event1);
        }
        
       
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
                title: 'Module Update',
                message: 'End Date cant less than Start Date',
                variant: "error",
            });
            this.dispatchEvent(event1);
        }
        // eslint-disable-next-line no-console
        console.log(event.detail);
    }


}