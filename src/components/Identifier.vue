<template>
  <div class="about">
    <h1>Request not located table</h1>
    <table class="table table-hover">
        <thead>
            <tr >
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Note</th>
                <th>State</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(request,index) in requests" :key="index">
                <td class="text-left">{{request.name}}</td>
                <td class="text-left">{{request.phone}}</td>
                <td class="text-left">{{request.address}}</td>
                <td class="text-left">{{request.note}}</td>
                <td class="text-left">{{request.state}}</td>
                <td class="text-left"><router-link :to="{name: 'locate', params:{id: request._id}}">located</router-link></td>
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
          this.$store.dispatch('getRequestTable', {state: "not_locate"})
            .then(data => self.requests = data)
            .catch(error => console.log(error));
        //alert('client create request')
      }
  },
  beforeMount() {
      this.getRequest();
  },
  mounted() {
      this.$socket.on('client_create_request', this.getRequest);
  }
}
</script>