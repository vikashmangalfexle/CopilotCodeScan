import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import addTask from '@salesforce/apex/TaskController.addTask';

export default class TaskManager extends LightningElement {
    @track taskName = '';
    @track description = '';
    @track priority = 'Medium';
    @track tasks = [];
    @track errorMessage = '';

    priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    columns = [
        { label: 'Task Name', fieldName: 'Name' },
        { label: 'Description', fieldName: 'Description' },
        { label: 'Priority', fieldName: 'Priority' }
    ];

    connectedCallback() {
        this.loadTasks();
    }

    loadTasks() {
        getTasks()
            .then(result => {
                this.tasks = result;
            })
            .catch(error => {
                this.errorMessage = 'Error loading tasks.';
                console.error(error);
            });
    }

    handleTaskNameChange(event) {
        this.taskName = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handlePriorityChange(event) {
        this.priority = event.target.value;
    }

    handleAddTask() {
        if (this.taskName.trim() === '' || this.description.trim() === '') {
            this.errorMessage = 'Please fill out all fields.';
            return;
        }

        addTask({ name: this.taskName, description: this.description, priority: this.priority })
            .then(() => {
                this.loadTasks();
                this.taskName = '';
                this.description = '';
                this.priority = 'Medium';
                this.errorMessage = '';
            })
            .catch(error => {
                this.errorMessage = 'Error adding task.';
                console.error(error);
            });
    }
}
