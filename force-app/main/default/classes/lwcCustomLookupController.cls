public with sharing  class lwcCustomLookupController {
    /*@auraEnabled
    public static list<Account> getResults(string objectName, string fieldName, string value){
        string query = 'select name from '+objectName+ ' where Name =\'%'+fieldName+'%\'';
        List<account> acclist = database.query(query);
        return accList;
    }*/
    final public static String COMPANY_FIELD = 'Company__c';
    final public static String COMPETENCY_FIELD = 'Competency__c';
    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value, List<String> selectedRecId, String parentId) {
        Set<String> competencies = new Set<String>();
        Set<String> companies = new Set<String>();
        parentid = parentId.substringBefore(':');
        for(Project__c pr :[Select id, 
                        (select Name from Project_Competency__r), 
                        Company__r.Name  
                    From Project__c where id in (select Projects__c from Module__c where id =:parentId)]){
            companies.add(pr.Company__r.Name);
            for(Project_Competency__c pc: pr.Project_Competency__r){
                competencies.add(pc.name);
            }
        }   
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        if(selectedRecId == null)
            selectedRecId = new List<String>();

        if(String.isNotEmpty(value)) {
            System.debug(companies);
            System.debug(competencies);
            System.debug(selectedRecId);
            String query = 'Select Id, FirstName, LastName, '+fieldName+' , '+ COMPETENCY_FIELD+' FROM '+ ObjectName+' WHERE '+ fieldName+' LIKE \'%' + value.trim() + '%\' and ID NOT IN: selectedRecId and '+COMPANY_FIELD +' IN: companies and isActive=true';
            System.debug(query);
            sObjectResultList.addAll(PMPublicDataAccess.getUsers(query,selectedRecId, companies, competencies));
        }
        return sObjectResultList;
    }
    
    public class SObjectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
        public SObJectResult() {
          
        }
    }

    @AuraEnabled(cacheable=true)
    public static void createTaskResources(List<object> resources, Id taskId) {
        for(Object obj: resources){
            System.debug(obj);
            //new Team_Member__c (User__c = obj.recId, Task__c = taskId);
        }
        System.debug('TaskId :'+taskId);

    }
    
    @AuraEnabled
    public static void processResources(Map<String,List<DataWrapper>> resources) {
        Map<String,String> taskGUIDs= new Map<String,String>();
        Set<Team_Member__c> members  = new Set<Team_Member__c>();
        for(Task_PM__c taskPM : [Select id, GUID__c
                                    From Task_PM__c 
                                    Where GUID__c in : resources.keyset()]){
            taskGUIDs.put(taskPM.GUID__c, taskPM.Id);
        }
        
        for(String resourceList:  resources.keyset() ){
            for(DataWrapper res : resources.get(resourceList)){
                members.add(new Team_Member__c(User__c = res.recId,
                                               Task__c = taskGUIDs.get(res.taskGUID)
                                               ));
                System.debug(res);
                system.debug(res.recId);
                system.debug(res.recName);
                system.debug(res.taskGUID);
            }
        }
        System.debug(members.size());
        insert new List<Team_Member__c>(members);
    }
    public class DataWrapper{
        @AuraEnabled
        public String recId {get;set;}
        @AuraEnabled
        public String recName {get;set;}
        @AuraEnabled
        public String taskGUID {get;set;}
    }
}