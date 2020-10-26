public with sharing class ProjectTaskController {
    public ProjectTaskController() {

    }
    @AuraEnabled
    public static List<object> createSubRecords(DataWrapper wrapper){
        System.debug(wrapper);
        /*if(wrapper.records.size()>0){
            Database.SaveResult[] sr= Database.insert(wrapper.records,true);
            if(sr[0].isSuccess() && wrapper.isTask){
                for(String str : wrapper.resources.keySet()){
                    System.debug(wrapper.resources.get(str));
                }
            }
        }*/
        return wrapper.records;
    }
    public class DataWrapper{
        @AuraEnabled
        public List<object> records {get;set;}
        @AuraEnabled 
        public Map<String,Object> resources {get;set;}
        @AuraEnabled
        public Boolean isTask {get;set;}
        public List<String>  recordJson {get;set;}
    }
}