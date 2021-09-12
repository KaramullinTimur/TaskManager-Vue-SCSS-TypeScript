<template>
    <div class="home">
        <h1 class="home-title">Welcome to Task Manager Application</h1>
        <p class="home-text">Press the button to start</p>
        <button class="home-button" @click="toListPage">
            Start
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  methods: {
      toListPage() {
          this.$router.push('/list')
      }
  }
});
</script>

<style lang="scss" scoped>
@import url('../assets/scss/variables.scss');

.home {
    padding-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--main-color-dark);
}
.home-title {

}
.home-text {
    margin-top: 8px;
    font-weight: 700;
    font-size: 16px;
}
.home-button {
    padding: 12px 34px;
    margin-top: 24px;
    border-radius: 12px;
    border: none;
    background-color: var(--main-color-light);
    color: var(--main-color-dark);
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    
    &:hover {
        background-color: var(--main-color);
        color: #fff;
    }
}
</style>
