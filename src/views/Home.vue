<template>
  <div class="home">
    <div v-if="getType == 'client'">
      <Client />
    </div>
    <div v-else-if="getType == 'identifier'">
      <Identifier />
    </div>
    <div v-else-if="getType == 'manager'">
      <Manager />
    </div>
    <div v-else-if="getType == 'driver'">
      <Driver />
    </div>
    <div v-else>
      <HelloWorld />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Client from '@/components/Client.vue'
import Identifier from '@/components/Identifier.vue'
import Manager from '@/components/Manager.vue'
import Driver from '@/components/Driver.vue'
export default {
  name: 'home',
  components: {
    HelloWorld,
    Client,
    Identifier,
    Manager,
    Driver
  },
  computed: {
    getType(){
      return this.$store.getters.userType;
    }
  },
  created(){
    this.$store.dispatch('getProfile');
  }
}
</script>
