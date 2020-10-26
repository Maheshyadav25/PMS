public with sharing class CreateTask {

    @AuraEnabled(cacheable=true)
    public static List<Module__c> getAllModules() {
        return [SELECT Name, End_Date__c,Start_Date__c, Projects__r.Name  FROM Module__c];
    
 }
}