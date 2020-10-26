import { LightningElement,api,track } from 'lwc';
import getResults from '@salesforce/apex/lwcCustomLookupController.getResults';

export default class LwcAddResources extends LightningElement {
    @api objectName = 'User';
    @api fieldName = 'Name';
    @api parentId ;
    @api Label;
    @track searchRecords = [];
    @api selectedRecords = [];
    @api required = false;
    @api iconName = 'standard:user'
    @api LoadingText = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track messageFlag = false;
    @track currentText;
    handleChange(event){
        this.currentText = event.target.value;
    }
    searchField(event) {

        //var currentText = event.target.value;
        var selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            selectRecId.push(this.selectedRecords[i].recId);
        }
        this.LoadingText = true;
        if(this.currentText){
            getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: this.currentText, selectedRecId : selectRecId, parentId : this.parentId})
            .then(result => {
                this.searchRecords= result;
                this.LoadingText = false;
                
                this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                if(this.currentText.length > 0 && result.length == 0) {
                    this.messageFlag = true;
                }
                else {
                    this.messageFlag = false;
                }

                if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                    this.iconFlag = false;
                    this.clearIconFlag = true;
                }
                else {
                    this.iconFlag = true;
                    this.clearIconFlag = false;
                }
            })
            .catch(error => {
                console.log('-------error-------------'+error);
                console.log(error);
            });    
        } else {
                this.messageFlag = false;
        }
        
        
    }
    
   setSelectedRecord(event) {
        var recId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        let newsObject = { 'recId' : recId ,'recName' : selectName};
        if(this.parentId){
            newsObject.taskGUID  = this.parentId;
        }
        this.selectedRecords.push(newsObject);
        this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        let selRecords = this.selectedRecords;
		this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
        });
        let selRecord = {parentGUID : this.selectedRecords[0].taskGUID,  
                         resources : this.selectedRecords};
        //let selRecordsMap = new Map();
        //selRecordsMap.set(this.selectedRecords[0].taskGUID, this.selectedRecords);
        const selectedEvent = new CustomEvent('selected', { detail: selRecord});
        
        //const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    removeRecord (event){
        let selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            if(event.detail.name !== this.selectedRecords[i].recId)
                selectRecId.push(this.selectedRecords[i]);
        }
        this.selectedRecords = [...selectRecId];
        console.log('Changes');
        let selRecord = {parentGUID : this.selectedRecords[0].taskGUID,  
            resources : this.selectedRecords};
        
        const selectedEvent = new CustomEvent('selected', { detail: selRecord});
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
    closeModel(event){
        // Dispatches the event.
        this.dispatchEvent(new CustomEvent('close'));
    }
    connectedCallback(){
        if(!this.selectedRecords){this.selectedRecords=[];}
    }
}