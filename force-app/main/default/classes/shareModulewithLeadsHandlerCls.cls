public without sharing class shareModulewithLeadsHandlerCls {

    public static void moduleShare(set<string> moduleId){
        set<string> pSet = new set<string>();
        set<string> pCompanySet = new set<string>();
        
        map<string,string> pCompanyMap = new map<string,string>();
       
        for(Module__c  m : [select projects__c,projects__r.company__r.Name from module__c where id in:moduleId]){
            pSet.add(m.Projects__c);
            pCompanyMap.put(m.Projects__c,m.projects__r.company__r.Name);
            moduleId.add(m.id);
            
        }
        system.debug('pSet::::'+pSet);
        system.debug('pCompanyMap::::'+pCompanyMap);
        List<Module__Share> moduleRecordShares = new List<Module__Share>();
        map<string,set<string>> pCompetancyMap = new map<string,set<string>>();
        set<string> pCompetancySet = new set<string>();
        for(Project_Competency__c pCompetancy : [select Name,project__c from Project_Competency__c where project__c in: pSet])
        {
            if(!pCompetancyMap.containsKey(pCompetancy.project__c)){
                pCompetancyMap.put(pCompetancy.project__c, new Set<String>{pCompetancy.Name});
                
            }else{
                pCompetancyMap.get(pCompetancy.project__c).add(pCompetancy.Name);
            }
            pCompetancySet.add(pCompetancy.Name);
        }
        system.debug('pCompetancyMap::::'+pCompetancyMap);
        system.debug('pCompanyMap.values()::::'+pCompanyMap.values());
        system.debug('pCompetancySet::::'+pCompetancySet);
        map<string,set<string>> uCompetancyMap = new map<string,set<string>>();
        map<string,string> uCompanyMap = new map<string,string>();
        
        for(User u: [select id,Competency__c,Company__c,profile.Name from user where Company__c in: pCompanyMap.values() and isActive = true])
        {
            if(u.profile.Name.contains('Lead')){
            list<string> competancyList = new list<string>();
            if(u.Competency__c.contains(';')){
                competancyList = u.Competency__c.split(';');
            }else if(!string.isBlank(u.Competency__c)){
                competancyList.add(u.Competency__c);
            }
            set<string> competancySet = new set<string>();
            for(string s: competancyList){
                if(pCompetancySet.contains(s)){
                    competancySet.add(s);
                }
            }
            uCompanyMap.put(u.id,u.Company__c);
            uCompetancyMap.put(u.id,competancySet);
        }
        }
        system.debug('uCompanyMap::::'+uCompanyMap);
        system.debug('uCompetancyMap::::'+uCompetancyMap);
       
        for(Module__c  m : [select projects__c from module__c where id in:moduleId]){
            
            set<string> pCompSet = new set<string>();
            pCompSet = pCompetancyMap.get(m.Projects__c);
            for(string uKey: uCompanyMap.keySet()){
                system.debug('uKey::::'+uKey);
                system.debug(pCompanyMap.get(m.Projects__c)+':::uKey111::::'+uCompanyMap.get(uKey));
                if(pCompanyMap.get(m.Projects__c) == uCompanyMap.get(uKey)){
                    if(pCompSet!=null){
                    for(string str: pCompSet){
                        system.debug(uCompetancyMap.get(uKey)+':::uKey222::::'+str);
                        if(uCompetancyMap.get(uKey) != null && uCompetancyMap.get(uKey).contains(str)){
                            Module__Share moduleRecord = new Module__Share();
                            
                            moduleRecord.ParentId = m.Id;
                            
                            moduleRecord.UserOrGroupId = uKey;
                            
                            moduleRecord.AccessLevel = 'Read';
                            moduleRecord.RowCause = Schema.Module__Share.RowCause.Manual;
                            
                            moduleRecordShares.add(moduleRecord);
                        }
                    }
                    }
                }
            }
            
            
        }
        system.debug('moduleRecordShares::::'+moduleRecordShares);
        insert moduleRecordShares;
        
    }
}