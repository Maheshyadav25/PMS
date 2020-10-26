public with sharing class lwcModuleList {

    @AuraEnabled(cacheable=true)
    public static List<Module__c> getAllModules(string recordId) {
        System.debug('recordId :'+ recordId);
        return [SELECT Name, End_Date__c,Start_Date__c, Projects__r.Name  FROM Module__c where Projects__c =:recordId];
    
 }
}