import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import addTask from '@salesforce/apex/TaskController.addTask';

export default class TaskManager extends LightningElement {
    @track taskName = '';
    @track description = '';
    @track priority = 'Medium';
    @track tasks = [];
    @track errorMessage = '';
    @track successMessage = '';

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
                this.sendTaskToExternalAPI(); // Send data to the external API
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

    sendTaskToExternalAPI() {
        const taskData = {
            taskName: this.taskName,
            description: this.description,
            priority: this.priority
        };

        fetch('https://api.example.com/tasks', { // Replace with your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY' // Add authorization if required
            },
            body: JSON.stringify(taskData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            this.successMessage = 'Task successfully sent to external API!';
            console.log('External API Response:', result);
        })
        .catch(error => {
            this.errorMessage = 'Error sending task to external API.';
            console.error('API Error:', error);
        });
    }
}
