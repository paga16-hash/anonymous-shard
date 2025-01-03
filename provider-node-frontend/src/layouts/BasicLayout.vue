<script setup>
import { ref } from 'vue'
import NavbarComponent from "../components/NavbarComponent.vue";


const rightDrawerOpen = ref(false)
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>

<template>
  <navbar-component @toggle-aside="toggleRightDrawer" />

  <div class="container-view">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
div.container-view {
  margin: 60px 1rem 1rem;
}
</style>
