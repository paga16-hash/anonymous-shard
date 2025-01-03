<script setup lang="ts">

import {useQuasar} from "quasar";
import {onMounted, ref} from "vue";
import RequestHelper, {providerHost} from "../utils/RequestHelper";
import type {Peer} from "../domain/core/Peer";
import {composePeer} from "../presentation/ComposePeer";
import PeerBadge from "../components/peer/PeerBadge.vue";

const $q = useQuasar()
const peers: ref<Peer[]> = ref([])
const peerNumber = ref(0)

async function getPeers() {
  await RequestHelper.get(`${providerHost}/peers/`)
      .then(async (res: any) => {
        console.log(`${providerHost}/peers/`)
        console.log(res)
        peers.value = []
        for (let i = res.data.length - 1; i >= 0; i--) {
          peers.value.push(composePeer(res.data[i]))
          peerNumber.value++
        }
      })
      .catch(error => {
        console.log(error)
      })
}

onMounted(async () => {
  await getPeers()
})
</script>

<template>
  <h5 class="title">
    Known peers: {{ peerNumber }}
  </h5>
  <div>
    <peer-badge
        v-for="(peer, index) in peers"
        :key="index"
        :peer="peer"
    />
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-top: 135px;
  margin-left: 10px;
}

</style>
