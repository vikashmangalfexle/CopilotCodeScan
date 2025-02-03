public with sharing class TaskController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        try {
            return [SELECT Id, Name, Description__c, Priority__c FROM Task__c ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException('Failed to retrieve tasks: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void addTask(String name, String description, String priority) {
        if (String.isBlank(name) || String.isBlank(description)) {
            throw new AuraHandledException('Task Name and Description are required.');
        }

        Task__c newTask = new Task__c(
            Name = name,
            Description__c = description,
            Priority__c = priority
        );

        try {
            insert newTask;
        } catch (Exception e) {
            throw new AuraHandledException('Failed to create task: ' + e.getMessage());
        }
    }
}
