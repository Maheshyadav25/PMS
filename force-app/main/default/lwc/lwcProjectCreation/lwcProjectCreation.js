import { LightningElement, api, track, wire } from 'lwc';
import getCompanies from '@salesforce/apex/ProjectController.getCompanies'
import getCompanyCompetencies from '@salesforce/apex/ProjectController.getCompanyCompetencies'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import createRelatedCompetencies from '@salesforce/apex/ProjectController.createRelatedCompetencies'
export default class LwcProjectCreation extends NavigationMixin(LightningElement) {
    @track selectCompetencies=[];
    //@track selectedCompetencies=[];
    @track competency;
    @track showCompetency =false;
    @track showForm= false;
    @track showProject= true;
    @track company;
    @track options=[];
    @wire
    (getCompanies)
    companies({ error, data }) {
        if (data) {
            for(const list of data){
                console.log(list);
                const option = {
                    label: list.Name,
                    value: list.Id
                };
                // this.selectOptions.push(option);
                this.options = [ ...this.options, option ];
            }
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.options = undefined;
        }
    }
    connectedCallback(){
        console.log(this.competencies);
       
    }
    @track openmodel = false;
    openmodal() {
        this.openmodel = true
        
    }
    closeModal() {
        this.openmodel = false;
        this.showCompetency=false;
        this.company=null;
        this.showForm = false;
        this.competency=[];
        this.showProject=true;
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
        //const closeLWC = new CustomEvent('close');
        // Dispatches the event.
        //this.dispatchEvent(closeLWC);
        /*this[NavigationMixin.Navigate]({
            "type": "standard__objectPage",
            "attributes": {
                "objectApiName": "Project__c",
                "actionName": "home"
            },
            state: {
                filterName: 'All'
            },
        });*/
    } 
    saveMethod() {
        alert('save method invoked');
        this.closeModal();
    }
    handleChange(event){
        console.log(event.detail.value);
        
        if(event.detail.value && event.detail.value!='None'){
            this.company= event.detail.value;
            console.log(event.detail.value);
        }
    }
    nextView(){
        console.log(this.showCompetency);
        console.log(this.company);
        console.log(this.competency);
        if(!this.showCompetency && this.company && !this.competency){
            this.showCompetency = true;
            this.showForm=false;
            this.showProject=false;
            this.getCompetencies();
        }
        if(this.competency && this.showCompetency){
            this.showCompetency = false;
            this.showForm=true;
            this.showProject=false;
        }

    }
    getCompetencies(){
        getCompanyCompetencies({companyId : this.company})
        .then(result => {
            let values= [];
            result.forEach(compet => {
                values.push({label: compet.Name, value: compet.Id });
            });
            this.selectCompetencies = [...values];
            this.competency=[];
        })
        .catch(error => {
            this.error = error;
        });
    }
    handleCompetencyChange(e) {
        this.competency = e.detail.value;
    }
    get selectedCompetencies() {
        return this.competency.join(',');
    }
    handleProjectCreated(event){
        if(ShowToastEvent){
            const event1 = new ShowToastEvent({
                title: 'Project create',
                message: 'Success: Record {0} created!',
                variant: "success",
            });
            this.dispatchEvent(event1);
        }
        this.createRelatedCompetencies(event.detail.id);
        this[NavigationMixin.Navigate]({
           /* "type": "standard__objectPage",
            "attributes": {
                "objectApiName": "Project__c",
                "actionName": "home"
            }
        });*/
        type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: 'Project__c',
                actionName: 'view'
            },
        });    
    }
    handleSubmit(event){
        event.preventDefault();
        /*this.template.querySelectorAll('lightning-input-field').forEach(element => {
            if(element.fieldName==='Start_Date__c'){
                tempStartDate = element.value;
            }
            if(tempStartDate && element.fieldName==='End_Date__c' && tempStartDate>element.value) {
                //element.setCustomValidity("Incorrect End Date has selected");
                isVal=false;
                errorFlag = 'Incorrect Date! Start Date can not be greater then End Date.'
                tempStartDate=null;
            }
            
            isVal = isVal && element.reportValidity();
        });
        this.template.querySelectorAll('lightning-input-field').forEach(element => {
            
            /*if(element.fieldName==='Start_Date__c'){
                  var currentDate = new Date();
                  currentDate.setHours(0,0);  
                  if(new Date(element.value)<currentDate){  
                    isVal=false;
                    this.errorFlag = 'Incorrect Date! Past Dates are not allowed.'
                  }
            }*/
            /*if(element.fieldName==="Duration__c" && Number(element.value)<=0){
                isVal=false;
                this.errorFlag = 'Incorrect Duration ! Duration can not be negative.'
            }
            isVal = isVal && element.reportValidity();
        });*/
        var isVal=true;
        if(isVal){
            const fields = event.detail.fields;
            console.log(fields);
            debugger;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
        } else {
            this.handleError(event);
        }
    }
    handleError(event){
        if(ShowToastEvent){
            const event1 = new ShowToastEvent({
                title: 'Project create',
                message: 'Error: '+ error.detail,
                variant: "error",
            });
            this.dispatchEvent(event1);
        }
        console.log(event.detail);
    }
    createRelatedCompetencies(projectId){
        createRelatedCompetencies({competencies :this.competency, projectId : projectId})
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log('Error : '+error.body.message);
        });
    }    
}