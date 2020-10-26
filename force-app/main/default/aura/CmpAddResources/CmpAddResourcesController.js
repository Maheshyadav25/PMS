({
    handleClick : function(component, event, helper) {
        var action = component.get("c.createTaskResources");
        action.setParams({ resources : component.get('v.resources'), taskId: component.get('v.recordId')});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Success');
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    handleSelection: function(component, event, helper) {
        var filters = event.getParam('selRecords');
        if(filters){
            component.set("v.resources", filters);
        }
    }
})