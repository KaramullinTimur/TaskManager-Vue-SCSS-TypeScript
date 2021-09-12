<template>
    <header class="header">
        <div class="header-container">

            <div 
                class="hamburger" 
                @click="toggleSidebar" 
                :class="{'hamburger-clicked' : isSidebarShown}"
            >
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
                <div class="hamburger-line"></div>
            </div>

            <div class="logo">TASK <span class="logo-span">MANAGER</span></div>
            
            <router-link to="/" class="home"></router-link>

            <div class="search">
                <button 
                    class="search-button"
                    @click="saveSearchInput(); selectFilter('Search')"
                ></button>
                <input 
                    type="search"
                    placeholder="Search by task name"
                    class="search-input" 
                    v-model="searchInput"
                    @keydown.enter="saveSearchInput(); selectFilter('Search')"
                >
            </div>

            <div class="settings">
                <button class="settings-button" @click="toggleSettingsList($event)"></button>
                <ul class="settings-list" :class="{'show-settings-list' : isSettingsListShown}">
                    <li class="settings-item">
                        <div class="settings-name">Theme</div>
                        <ul class="settings-dropdown">
                        <li 
                            class="settings-item" 
                            @click="changeTheme(['#2696E8','#B9E2FF','#0160A3', '#B9F4FF'])"
                        >
                            Blue
                        </li>
                        <li 
                            class="settings-item" 
                            @click="changeTheme(['#231C33','#DDD9FF','#231C33','#D4B9FF'])"
                        >
                            Dark
                        </li>
                        <li 
                            class="settings-item" 
                            @click="changeTheme(['#EE9A1D','#FFE4AA','#A34F01','#FFF2B9'])"
                        >
                            Orange
                        </li>
                        </ul>
                    </li>
                </ul>
            </div>

        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Task from '@/types/Task.interface'

export default defineComponent({
    data() {
        return {
            // Data for searching tasks
            searchInput: '',

            // Data for adding css class to settings button
            isSettingsListShown: false,
        }
    },
    computed: {
        // All tasks from store
        tasks(): Task {
            return this.$store.getters.getTasks
        },
        isSidebarShown(): boolean {
            return this.$store.getters.isSidebarShown
        },
    },
    methods: {
        // Search tasks method
        saveSearchInput() {
            this.$store.dispatch('saveSearchInput', this.searchInput)
        },
        selectFilter(filter: string) {
            this.$store.dispatch('selectFilter', filter)
        },

        // Adding css class to show/hide settings
        toggleSettingsList(event: any) {
            !this.isSettingsListShown ? this.isSettingsListShown = true : this.isSettingsListShown = false
            event.target.addEventListener('click', (event: Event) => {
                event.stopPropagation()
            })   
            event.target.nextSibling.addEventListener('click', (event: Event) => {
                event.stopPropagation()
            })  
            document.body.addEventListener('click', () => {
                this.isSettingsListShown = false
            })    
        },

        // Show/hide sidebar
        toggleSidebar() {
            this.$store.commit('toggleSidebar')
        },

        // Change color theme of application
        changeTheme([main, light, dark, logo]: string[]) {
            document.documentElement.style.setProperty("--main-color", main);
            document.documentElement.style.setProperty("--main-color-light", light);
            document.documentElement.style.setProperty("--main-color-dark", dark);
            document.documentElement.style.setProperty("--logo", logo);
        }
    },
});
</script>

<style lang="scss" scoped>
    @import url('../assets/scss/variables.scss');

    .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 5px 0;
        background-color: var(--main-color);
        color: #fff;
        z-index: 98;
    }
    .header-container {
        margin: 0 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .logo {
        font-weight: 700;
        font-size: 18px;
        line-height: 1.2;
        margin-right: 28px;
        cursor: default;
    }
    .logo-span {
        color: var(--logo);
    }

    .home {
        width: 32px;
        height: 32px;
        margin-right: 48px;
        background: url('../assets/icons/home.svg') no-repeat center center / 24px;
        cursor: pointer;

        &:hover {
            transform: scale(1.1);
        }
        &:active {
            transform: scale(1);
        }
    }

    .search {
        height: 34px;
        display: flex;
        position: relative;
    }
    .search-button {
        width: 32px;
        height: 32px;
        margin-right: 24px;

        border: none;
        background: url('../assets/icons/search.svg') no-repeat center center / 20px;
        cursor: pointer;

        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
    }
    .search-input {
        display: block;
        min-width: 240px;
        min-height: 100%;
        padding-left: 40px;

        font-size: 16px;
        color: #fff;
        letter-spacing: 1px;

        border: 0;
        border-radius: 6px;
        background-color: transparent;

        &::placeholder {
            font-size: 16px;
            color: #eee;
        }
        &:focus{
            outline: 0;
            background-color: #55adec;
        }
        &:focus.search-input::placeholder {
            color: transparent;
        }
    }
    
   
    .settings {
        margin-left: auto;
        position: relative;
    }
    .settings-button {
        width: 28px;
        height: 28px;

        border: none;
        background: url('../assets/icons/settings.svg') no-repeat center center / 28px;
        cursor: pointer;

        &:hover {
            transform: scale(1.1);
        }
    }
    .settings-list {
        position: absolute;
        top: 100%;
        left: 100%;
        transform: translateX(-100%);
        display: flex;
        flex-direction: column;
        border: 1px solid #aaa;
        background-color: #fff;
        display: none;

        &.show-settings-list {
            display: block;
        }
    }
    .settings-item {
        min-width: 160px;
        padding: 10px 20px;
        color: #333;
        cursor: pointer;
        position: relative;

        &:hover {
            background-color: var(--main-color-light);
        }
        &:hover>.settings-dropdown {
            display: block;
        }
    }
    .settings-dropdown {
        position: absolute;
        right: 100%;
        top: 0;
        background-color: #fff;
        border: 1px solid #aaa;
        display: none;
    }



    @media screen and (max-width: 768px) {
        .header-container {
            margin: 0 20px;
        }
        .hamburger {
            height: 18px;
            width: 24px;
            margin-right: 18px;
            cursor: pointer;

            animation-name: rotateHamburgerReverse;
            animation-duration: 0.4s;
            animation-fill-mode: forwards;
        }
        .hamburger-clicked {
            animation-name: rotateHamburger;
            animation-duration: 0.4s;
            animation-fill-mode: forwards;
        }

        .hamburger-line {
            width: 100%;
            height: 2px;
            margin-bottom: 6px;
            background-color: #fff;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .logo {
            display: none;
        }
        .search-input {
            min-width: 200px;
            font-size: 12px;
            &::placeholder {
                font-size: 12px;
            }
        }
        .home {
            margin-right: 12px;
            background-size: 20px;
        }
        .search {
            height: 30px;
        }
        .search-button {
            background-size: 18px;
        }
        .settings-button {
            background-size: 24px;
        }


        @media screen and (max-width: 576px) {
            .header-container {
                margin: 0 10px;
            }
        }



        @keyframes rotateHamburger {
            0% {
                transform: rotate(0)
            }
            90% {
                transform: rotate(100deg)
            }
            100% {
                transform: rotate(90deg)
            }    
        }
        @keyframes rotateHamburgerReverse {
            0% {
                transform: rotate(90deg)
            }
            90% {
                transform: rotate(-10deg)
            }
            100% {
                transform: rotate(0)
            }  
        }
    }
</style>