import { LightningElement,track,wire,api } from 'lwc';
import readDataList from '@salesforce/apex/ProjectController.readDataList'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];

const columns = [
    { label: 'Name', fieldName: 'Name'},
    { label: 'Status', fieldName: 'Status__c'},
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class LwcProjectListView extends NavigationMixin (LightningElement) {
    @api objectApiName = 'Project__c';
    @track columns= columns;
    @track error;
    @track isCreateable;
    @track searchString='';
    @wire(readDataList, {objectApiName:'$objectApiName', searchString : '$searchString'})
    dataList;



    @wire(getObjectInfo, { objectApiName: '$objectApiName'})
    objectInfo({ error, data }){
        if(data){
            this.isCreateable  = data.createable;
        } else if(error){
            this.isCreateable= false;
        }
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const currentRecord = event.detail.row.Id;
        switch (actionName) {
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        objectApiName : this.objectApiName,
                        recordId: currentRecord,
                        actionName: 'view'
                    }
                });
                break;
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: currentRecord,
                        objectApiName: this.objectApiName,
                        actionName: 'edit'
                    }
                });
                break;
            default:
        }
    }
    refreshList(event){
        return refreshApex(this.dataList);
    }
    createNewProject(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
                actionName: 'new'
            },
        });
    }
    handleSearch(event){
        if(event.keyCode==13){
            this.searchString= event.target.value;
            return refreshApex(this.dataList);
        }
    }

}