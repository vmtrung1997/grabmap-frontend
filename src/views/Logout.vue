<template>
  <div></div>
</template>

<script>
export default {
  created() {
    var self = this;
    this.$store.dispatch('clearProfile')
    this.$store.dispatch('destroyToken')
      .then(response => {
        this.$router.push({ name: 'home' })
      })
  },
  mounted(){
    if (this.$store.getters.profile.type == 'driver'){
      this.$socket.emit('driver_logout')
    }
  }
}
</script>

