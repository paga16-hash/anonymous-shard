<script setup lang="ts">

import {useQuasar} from "quasar";
import {onMounted, ref} from "vue";
import RequestHelper, {consumerHost} from "../utils/RequestHelper";
import type {Task} from "../domain/core/Task";
import {composeTask} from "../presentation/ComposeTask";
import TaskBadge from "../components/task/TaskBadge.vue";

const $q = useQuasar()
const tasks: ref<Task[]> = ref([])

async function getTasks() {
  console.log(`${consumerHost}/tasks/`)
  await RequestHelper.get(`${consumerHost}/tasks/`)
      .then(async (res: any) => {
        tasks.value = []
        for (let i = res.data.length - 1; i >= 0; i--) {
          tasks.value.push(composeTask(res.data[i][0], res.data[i][1]))
        }
      })
      .catch(error => {
        console.log(error)
      })
}

async function simulateSubmit() {
  await RequestHelper.post(`${consumerHost}/tasks/`, {})
      .then(async () => {
        await getTasks()
      })
      .catch(error => {
        console.log(error)
      })
}

onMounted(async () => {
  await getTasks()
})
</script>

<template>
  <div class="tasks">
    <button
        @click="simulateSubmit"
        style="margin-left: 10px"
    >Simulate submit
    </button>
    <button
        @click="getTasks"
        style="margin-left: 10px"
    >Refresh
    </button>
    <task-badge
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
    />
  </div>
</template>

<style scoped lang="scss">
.tasks {
  margin-top: 135px;
}
</style>
