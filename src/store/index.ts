import { createStore } from 'vuex'
import Task from "@/types/Task.interface"


export default createStore({
    state: {
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]') as Task[],
        filter: 'All tasks',
        searchInput: '',
        isSidebarShown: false,
    },
    getters: {
        getTasks(state) {
            return state.tasks
        },
        getTaskById(state) {
            return(id: number) => state.tasks.filter((task: Task) => task.id === id)
        },
        getFilter(state) {
            return state.filter
        },
        getAllTags(state) {
            let tagsArr: string[] = [];
            state.tasks.forEach((task: Task) => {
                if(task.tags) {
                    task.tags.forEach((tag: string) => tagsArr.push(tag))
                }
            })
            let tagsSet = new Set(tagsArr)
            return tagsSet
        },
        isSidebarShown(state) {
            return state.isSidebarShown
        },


        // Filtered tasks
        getTodayTasks(state) {
            return state.tasks.filter(task => {
                let thisDate = new Date(task.date).setHours(0,0,0,0);
                let todayDate = new Date().setHours(0,0,0,0);
                if(thisDate === todayDate) return true
            })    
        },
        getWeekTasks(state) {
            return state.tasks.filter(task => {
                let thisDate = new Date(task.date).setHours(0,0,0,0);
                let todayDate = new Date().setHours(0,0,0,0);
                if(thisDate - todayDate < 86400000 * 7 && thisDate > todayDate) return true
            })    
        },
        getMonthTasks(state) {
            return state.tasks.filter(task => {
                let thisDate = new Date(task.date).setHours(0,0,0,0);
                let todayDate = new Date().setHours(0,0,0,0);
                if(thisDate - todayDate < 86400000 * 30 && thisDate > todayDate) return true
            })    
        },
        getOutdatedTasks(state) {
            return state.tasks.filter(task => {
                if(task.status === 'outdated') return true
            })    
        },
        getWithoutDateTasks(state) {
            return state.tasks.filter(task => {
                if(!task.date) return true
            })    
        },
        getActiveTasks(state) {
            return state.tasks.filter(task => {
                if(task.status === 'active') return true
            })
        },
        getCompletedTasks(state) {
            return state.tasks.filter(task => {
                if(task.status === 'completed') return true
            })
        },
        getSearchedTasks(state) {
            return state.tasks.filter(task => {
                if(task.name.trim() === state.searchInput.trim()) return true
            })
        },
        getTagsTasks(state) {
            return state.tasks.filter(task => {
                let result
                for(let tag of task.tags) {
                    if(tag === state.filter.slice(1)) result = true
                }
                return result
            })
        }

    },
    mutations: {
        // Tasks
        addNewTask(state, newTask: Task) {
            state.tasks.push(newTask)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        deleteTask(state, id: number) {
            let i = state.tasks.findIndex((t: Task) => t.id === id)
            state.tasks.splice(i, 1)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        saveChanges(state, task: Task) {
            let i = state.tasks.findIndex((t: Task) => t.id === task.id)
            state.tasks.splice(i, 1, task)
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        saveStatusToLocalStorage(state, [id, newStatus]) {
            state.tasks.filter((task: Task) => {
                if(task.id === id) task.status = newStatus
            })
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },

        // Filters
        selectFilter(state, filter) {
            state.filter = filter;
        },

        // Search input
        saveSearchInput(state, searchInput) {
            state.searchInput = searchInput;
        },

        // Show/hide sidebar
        toggleSidebar(state) {
            state.isSidebarShown = !state.isSidebarShown
        },
        hideSidebar(state) {
            state.isSidebarShown = false
        }
    },
    actions: {
        // Tasks
        addNewTask(context, newTask) {
            context.commit('addNewTask', newTask)
        },
        deleteTask(context, id) {
            context.commit('deleteTask', id)
        },
        saveChanges(context, id) {
            context.commit('saveChanges', id)
        },
        saveStatusToLocalStorage(context, [id, newStatus]) {
            context.commit('saveStatusToLocalStorage', [id, newStatus])
        },

        // Filters
        selectFilter(context, filter) {
            context.commit('selectFilter', filter)
        },

        // Search input
        saveSearchInput(context, searchInput) {
            context.commit('saveSearchInput', searchInput)
        }
    },
})
