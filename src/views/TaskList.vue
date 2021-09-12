<template>
    <section class="tasks">
        <h2 class="tasks-title">{{filter}}</h2>
        <ul class="tasks-list">

            <li 
                class="tasks-item task"
                v-for="(task, index) in filteredTasks"
                :key="index"
                v-if="filteredTasks.length > 0"
            >
                <!-- TASK STATUS -->
                <div class="task-status">
                    <label 
                        title="Complete task" for="checkbox" 
                        class="task-status-label"
                        @click="toggleTaskStatus(task.id)"
                        :class="{
                            'status-active' : task.status === 'active',
                            'status-completed' : task.status === 'completed',
                            'status-outdated' : task.status === 'outdated'
                        }"
                    ></label>
                    <input type="checkbox" name="status" id="checkbox" class="task-status-checkbox">
                </div>

                <!-- TASK DATE & TIME -->
                <div class="task-date-wrapper">
                    <div class="task-date" v-if="task.date">{{task.date}}</div>
                    <div class="task-date" v-if="task.time">{{task.time}}</div>
                </div>

                <!-- TASK NAME -->
                <div class="task-name" :title="task.name">{{task.name}}</div>

                <!-- TASK DESCRIPTION -->
                <div class="task-description" :title="task.description">{{task.description}}</div>

                <!-- TASK TAGS -->
                <ul class="task-tags">
                    <li 
                        class="task-tag"
                        v-for="(tag, i) in task.tags" :key="i"
                        :title="tag"
                    >
                        #{{tag}}
                    </li>
                </ul>

                <!-- TASK BUTTONS -->
                <button 
                    title="Edit task" 
                    class="task-button task-edit"
                    @click="editTask(task.id)"
                ></button>
                <button 
                    title="Delete task" 
                    class="task-button task-delete"
                    @click="deleteTask(task.id)"
                ></button>
            </li>

            <li v-else>
                <p class="no-results">No tasks</p>
            </li>
                    
            <li class="tasks-item task-add">
                <button 
                    title="Add task" 
                    class="task-button task-add-button"
                    @click="quickAddTask"
                ></button>
                <input 
                    type="text" placeholder="Quick add task" 
                    class="task-add-input"
                    v-model="quickName" 
                    @keyup.enter="quickAddTask"                   
                >
            </li>

        </ul>
        <button class="new-task-button" @click="toCreatePage">Add a new task</button>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Task from "@/types/Task.interface"

export default defineComponent({
    data() {
        return {
            quickName: '',
        }
    },
    computed: {
        tasks(): Task[] {
            return this.$store.getters.getTasks
        },
        filter(): string {
            return this.$store.getters.getFilter
        },
        filteredTasks(): Task[] {
            // All tasks filter
            if(this.filter === 'All tasks') {
                return this.tasks
            } 
            // Deadline filters
            if(this.filter === 'Today') {
                return this.$store.getters.getTodayTasks
            } 
            else if(this.filter === 'Week') {
                return this.$store.getters.getWeekTasks
            } 
            else if(this.filter === 'Month') {
                return this.$store.getters.getMonthTasks
            } 
            else if(this.filter === 'Outdated') {
                return this.$store.getters.getOutdatedTasks
            }
            else if(this.filter === 'Without date') {
                return this.$store.getters.getWithoutDateTasks
            }
            else if(this.filter === 'Active') {
                return this.$store.getters.getActiveTasks
            }
            else if(this.filter === 'Completed') {
                return this.$store.getters.getCompletedTasks
            }
            else if(this.filter === 'Outdated') {
                return this.$store.getters.getOutdatedTasks
            }
            else if(this.filter === 'Search') {
                return this.$store.getters.getSearchedTasks
            }
            else {
                return this.$store.getters.getTagsTasks
            }
        },
    },
    methods: {
        // Change status of a task when clicked
        toggleTaskStatus(id: number) {
            this.tasks.filter((task) => {
                if(task.id === id) {
                    let oldStatus = task.status

                    // Toggle status by clicking
                    if(task.status === 'active') {
                        task.status = 'completed'
                    } else if (task.status === 'completed') {
                        task.status = 'active'
                    }

                    // Сheck if the status has changed and save it's change
                    let newStatus = task.status
                    if(oldStatus !== newStatus) this.saveStatusToLocalStorage(id, newStatus)
                }
            })
        },

        // Check date and change status of tasks
        checkStatus() {
            this.tasks.forEach((task) => {
                let oldStatus = task.status

                // Date must be greater than today
                let thisDate = new Date(task.date).setHours(0,0,0,0)
                let todayDate = new Date().setHours(0,0,0,0)
                if(thisDate < todayDate) {
                    task.status = 'outdated'
                } 
                // Or if the date is today then check the time
                // Time must be greater than now
                else if(thisDate === todayDate) {
                    let thisTime = new Date()
                    let timeArr = task.time.split(':')
                    thisTime.setHours(+timeArr[0])
                    thisTime.setMinutes(+timeArr[1])
                    if(+thisTime <= Date.now()) task.status = 'outdated'
                }
                
                // Сheck if the status has changed and save it's change
                let newStatus = task.status
                if(oldStatus !== newStatus) this.saveStatusToLocalStorage(task.id, newStatus)
            })
        },
        // Save changed status to local storage
        saveStatusToLocalStorage(id: number, newStatus: string) {
            this.$store.dispatch('saveStatusToLocalStorage', [id, newStatus])
        },

        // Go to the edit task page
        editTask(id: number) {
            this.$router.push('/edit/' + id)
        },

        // Delete task method
        deleteTask(id: number) {
            this.$store.dispatch('deleteTask', id)
        },

        // Quick add task method
        quickAddTask() {
            if(this.quickName.trim()) {
                const newTask: Task = {
                    name: this.quickName,
                    description: '',
                    tags: [],
                    date: '',
                    time: '',
                    status: 'active',
                    id: Date.now(),
                }
                this.quickName = ''
                this.$store.dispatch('addNewTask', newTask)
            }
        },

        // Go to the task creation page
        toCreatePage() {
            this.$router.push('/create')
        },
    },
    created() {
        // Check the status of all tasks every second
        setInterval(() => {
            this.checkStatus()
        }, 1000)
    }
})
</script>

<style lang="scss" scoped>

.tasks {
    padding: 60px 50px;
}
.tasks-title {
    font-size: 32px;
}

.tasks-item {
    padding: 12px 4px;
    display: flex;
    align-items: center;
}
.task {
    border-bottom: 1px solid var(--grey);
}


.task-status {
    margin-right: 12px;
}
.task-status-checkbox {
    width: 0;
    height: 0;
    opacity: 0;
    position: absolute;
    left: -1000px;
}
.task-status-label {
    padding-left: 22px;
    position: relative;
    border: 0;

    &:hover::after {
        border-color: var(--green);
    }
}
.task-status-label::after {
    content: '';
    width: 22px;
    height: 22px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border: 2px solid var(--grey-dark);
    border-radius: 11px;
    cursor: pointer;
}


.status-active::after {
    border-color: var(--yellow);
}
.status-completed::after {
    border-color: var(--green);
    background-color: var(--green-light);
}
.status-outdated::after {
    border-color: var(--red);
    background-color: var(--red-light);
}
.status-outdated.task-status-label:hover::after {
    border-color: var(--red);
}


.task-date-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    flex-grow: 0;
}
.task-date {
    margin-right: 12px;
    font-weight: 700;
    font-size: 16px;
}

.task-name {
    margin-right: 12px;
    font-size: 18px;
    flex-shrink: 0;
    flex-grow: 0;
}

.task-description {
    margin-right: 12px;
    font-size: 18px;
    color: var(--grey-dark);

    flex-shrink: 1;
    flex-grow: 0;
    max-width: 300px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.task-tags {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    margin-right: 12px;
}
.task-tag {
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 16px;
    background-color: var(--grey);
}


.task-button {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 0;
    background:  no-repeat center center / 22px;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
    }
    &:active {
        transform: scale(1);
    }
}
.task-edit {
    margin-left: auto;
    margin-right: 20px;
    background-image: url('../assets/icons/edit.svg');
}
.task-delete {
    background-image: url('../assets/icons/delete.svg');
}


.task-add-button {
    background-image: url('../assets/icons/add.svg');
    background-position: left center;
}
.task-add-input {
    height: 100%;
    width: 100%;
    border: 0;
    font-size: 18px;

    &::placeholder {
        font-size: 18px;
    }
    &:focus {
        outline: 0;
    }
}


.new-task-button {
    display: block;
    margin: 0 auto;
    margin-top: 36px;
    padding: 20px 40px;
    border: 0;
    border-radius: 40px;
    font-weight: 700;
    font-size: 20px;
    color: #fff;
    background-color: var(--main-color);
    cursor: pointer;

    &:hover {
        background-color: var(--main-color-dark);
    }
    &:active {
        transform: scale(0.98);
    }
}

.no-results {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
}



@media screen and (max-width: 1024px) {
    .tasks {
        padding: 40px 30px;
    }    
    .tasks-title {
        font-size: 26px;
    }  
    .task-status {
        margin-right: 10px;
    } 
    .task-status-label::after {
        width: 18px;
        height: 18px;
        border-radius: 9px;
    }
    .task-date-wrapper {
        flex-direction: column;
    }
    .task-date {
        font-size: 14px;
        margin-right: 10px;
    }
    .task-name {
        font-size: 16px;
        margin-right: 10px;
    }
    .task-description {
        font-size: 16px;
        margin-right: 10px;
    }
    .task-tag {
        padding: 3px 8px;
        border-radius: 14px;
        font-size: 12px;
    }
    .task-button {
        width: 20px;
        height: 20px;
        background-size: 16px;
    }
    .task-edit {
        margin-right: 10px;
    }
    .task-add-input {
        font-size: 14px;
        &::placeholder {
            font-size: 14px;
        }
    }
    .new-task-button {
        padding: 16px 32px;
        font-size: 18px;
    }
}

@media screen and (max-width: 576px) {
    .tasks {
        padding: 20px 10px;
    } 
    .tasks-item[data-v-24c1087d] {
        padding: 12px 2px;
    }   
    .tasks-title {
        font-size: 22px;
    }   
    .task-status {
        margin-right: 6px;
    } 
    .task-status-label::after {
        width: 16px;
        height: 16px;
        border-radius: 8px;
    }
    .task-date-wrapper {
        flex-direction: column;
    }
    .task-date {
        font-size: 12px;
        margin-right: 6px;
    }
    .task-name {
        font-size: 14px;
        margin-right: 8px;

        flex-shrink: 1;
        min-width: 50px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .task-description {
        flex-shrink: 10;
        font-size: 14px;
        margin-right: 8px;
    }
    .task-tag {
        padding: 2px 6px;
        border-radius: 12px;
        font-size: 11px;
    }
    .task-edit {
        margin-right: 8px;
    }
    .new-task-button {
        padding: 12px 26px;
        font-size: 16px;
    }
}

</style>