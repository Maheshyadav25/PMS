public with sharing class ProjectController {
    public ProjectController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Company__c> getCompanies(){
        return [select id, Name from Company__c];
    }
    @AuraEnabled(cacheable=true)
    public static List<Competency__c> getCompanyCompetencies(Id companyId){
        return [select id, Name from Competency__c where Company__c =:companyId];
    }
    @AuraEnabled
    public static void createRelatedCompetencies(List<Id> competencies, Id projectId){
        System.debug(competencies);
        System.debug(projectId);
        List<Module__c> Modulelist = new List<Module__c>();
        List<Project_Competency__c> projectCompetencies  = new List<Project_Competency__c>();
        List<Competency__c> companyCompetency = [select id, name from Competency__c where Id in : competencies];
        for(Competency__c compet: companyCompetency){
            projectCompetencies.add(new Project_Competency__c(Project__c = projectId, Name = compet.Name));    
        }
        insert projectCompetencies;
        project__c p = [select id,Start_Date__c,Duration__c from project__c where id =: projectId];
        	Module__c mod = new Module__c();
           	mod.Name = 'Plan & Analysis';
            mod.Start_Date__c = p.Start_Date__c;
           	mod.End_Date__c = p.Start_Date__c.addDays(integer.valueOf(p.Duration__c));
            mod.Projects__c = p.id;    
            Modulelist.add(mod);
            mod = new Module__c();
           	mod.Name = 'Design';
            mod.Start_Date__c = p.Start_Date__c;
            mod.End_Date__c = p.Start_Date__c.addDays(integer.valueOf(p.Duration__c));
            mod.Projects__c = p.id;    
            Modulelist.add(mod);
            mod = new Module__c();
           	mod.Name = 'Iterative Dev';
            mod.Start_Date__c = p.Start_Date__c;
            mod.End_Date__c = p.Start_Date__c.addDays(integer.valueOf(p.Duration__c));
            mod.Projects__c = p.id;    
            Modulelist.add(mod);
            mod = new Module__c();
           	mod.Name = 'Deploy';
            mod.Start_Date__c = p.Start_Date__c;
            mod.End_Date__c = p.Start_Date__c.addDays(integer.valueOf(p.Duration__c));
            mod.Projects__c = p.id;    
            Modulelist.add(mod);
            mod = new Module__c();
           	mod.Name = 'Support';
            mod.Start_Date__c = p.Start_Date__c;
            mod.End_Date__c = p.Start_Date__c.addDays(integer.valueOf(p.Duration__c));
            mod.Projects__c = p.id;    
            Modulelist.add(mod);
        
        if(Modulelist != Null && Modulelist.size() > 0){
        insert Modulelist;
        }
    }
}