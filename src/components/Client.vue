<template>
  <div class="my-form">
    <h1>
        App1 Client
    </h1>
    <form action="#" @submit.prevent="createRequest">
                <div class="form-group">
                    <label for="name">Full name</label>
                    <input type="text" class="form-control" v-model="name" placeholder="Enter full name" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" class="form-control" v-model="phone" placeholder="Enter phone" required>
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" class="form-control" v-model="address" placeholder="Enter address" required>
                </div>
                <div class="form-group">
                    <label for="address">Note</label>
                    <input type="text" class="form-control" v-model="note" placeholder="Enter a note">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
  </div>
</template>
<script>
export default {
  name: 'Client',
  data() {
      return {
          name: '',
          phone: '',
          address: '',
          note: ''
      }
  },
  methods: {
      createRequest() {
          var self = this;
          this.$store.dispatch('submitRequest', {
              name: this.name,
              phone: this.phone,
              address: this.address,
              note: this.note
          }).then(result => {
                if (result.data.success)
                {
                    self.$socket.emit('client_create_request')
                    self.name='';
                    self.phone='';
                    self.address='';
                    self.note='';
                    this.$toastr.success('Request has been submited', 'Success');
                }
          }).catch(error => {
              console.log(error)
          })
      }
  }
}
</script>