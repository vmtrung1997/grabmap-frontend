<template>
  <div class="page-wrapper my-form">
    <h2>Login</h2>
    <form action="#" @submit.prevent="login">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" id="username" class="form-control" v-model="username">
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" id="password" class="form-control" v-model="password">
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-success btn-submit">
          Login
        </button>
      </div>

    </form>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "login",
  data (){
      return {
          username: '',
          password: '',
      }
  },
  methods: {
      login() {
          console.log('login');
          this.$store.dispatch('retrieveToken', {
            username: this.username,
            password: this.password,
            })
            .then(response => {
                if (response.data.auth == false)
                {
                  this.$toastr.error('Username or password incorrect', 'Error');
                  return;
                }
                this.$router.push({ name: 'home' })
            })
            .catch(error => {
                console.log(error);
            })
      }
  }
};
</script>