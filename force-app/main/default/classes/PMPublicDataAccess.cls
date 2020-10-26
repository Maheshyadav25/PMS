public with sharing class PMPublicDataAccess {
    public PMPublicDataAccess() {

    }
    public static List<sObject> getRecords(String query, List<String> selectedRecId, Set<String> companies ){
        return Database.query(query);
    }
    public static List<lwcCustomLookupController.SObjectResult> getUsers(String query, List<String> selectedRecId, Set<String> companies, Set<String> competencies){
        Map<Id,lwcCustomLookupController.SObjectResult> sObjectResultData = new Map<Id,lwcCustomLookupController.SObjectResult>();
        for(sObject so : PMPublicDataAccess.getRecords(query, selectedRecId, companies)) {
            System.debug(so);
            if(so.get('Competency__c')!=NULL){
                for(String competency : String.valueOf(so.get('Competency__c')).split(';')){
                    if(competencies.contains(competency)){
                        String fieldvalue='';
                        if(so.get('FirstName')!=null){
                            fieldValue+= (String)so.get('FirstName');
                        }
                        if(so.get('LastName')!=null){
                            fieldValue+= ' '+(String)so.get('LastName');
                        }
                        if(String.isBlank(fieldvalue)){
                            fieldValue+=so.get('Name');
                        }
                        sObjectResultData.put(so.Id, new lwcCustomLookupController.SObjectResult(fieldvalue, so.Id));
                    }
                }
            }
            
        }
        return sObjectResultData.values();
    }
}