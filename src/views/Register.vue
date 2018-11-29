<template>
  <div class="page-wrapper my-form">
    <h2>Register</h2>
    <form action="#" @submit.prevent="submit">

      <!-- <div v-if="successMessage" class="success-message">{{ successMessage }}</div> -->

      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" class="form-control"  v-model="fullname" required>
      </div>

      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" class="form-control" v-model="username" required>
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="text" name="phone" id="phone" class="form-control" v-model="phone" required>
      </div>

      <div class="form-group mb-more">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" class="form-control" v-model="password" required>
      </div>
      <div class="form-group">
            <label>Choose type</label>
            <select class="form-control" name="selector" id="selector" v-model="type">
                <option value="client">Client</option>
                <option value="identifier">Identifier</option>
                <option value="manager">Manager</option>
                <option value="driver">Driver</option>
            </select>
        </div>
      <div class="form-group">
        <button type="submit" class="btn btn-submit">Create Account</button>
      </div>

    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullname: '',
      username: '',
      password: '',
      phone: '',
      type: '',
    }
  },
  methods: {
    submit() {
      var self = this;
      this.$store.dispatch('register',{
        fullname: this.fullname,
        username: this.username,
        password: this.password,
        phone: this.phone,
        type: this.type
      }).then(result => {
        if (result.data){
          this.$toastr.success('Register has been successfuly', 'Success');
          this.$router.push({name: 'login'})
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
}
</script>
