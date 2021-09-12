<template>
     <section class="sidebar" :class="{'sidebar-shown' : isSidebarShown}">
        <div class="sidebar-container">
            <button class="hide-sidebar" @click="hideSidebar"></button>

            <div class="unit all-tasks">
                <div class="unit-caption" @click="selectFilter('All tasks')">
                    <h2 class="unit-title">All tasks</h2>
                </div>
            </div>

            <div class="unit deadline">
                <div class="unit-caption" @click="toggleDeadlineList">
                    <button class="unit-more" :class="{'show-unit-list' : isDeadlineListShown}"></button>
                    <h2 class="unit-title">Deadline</h2>
                </div>
                <ul class="unit-list" :class="{'show-unit-list' : isDeadlineListShown}">
                    <li class="unit-item deadline-today" @click="selectFilter('Today')">
                        <span class="unit-item-name">Today</span>
                        <span class="unit-item-number">{{todayTasks.length}}</span>
                    </li>
                    <li class="unit-item deadline-week" @click="selectFilter('Week')">
                        <span class="unit-item-name">Next week</span>
                        <span class="unit-item-number">{{weekTasks.length}}</span>
                    </li>
                    <li class="unit-item deadline-month" @click="selectFilter('Month')">
                        <span class="unit-item-name">Next month</span>
                        <span class="unit-item-number">{{monthTasks.length}}</span>
                    </li>
                    <li class="unit-item deadline-outdated" @click="selectFilter('Outdated')">
                        <span class="unit-item-name">Outdated</span>
                        <span class="unit-item-number">{{outdatedTasks.length}}</span>
                    </li>
                    <li class="unit-item deadline-without" @click="selectFilter('Without date')">
                        <span class="unit-item-name">Without date</span>
                        <span class="unit-item-number">{{withoutDateTasks.length}}</span>
                    </li>
                </ul>
            </div>

            <div class="unit tags">
                <div class="unit-caption" @click="toggleTagsList">
                    <button class="unit-more" :class="{'show-unit-list' : isTagsListShown}"></button>
                    <h2 class="unit-title">Tags</h2>
                </div>
                <ul 
                    class="unit-list" 
                    :class="{'show-unit-list' : isTagsListShown}" 
                >
                    <li 
                        class="unit-item tags-item"
                        v-if="allTags.size > 0"
                        v-for="(tag, index) in allTags" :key="index"
                        @click="selectFilter('#' + tag)"
                    >
                        <span class="unit-item-name">{{tag}}</span>
                        <span class="unit-item-number"></span>
                    </li>
                    <li class="unit-item" v-else>No tags yet</li>
                </ul>
                
            </div>

            <div class="unit status">
                <div class="unit-caption" @click="toggleStatusList">
                    <button class="unit-more" :class="{'show-unit-list' : isStatusListShown}"></button>
                    <h2 class="unit-title">Status</h2>
                </div>
                <ul class="unit-list" :class="{'show-unit-list' : isStatusListShown}">
                    <li class="unit-item status-active" @click="selectFilter('Active')">
                        <span class="unit-item-name">Active</span>
                        <span class="unit-item-number">{{activeTasks.length}}</span>
                    </li>
                    <li class="unit-item status-completed" @click="selectFilter('Completed')">
                        <span class="unit-item-name">Completed</span>
                        <span class="unit-item-number">{{completedTasks.length}}</span>
                    </li>
                    <li class="unit-item status-outdated" @click="selectFilter('Outdated')">
                        <span class="unit-item-name">Outdated</span>
                        <span class="unit-item-number">{{outdatedTasks.length}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Task from '@/types/Task.interface'

export default defineComponent({
    data() {
        return {
            // Data for adding css classes
            isDeadlineListShown: false,
            isTagsListShown: false,
            isStatusListShown: false,
        }
    },
    computed: {
        tasks(): Task[] {
            return this.$store.getters.getTasks
        },
        allTags(): string[] {
            return this.$store.getters.getAllTags
        },
        isSidebarShown(): boolean {
            return this.$store.getters.isSidebarShown
        },

        // Filtered tasks
        todayTasks(): Task[] {
            return this.$store.getters.getTodayTasks
        },
        weekTasks(): Task[] {
            return this.$store.getters.getWeekTasks
        },
        monthTasks(): Task[] {
            return this.$store.getters.getMonthTasks
        },
        outdatedTasks(): Task[] {
            return this.$store.getters.getOutdatedTasks
        },
        withoutDateTasks(): Task[] {
            return this.$store.getters.getWithoutDateTasks
        },
        activeTasks(): Task[] {
            return this.$store.getters.getActiveTasks
        },
        completedTasks(): Task[] {
            return this.$store.getters.getCompletedTasks
        },
        searchedTasks(): Task[] {
            return this.$store.getters.getSearchedTasks
        },
    },
    methods: {
        // Methods for adding css classes
        toggleDeadlineList() {
            !this.isDeadlineListShown ? this.isDeadlineListShown = true : this.isDeadlineListShown = false
        },
        toggleTagsList() {
            !this.isTagsListShown ? this.isTagsListShown = true : this.isTagsListShown = false
        },
        toggleStatusList() {
            !this.isStatusListShown ? this.isStatusListShown = true : this.isStatusListShown = false
        },

        // Filter by sidebar units
        selectFilter(filter: string) {
            this.$store.dispatch('selectFilter', filter)
        },

        // Hide sidebar
        hideSidebar() {
            this.$store.commit('hideSidebar')
        },
    },
    mounted() {
        // Add css class to selected item
        let items = document.querySelectorAll('.unit-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('selected'));
                allTasks.classList.remove('selected');
                item.classList.add('selected');
            })
        })
        let allTasks = document.querySelector('.all-tasks');
        allTasks.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('selected'));
            allTasks.classList.add('selected');
        })
    }
});
</script>

<style lang="scss" scoped>

.sidebar {
    position: fixed;
    top: 44px;
    bottom: 0;
    width: 280px;
    min-height: 100vh;
    padding: 40px 8px 30px 40px;
    background-color: var(--grey-light);
    border-right: 1px solid var(--grey);
    overflow-y: auto;
    z-index: 99;
}
.sidebar-container {
    display: flex;
    flex-direction: column;
    row-gap: 24px;
}
.hide-sidebar {
    display: none;
}

.unit {
    cursor: pointer;
}
.unit-caption {
    display: flex;
    align-items: center;
    column-gap: 8px;
}


.unit-more {
    width: 16px;
    height: 16px;
    border: none;
    background: url('../assets/icons/arrow-down.svg') no-repeat center center / 12px;
    cursor: pointer;
    transition: transform 0.05s ease-in;

    &.show-unit-list {
        transform: rotate(-90deg);
        transition-duration: 0.2s;
    }
}
.unit-title {
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
}


.unit-list {
    margin-top: 8px;
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0s ease-in;

    &.show-unit-list{
        max-height: 1000px;
        transition-duration: 1s;
    }
}
.unit-item {
    padding: 6px;
    margin-bottom: 2px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 6px;
    padding-left: 36px;
    background: no-repeat left 10px center / 16px;
    cursor: pointer;

    &:hover {
        background-color: var(--grey);
    }
    &.selected {
        background-color: var(--grey);
    }
}
.unit-item-name {
    font-size: 14px;
}
.unit-item-number {
    margin-right: 4px;
    font-size: 12px;
    color: #777;
}


.all-tasks {
    padding: 3px;
    padding-left: 26px;
    background: url('../assets/icons/all-tasks.svg') no-repeat left 3px center / 16px;
        border-radius: 6px;
    &.selected {
        background-color: var(--grey);
    }
}
.deadline-today {
    background-image: url('../assets/icons/today.svg');
}
.deadline-week {
    background-image: url('../assets/icons/week.svg');
}
.deadline-month {
    background-image: url('../assets/icons/month.svg');
}
.deadline-outdated {
    background-image: url('../assets/icons/outdated-deadline.svg');
}
.deadline-without {
    background-image: url('../assets/icons/without-date.svg');
}

.tags-item {
    background-image: url('../assets/icons/tag.svg');
    background-size: 14px;
}

.status-active {
    background-image: url('../assets/icons/active.svg');
    // background-size: 14px;
}
.status-completed {
    background-image: url('../assets/icons/completed.svg');
    // background-size: 14px;
}
.status-outdated {
    background-image: url('../assets/icons/outdated-status.svg');
    // background-size: 14px;
}



@media screen and (max-width: 1024px) {
    .sidebar {
        padding: 30px 8px 20px 30px;
        width: 240px;
    }     
    .unit-title {
        font-size: 16px;
    }  
    .unit-item-name {
        font-size: 12px;
    }
    .unit-item {
        background-size: 14px;
    }
}

@media screen and (max-width: 768px) {
    .hide-sidebar {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 15px;
        top: 10px;
        border: 0;
        background: url('../assets/icons/close.svg') no-repeat center / 16px;
        cursor: pointer;
        display: block;
    }
    .sidebar {
        padding-top: 40px;
        position: fixed;
        transform: translateX(-100%);
        transition: transform .2s ease-out;

        &.sidebar-shown {
            transform: translateX(0);
        }
    }       
}

</style>