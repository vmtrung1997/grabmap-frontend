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
  }
}
</script>

