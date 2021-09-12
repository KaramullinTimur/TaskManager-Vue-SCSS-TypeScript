<template>
    <section class="create">
        <div class="dark-bg"></div>
        <form class="form" @submit.prevent="checkFormValidity">

            <h2 class="title">Create a new task</h2>

            <!-- Task name input -->
            <div class="name">
                <input type="text" placeholder="Task title"
                    class="name-input" :class="{'vue-wrong-input' : isNameInvalid}"
                    v-model="name" @blur="checkNameValidity"
                >
                <div 
                    class="validation-msg" 
                    :class="{'vue-show-error' : isNameInvalid}"
                >
                    <span v-if="isNameInvalid">Please enter your name</span>
                    <span v-else>This is a required field</span>
                </div>
            </div>

            <!-- Task description input -->
            <div class="description">
                <div 
                    class="description-wrapper" 
                    :class="{'vue-wrong-input' : isDescriptionInvalid}"
                >
                    <textarea 
                        placeholder="Task description"
                        class="description-input" 
                        v-model="description"
                        @keyup="checkDescriptionValidity"
                        @blur="checkDescriptionValidity"
                    ></textarea>
                    <div 
                        class="description-counter"
                        
                    >
                        {{description.length}}/256
                    </div>
                </div>
                <div 
                    class="validation-msg" 
                    :class="{'vue-show-error' : isDescriptionInvalid}"
                >
                    Description must be no more than 256 symbols
                </div>
            </div>
            
            <!-- Task tags input -->
            <div class="tags">
                <div class="tags-wrapper">
                    <input 
                        type="text" placeholder="Task tags"
                        class="tags-input"  
                        :class="{'vue-wrong-input' : isTagsInvalid}"
                        v-model="tag" 
                        @keydown.enter="addTag($event)"
                        @blur="checkTagsValidity"
                    >
                    <button 
                        class="tags-button"
                        @click="addTag"
                    ></button>
                </div>
                <div 
                    class="validation-msg" 
                    :class="{'vue-show-error' : isTagsInvalid}"
                >
                    <span v-if="isTagsInvalid">No more than 4 tags</span>
                    <span v-else>Maximum 4 tags</span>  
                </div>
                <ul class="tags-list">
                    <li 
                        class="tags-item" 
                        v-for="(tag, index) in this.tags" 
                        :key="index"
                    >
                        <div class="tags-item-name">{{tag}}</div>
                        <button 
                            class="tags-item-delete"
                            @click="deleteTag(index)"
                        ></button>
                    </li>
                </ul>
            </div>

            <!-- Task date input -->
            <div class="date">
                <input 
                    type="date" 
                    class="date-input" 
                    :class="{'vue-wrong-input' : isDateInvalid}"
                    v-model="date"
                    @blur="checkDateValidity"
                >
                <div 
                    class="validation-msg" 
                    :class="{'vue-show-error' : isDateInvalid}"
                >
                    <span v-if="isDateInvalid">Date must be later than today</span>
                    <span v-else>Enter after today's date</span>  
                </div>
            </div>

            <div class="time">
                <input 
                    type="time" 
                    class="time-input" 
                    :class="{'vue-wrong-input' : isTimeInvalid}"
                    v-model="time"
                    @blur="checkTimeValidity"
                >
                <div 
                    class="validation-msg" 
                    :class="{'vue-show-error' : isTimeInvalid}"
                >
                    Today time must be greater than now
                </div>
            </div>

            <!-- Buttons -->
            <div class="buttons">
                <button type="submit" class="task-add">Create task</button>
                <button class="task-cancel" @click="toListPage($event)">Cancel</button>
            </div>

        </form>
    </section>   
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Store } from 'vuex';
declare module '@vue/runtime-core' {
    interface State {
        count: number
    }
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
import Task from "@/types/Task.interface"


export default defineComponent({
    data() {
        return {
            // Data from inputs
            name: '',
            description: '',
            tags: [],
            date: '',
            time: '',
            status: 'active',
                       
            tag: '',

            // Validation status
            isNameInvalid: false,
            isDescriptionInvalid: false,
            isTagsInvalid: false,
            isDateInvalid: false,
            isDateToday: false,
            isTimeInvalid: false,

            // Transformed date
            transformDate: '',
        }
    },
    methods: {
        // Methods for adding/removing tags
        addTag(event: KeyboardEvent) {
            event.preventDefault();
            if(this.tags.length < 4) {
                if(this.tag.trim()) {
                    this.tags.push(this.tag.trim())
                    this.tag = ''
                    this.isTagsInvalid = false
                }
            } else {
                this.isTagsInvalid = true
            }
        },
        deleteTag(i: number) {
            this.tags.splice(i, 1)
            this.checkTagsValidity()
        },

        // Validation methods
        checkNameValidity() {
            this.name.trim() === '' ? this.isNameInvalid = true : this.isNameInvalid = false
        },
        checkDescriptionValidity() {
            this.description.length > 256 ? this.isDescriptionInvalid = true : this.isDescriptionInvalid = false
        },
        checkTagsValidity() {
            this.tags.length > 4 ? this.isTagsInvalid = true : this.isTagsInvalid = false
        },
        checkDateValidity() {
            console.log(new Date(this.date).setHours(0,0,0,0))
            console.log(new Date().setHours(0,0,0,0))
            new Date(this.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) ? this.isDateInvalid = true : this.isDateInvalid = false
            new Date(this.date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0) ? this.isDateToday = true : this.isDateToday = false
            this.checkTimeValidity()
        },
        checkTimeValidity() {
            if(this.isDateToday) {
                let thisTime = new Date()
                let timeArr = this.time.split(':')
                thisTime.setHours(+timeArr[0])
                thisTime.setMinutes(+timeArr[1])
                if(+thisTime <= Date.now()) {this.isTimeInvalid = true} else {this.isTimeInvalid = false}
            } else {
                this.isTimeInvalid = false
            }
        },


        // Check all inputs and submit
        checkFormValidity() {
            this.checkNameValidity()
            this.checkDescriptionValidity()
            this.checkDateValidity()
            this.checkTimeValidity()
            if(!this.isNameInvalid && !this.isDescriptionInvalid && !this.isTagsInvalid && !this.isDateInvalid && !this.isTimeInvalid) {

                this.submitHandler()
            }
        }, 

        // Create a task and save it to the vuex store
        submitHandler() {
            const newTask: Task = {
                name: this.name,
                description: this.description,
                tags: this.tags,
                date: this.date,
                time: this.time,
                status: this.status,
                id: Date.now(),
            }
            this.$store.dispatch('addNewTask', newTask)
            this.$router.push('/list')
        },

        // Go back to the list page
        toListPage(event: MouseEvent) {
            event.preventDefault()
            this.$router.push('/list')
        }
    },
});
</script>

<style lang="scss" scoped>
.dark-bg {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1;
}
.create {
    padding-top: 40px;
}
.form {
    max-width: 560px;
    margin: 0 auto;
    padding: 20px 40px;
    border-radius: 8px;
    background-color: #fff;

    display: flex;
    flex-direction: column;
    gap: 20px;
    
    position: relative;
    z-index: 2;
}
.validation-msg {
    font-size: 12px;
    color: var(--grey-dark);

    &.vue-show-error {
        color: var(--red);
    }
}

.title {
    font-size: 18px;
}


.name-input {
    width: 100%;
    padding: 8px 8px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;

    &:focus {
        outline: 0;
    }
}


.description-wrapper {
    padding: 8px 8px;
    padding-bottom: 12px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;
    position: relative;

    &.vue-wrong-input {
        background: none;
    }
}
.description-input {
    width: 100%;
    border: 0;
    resize: unset;

    &:focus {
        outline: 0;
    }
}
.description-counter {
    position: absolute;
    right: 12px;
    bottom: 0;
    font-size: 12px;

    &.vue-show-error {
        color: var(--red);
    }
}


.tags-wrapper {
    position: relative;
}
.tags-input {
    width: 100%;
    padding: 8px 8px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;

    &:focus {
        outline: 0;
    }
    &.vue-wrong-input {
        padding-right: 50px;
        background-position: right 32px center;
    }
}
.tags-button {
    width: 12px;
    height: 12px;
    border: 0;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: url('../assets/icons/add.svg') no-repeat right center / 12px;
    cursor: pointer;
}
.tags-list {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.tags-item {
    padding: 3px 8px 3px 16px;
    background-color: var(--grey);
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.tags-item-name {
    font-size: 12px;
}
.tags-item-delete {
    width: 12px;
    height: 12px;
    border: 0;
    background: url('../assets/icons/delete-x.svg') no-repeat right 4px center / 8px;
    cursor: pointer;
}


.date-input {
    width: 100%;
    padding: 8px 8px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;

    &:focus {
        outline: 0;
    }
    &.vue-wrong-input {
        padding-right: 40px;
    }
}


.time-input {
    width: 100%;
    padding: 8px 8px;
    border: 1px solid var(--grey-dark);
    border-radius: 6px;

    &:focus {
        outline: 0;
    }
    &.vue-wrong-input {
        padding-right: 40px;
    }
}


.buttons {
    display: flex;
    justify-content: space-between;
}
.task-add {
    min-width: 92px;
    padding: 6px 12px;
    border: 0;
    border-radius: 4px;
    background-color: var(--main-color);
    color: #fff;
    cursor: pointer;

    &:hover {
        background-color: var(--main-color-dark);
    }
}
.task-cancel {
    min-width: 92px;
    padding: 6px 12px;
    border: 0;
    border-radius: 4px;
    background-color: var(--grey);
    color: #000;
    cursor: pointer;

    &:hover {
        background-color: var(--grey-dark);
    }
}
.vue-wrong-input {
    padding-right: 30px;
    background: url('../assets/icons/error.svg') no-repeat right 12px center / 18px;
    border-color: var(--red);
}
</style>