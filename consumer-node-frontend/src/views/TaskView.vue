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
  console.log("Getting tasks")
  await RequestHelper.get(`${consumerHost}:4010/tasks`)
    .then(async (res: any) => {
      tasks.value = []
      for (let i = res.data.length - 1; i >= 0; i--) {
        tasks.value.push(composeTask(res.data[i]))
      }
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
  <h2>Tasks</h2>
  <div>
    <task-badge
      v-for="(task, index) in tasks"
      :key="index"
      :task="task"
    />
  </div>
</template>

<style scoped lang="scss">
h2 {
  margin-top: 120px;
}
</style>
