<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import router from '../router'
import { symSharpControlCamera } from '@quasar/extras/material-symbols-sharp'

const routeName = computed(() => router.currentRoute.value.name)
const navbarExpanded = ref(false)
</script>

<template>
  <nav :class="navbarExpanded ? 'expanded' : ''">
    <div class="title">
      <h1>Provider</h1>
      <q-btn class="menu" flat @click="navbarExpanded = !navbarExpanded" round dense icon="menu" />
    </div>
    <router-link to="/home" :class="routeName == 'Home' ? 'selected' : ''">Peers </router-link>
    <router-link to="/other" :class="routeName == 'Other' ? 'selected' : ''">Other </router-link>
    <img src="../assets/logo.png" alt="Anonymous Shard Logo" class="logo" style="font-size: 1.5em" />
  </nav>
</template>

<style scoped lang="scss">
nav {
  z-index: 10;
  position: fixed;
  top: 0;
  width: 100%;
  max-height: 150px;
  overflow: hidden;
  transition: max-height 200ms linear;
  background-color: #51346a;
  padding: 10px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.3rem;

  &.expanded {
    max-height: 300px;
  }

  div.title {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: white;
    margin-right: 10px;

    h1 {
      all: unset;
      margin-right: auto;
      font-size: 20px;
      font-weight: bold;
    }
  }

  button.menu {
    display: none;
    color: white;
  }

  .home,
  .logout {
    margin-left: auto !important;
  }

  .logo {
    width: 70px;
    height: 70px;
    margin-left: auto;
    border-radius: 30%;
  }

  a {
    font-size: 16px;
    box-sizing: border-box;
    position: relative;
    color: white;
    text-decoration: none;
    padding: 1px 5px;
    margin: 0 5px;

    &:hover {
      background-color: transparent;
      border-radius: 5px;
    }

    &::before {
      content: '';
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      transform-origin: center;
    }

    &::before {
      border-bottom: 1px solid white;
      transform: scale3d(0, 1, 1);
    }

    &:hover::before,
    &.selected::before {
      transform: scale3d(1, 1, 1);
      transition: transform 200ms;
    }
  }
}

@media screen and (max-width: 700px) {
  nav {
    flex-direction: column;

    div.title {
      width: 100%;
    }

    .home,
    .logout {
      margin-left: unset !important;
    }

    button.menu {
      display: inline-flex;
    }

    .selected {
      display: block !important;
    }

    .logo {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
