<template>
  <div class="about">
    <h1>App3 Manager</h1>
    <table class="table table-hover table-manage">
        <thead>
            <tr >
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Note</th>
                <th>State</th>
                <th>View Path</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(request,index) in requests" :key="index">
                <td class="text-left">{{request.name}}</td>
                <td class="text-left">{{request.phone}}</td>
                <td class="text-left">{{request.address}}</td>
                <td class="text-left">{{request.note}}</td>
                <td class="text-left">{{request.state}}</td>
                <td class="text-left"><router-link v-if="request.state=='request accepted' || request.state=='moving' || request.state=='finished'" :to="{name: 'viewPath', params:{id: request._id}}">view status</router-link></td>
            </tr>
        </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'Manager',
  data() {
      return {
          requests: []
      }
  },
  methods:{
      getRequest(){
          var self = this;
          this.$store.dispatch('getRequestTable', {})
            .then(data => self.requests = data)
            .catch(error => console.log(error));
        //alert('client create request')
      },
  },
  beforeMount() {
      this.getRequest();
  },
  mounted() {
      this.$socket.on('user_load_requests', this.getRequest);
  }
}
</script>

<style>
  .table-manage {
    margin-top: 4%;
  }
  .about {
    margin-top: 40px;
  }
</style>