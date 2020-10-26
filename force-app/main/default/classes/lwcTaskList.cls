public with sharing class lwcTaskList {
    @AuraEnabled(cacheable=true)
    public static List<Task_PM__c> getAllTasks(string recordId) {
        System.debug('recordId :'+ recordId);
        return [SELECT Name, End_Date__c,Start_Date__c, Module__r.Name  FROM Task_PM__c where Module__c =:recordId];
    
 }
}