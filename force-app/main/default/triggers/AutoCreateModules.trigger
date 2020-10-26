trigger AutoCreateModules on Project__c (After insert) {

    List<Module__c> Modulelist = new List<Module__c>();
    
    
        For(Project__c p : trigger.new){
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
           
        }
    
    
        
        if(Modulelist != Null && Modulelist.size() > 0){
        insert Modulelist;
    }
    
}