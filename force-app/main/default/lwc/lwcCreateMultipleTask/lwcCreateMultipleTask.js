import { LightningElement, track,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import processResources from '@salesforce/apex/lwcCustomLookupController.processResources';
export default class LwcCreateMultipleTask extends NavigationMixin(LightningElement) {
 @api 
 get currentTask(){
     return this._currentTaskId;
 }    
 set currentTask(value) {
    if(value){
        this._currentTaskId = value;
    }
 }
 @api
    get getIdFromParent() {

  // eslint-disable-next-line no-console

  return this._getIdFromParent;

 }
  set getIdFromParent(value) {

  if(value){

   this._getIdFromParent = value;

  }

  else{
    this._getIdFromParent = undefined;
    }
 }
 @api get getApiName(){
    return this._getApiName;
        
 }
 set getApiName(value){
     if(value){
         this._getApiName = value;
     }else{
        this._getApiName = undefined;
        }
 }
 @api get areTaskVisible(){
    return this._areTaskVisible;
 }
 set areTaskVisible(value){
    if(value){
        this._areTaskVisible = value;
    }else{ 
       this._areTaskVisible = undefined;
       }
}
    keyIndex = 0;
    @track currentTaskMembers=[];
    @track itemList = [];
    @track cShowModal = false;
    @track resources=new Map();
    addRow() {
        if(this._areTaskVisible === true){
            ++this.keyIndex;
            window.console.log('!!!!!',this._getIdFromParent);
            var newItem = [{ id: this.keyIndex,Module__c :this._getIdFromParent, GUID__c : (this._getIdFromParent+':'+this.createGuid())}];
            this.itemList = this.itemList.concat(newItem);
        }else{
            ++this.keyIndex;
            var newItem = [{ id: this.keyIndex,Projects__c :this._getIdFromParent}];
            this.itemList = this.itemList.concat(newItem);
           }
            
    }

    removeRow(event) {
     
     /*   let idStr=event.target.id.split('-');
     
          console.log("data"+JSON.stringify(this.itemList));
        this.itemList.splice(idStr[0],1);*/
        
         if (this.itemList.length >= 2) {
             this.itemList = this.itemList.filter(function (element) {
                window.console.log(parseInt(element.id)+'!!!!!',parseInt(event.target.accessKey));
                return parseInt(element.id) !== parseInt(event.target.accessKey);
             });
         }
    }

    handleSubmit(event) {
       
        var isVal = true;
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            isVal = isVal && element.reportValidity();
        });
        if (isVal) {
            var totalRecords = this.itemList.length;
            let sObjectRecords =[];
            this.template.querySelectorAll('lightning-record-edit-form').forEach(element => {
                //sObjectRecords.push(JSON.st=ringify(element));
                element.submit();
                console.log(totalRecords);
                --totalRecords;
                console.log(totalRecords);
                if(totalRecords===0 && this._areTaskVisible){
                    console.log('process: '+totalRecords)
                    /*let wrapperObject = {
                        resources : this.resources,
                    };*/
                    setTimeout(() => {
                        processResources({resources : this.resources})
                        .then(result => {
                            console.log(result);
                        })
                        .catch(error => {
                            console.log('Error : '+error.body.message);
                        });
                    },1000);    
                    
                }
            });


            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record successfully created',
                    variant: 'success',
                }),
            );
            this.dispatchEvent(new CustomEvent('closemodel'));
            /*this[NavigationMixin.Navigate]({
                //type: 'standard__objectPage',
                type:'standard__namedPage',
                attributes: {
                    //objectApiName: this._getApiName,
                    //recordId : this.recordId,
                    //objectApiName: this._getIdFromParent,
                    //actionName: "home",
                },
            });*/
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: 'Please enter all the required fields',
                    variant: 'error',
                }),
            );
            const childEvent = CustomEvent('buttonclicked');
            this.dispatchEvent(childEvent);
        }
        
    }
    connectedCallback() { 
        window.console.log('!!this.areTaskVisible11!!!',this._areTaskVisible);
        this._areTaskVisible = (this._areTaskVisible==="true" || this._areTaskVisible) ? true : false;
        window.console.log('!!this.areTaskVisible11!!!',this._areTaskVisible);
        //window.console.log('!!this.areTaskVisible11!!!',tskVisible); 
        if(this._areTaskVisible){
            var newItem = [{ id: 0,Module__c :this._getIdFromParent,GUID__c : (this._getIdFromParent+':'+this.createGuid())}];
            this.itemList = this.itemList.concat(newItem);
        }else{
            var newItem = [{ id: 0,Projects__c :this._getIdFromParent}];
            this.itemList = this.itemList.concat(newItem);
        }
      }
    handleAddClick(event) {
        this._currentTaskId = event.target.dataset.guid;
        this.cShowModal = true;
        this.currentTaskMembers = this.resources[this._currentTaskId];
    }
    closeModal(){
        this.cShowModal = false;
    }
    createGuid(){  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
        return v.toString(16);  
    });  
    }  
    handleSelectEvent(event){
        /*if(this.resources){
            this.resources.concat(event.detail);               
        }*/
        //this.resources.set(event.detail.parentGUID,event.detail.resources);
        this.resources[event.detail.parentGUID] =event.detail.resources;
        //this.resources = [...this.resources, event.detail];       
    }
}