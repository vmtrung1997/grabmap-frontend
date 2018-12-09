<template>
  <div id="app">

    <ul class="nav">
      <li class="profile" v-if="loggedIn">Hello {{profileName}}</li>
      <li><router-link to="/">Home</router-link> </li>
      <li><router-link to="/about">About</router-link> </li>
      <li v-if="!loggedIn"><router-link to="/login">Login</router-link> </li>
      <li v-if="!loggedIn"><router-link to="/register">Register</router-link> </li>
      <li v-if="loggedIn"><router-link to="/logout">Logout</router-link> </li>
  </ul>
  <div class="container">
    <div class="container-fruid">
      <router-view/>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    profileName(){
      return this.$store.getters.profile.fullname || null;
    },
    
  },
  beforeDestroy() {
      this.$store.dispatch('destroyToken');
  }
}
</script>

<style>
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0px;
}
  /* .container {
    height: 555px;
    width: 100%;
    background-image: linear-gradient(to left,  #abbaab, #ffffff, #abbaab);
  } */
  .my-form {
    max-width: 500px;
    margin: 0 auto;
  }
   .nav {
    display: flex;
    list-style: none;
    padding: 15px 0;
    margin: 0;
    justify-content: flex-end;
    background: #F5F8FA;
    border-bottom: 1px solid lightgrey;
  }

  .nav a {
    color: #636b6f;
    padding: 0 25px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .1rem;
    text-decoration: none;
    text-transform: uppercase;
  }

  .nav>.profile {
    color: #636b6f;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .1rem;
    text-decoration: none;
    text-transform: uppercase;
  }
  .form-group{
    text-align: left;
  }


</style>
