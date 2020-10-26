public with sharing class CreateProject {

    @AuraEnabled(cacheable=true)
    public static List<Project__c> getAllProjects() {
       return [SELECT Id,Name,Category__c,Duration__c,Stage__c,Start_Date__c,Status__c FROM Project__c];
    }
    
    /*@AuraEnabled(Cacheable=true)
    public static List <Project__c> getAllProjects(String strName) {
        String strNameLike = '%'+strName+'%';
        List<Project__c> PList = [SELECT Id,Name,Category__c,Duration__c,Stage__c,Start_Date__c,Status__c FROM Project__c
                                   Where Name like :strNameLike
                                   ];
        return PList;
    }  */
    
}