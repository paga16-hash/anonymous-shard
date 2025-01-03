<script setup lang="ts">
import {useQuasar} from 'quasar'
import type {Peer} from "../../domain/core/Peer";
import {TaskType, TaskTypeConverter} from "../../utils/Converters";
import RequestHelper, {providerHost} from "../../utils/RequestHelper";
import {composeMetricMessage} from "../../presentation/ComposePeer";

const { peer } = defineProps<{
  peer: Peer
}>()

const $q = useQuasar()
console.log(peer)

const showMetrics = (id: string) => {
  RequestHelper.get(`${providerHost}/peers/${id}/metrics`)
    .then((res: any) => {
      peer.metric = res.data
      $q.dialog({
        title: 'Peer Metrics',
        message: composeMetricMessage(peer.metric),
        persistent: true,
        ok: 'Close',
      })
    })
    .catch(error => {
      console.error(error)
    })


}
</script>

<template>
  <li>
    <q-icon size="28px" name="polyline" />
    <span class="id">
      {{ peer.id.toUpperCase() }}
    </span>
    <span class="metrics">
      <q-btn
          @click="showMetrics(peer.id)"
          color="primary"
          label="Available metrics"
          style="margin-left: 20px"
          size="sm"></q-btn>
    </span>
  </li>
</template>

<style scoped lang="scss">

.id {
  max-width: max-content;
}

.metrics {
  font-size: 0.7rem;
  margin-left: auto;
}

li {
  list-style: none;
  width: 100%;
  border: #51346A 1px solid;
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
