trigger shareModuleWithLeadsTrigger on Module__c (after insert) {

    if(trigger.isInsert ){
        set<string> moduleId =new set<string>();
        for(Module__c m :trigger.new){
            moduleId.add(m.id);
        }
        /*String hour = String.valueOf(Datetime.now().hour());
        String min = String.valueOf(Datetime.now().minute() + 5); 
        String ss = String.valueOf(Datetime.now().second());
        
        //parse to cron expression
        String nextFireTime = ss + ' ' + min + ' ' + hour + ' * * ?';*/
        
       // shareModulewithLeadsHandler s = new shareModulewithLeadsHandler(moduleId); 
		//System.schedule('Job Started At ' + String.valueOf(Datetime.now()), nextFireTime, s);
		
        shareModulewithLeadsHandlerCls.moduleShare(moduleId);
    /** Insert all of the newly created Share records and capture save result **/
    //Database.SaveResult[] moduleSharesInsertResult = Database.insert(moduleRecordShares,false);
    }

}