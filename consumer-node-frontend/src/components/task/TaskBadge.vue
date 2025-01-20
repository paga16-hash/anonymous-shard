<script setup lang="ts">
import { useQuasar } from 'quasar'
import type { Task } from '../../domain/core/Task'
import { TaskType, TaskTypeConverter } from '../../utils/Converters'
import RequestHelper, { consumerHost } from '../../utils/RequestHelper'

const { task } = defineProps<{
  task: Task
}>()

const $q = useQuasar()

const showDetails = (type: TaskType, details: any) => {
  details = JSON.parse(details)
  let message = ''
  switch (type) {
    case TaskType.SUM:
      message = `Addends: `
      for (let i = 0; i < details.value.addends.length; i++) {
        message += `${details.value.addends[i]}`
        if (i < details.value.addends.length - 1) {
          message += ` + `
        }
      }
      break
  }
  $q.dialog({
    title: 'Task Details',
    message: message,
    persistent: true,
    ok: 'Close'
  })
}

const showResults = (id: any) => {
  let message = ''
  console.log(`${consumerHost}/tasks/${id}/results`)
  RequestHelper.get(`${consumerHost}/tasks/${id}/results`)
    .then((res: any) => {
      console.log(res)
      message = 'Result of the sum: ' + res.data.result
      $q.dialog({
        title: 'Results',
        message: message,
        persistent: true,
        ok: 'Close'
      })
    })
    .catch(error => {
      console.error(error)
    })
}
</script>

<template>
  <li>
    <q-icon v-show="task.status === 'PENDING'" size="28px" name="pending_actions" />
    <q-icon v-show="task.status === 'COMPLETED'" size="28px" name="done" />
    <span class="id">
      {{ task.id.value.substring(24).toUpperCase() }}
    </span>
    <span class="type"> {{ TaskTypeConverter.from(task.id.type) }} </span>
    <span
      :style="{
        color: task.status === 'PENDING' ? 'orange' : task.status === 'COMPLETED' ? 'green' : 'inherit'
      }"
    >
      {{ task.status }}
    </span>
    <span class="results">
      <q-btn
        @click="showDetails(task.id.type, JSON.stringify(task.details))"
        color="primary"
        label="Details"
        size="sm"
      ></q-btn>
      <q-btn
        v-show="task.status === 'COMPLETED'"
        @click="showResults(task.id.value)"
        color="primary"
        label="Results"
        style="margin-left: 20px"
        size="sm"
      ></q-btn>
    </span>
  </li>
</template>

<style scoped lang="scss">
.id {
  max-width: max-content;
}

.results {
  font-size: 0.7rem;
  margin-left: auto;
}

li {
  list-style: none;
  width: 100%;
  border: #51346a 1px solid;
  border-radius: 5px;
  background: #eeeeee;
  padding: 10px;
  margin: 10px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;

  div.measures {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;

    @media screen and (max-width: 576px) {
      flex-direction: column;
      gap: 5px;
    }
  }

  h3 {
    flex-basis: 200px;
    line-height: 1;

    @media screen and (max-width: 576px) {
      flex-basis: 100px;
    }
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .results {
      font-size: 0.7rem;
      color: gray;
    }
  }
}
</style>
