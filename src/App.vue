<template>
  <Header />
  <Sidebar />
  <main>
    <router-view/>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from "@/components/Header.vue"
import Sidebar from "@/components/Sidebar.vue"

export default defineComponent({
  components: {Header, Sidebar}
});
</script>

<style lang="scss">
  @import url('./assets/scss/base.scss');
  @import url('./assets/scss/fonts.scss');
  @import url('./assets/scss/variables.scss');

  main {
    margin-left: 280px;
    margin-top: 44px;
  }

  @media screen and (max-width: 1024px) {
    main {
      margin-left: 240px;
    }      
  }
  @media screen and (max-width: 768px) {
    main {
      margin-left: 0px;
    }      
  }
</style>
