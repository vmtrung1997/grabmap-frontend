<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="col-md-9">
          <l-map
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 500px;width: 900px;z-index: 0 !important;"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate">
        <l-tile-layer
          :url="url"
          :attribution="attribution"/>
        <l-marker :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"
          :icon="marker.icon"/>
        
        <l-polyline
            :lat-lngs="polylineRequest.points"
            :visible="polylineRequest.visible"
            :color="polylineRequest.color" />
        
          </l-map>
        </div>
        <div class="col-md-3">
          <div class="group-row">
              <label>Current driver position:</label>&nbsp;{{marker.position}}
              <div>
            <input type="button" class="btn btn-default btn-located" @click="setLocation" value="Set locate" :disabled="!isLocated"/>
            <input type="button" class="btn btn-default btn-located" @click="getLocation" value="Get locate" :disabled="isLocated"/>
              </div>
          </div>
          <div class="group-row">
            <label>Current state:</label>&nbsp;{{currentState}}
            <div>
                <input type="button" class="btn btn-default btn-located" @click="changeState" value="Change State" :disabled="isReady && !isLocated"/>
            </div>
          </div>
        </div>
        <div class="group-row" v-show="divStarting">
          <label>Strarting</label>&nbsp;
              <input type="button" class="btn btn-default btn-located" @click="onStartingRequest" value="Starting" :disabled="isStarting"/>
              <input type="button" class="btn btn-default btn-located" @click="onFinishRequest" value="Finished"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPolyline } from "vue2-leaflet";
import { L } from "vue2-leaflet";
// import ConfirmDialog from './ConfirmModal.vue'
export default {
  name: "identifiermap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline
      },
  data() {
    return {
      zoom: 15,
      center: L.latLng(10.7721, 106.65777),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [],
      marker: {
        position: { lat: 10.7721, lng: 106.65777 },
        draggable: false,
        visible: true,
        icon: L.icon.glyph({
          prefix: "",
          glyph: "D"
        })
      },
      tempMarkers: [],
      currentZoom: 11.5,
      currentCenter: L.latLng(10.7721, 106.65777),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      request: {},
      isDisable: true,
      isLocated: true,
      isReady: false,
      profile: {},
      path: {},
      polylineRequest: {
        points: [],
        visible: false,
        color: 'red'
      },
      markerRq: {
        visible: false,
        position: {
          lat: 0,
          lng: 0
        },
        icon: L.icon.glyph({
          prefix: "",
          glyph: "R"
        })
      },
      isStarting:false,
      divStarting: false,
      value: '',
      active : false,
      data: {}
    };
  },
  computed: {
    currentState() {
      return this.isReady ? "READY" : "STANDBY";
    }
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    setLocation() {
      this.marker.draggable = true;
      this.isLocated = false;
    },
    getLocation() {
      this.marker.draggable = false;
      this.isLocated = true;

    },
    changeState() {
      var self = this;
      self.isReady = !self.isReady;
      var data = {
            driverId: this.profile._id,
            position: {lat: this.marker.position.lat,lng: this.marker.position.lng}
          }
      if (self.isReady)
        {
          this.$socket.emit('driver_ready', data);
        }
      else{
          this.$socket.emit('driver_standby', data);
      }
    },
    onAcceptRequest(data) {
      this.request = data.requestId;
      this.path = data.path;
      console.log(data);
    },
    getPath(data){
      var ret = [];
      var dataArr  = data.path.points.coordinates;
      for(var i of dataArr) {
          ret.push(i.reverse());
      }
      console.log(this.polylineRequest);
      this.polylineRequest.points = ret;
      this.polylineRequest.visible = true;

      this.markerRq.position = data.request.position;
      this.markerRq.visible = true;

    },
    onStartingRequest(){
        this.$socket.emit('driver_starting_request', this.data);
        this.isStarting = true;
    },

    onClickMap(event){
      if (this.isStarting){
      console.log(event.latlng);
        var data ={
          driver: this.data.driver,
          start: this.marker.position,
          end: event.latlng
        }
        this.$socket.emit('driver_moving', data);
      }
    },
    onFinishRequest(){
      if (this.isStarting){
        var data = {
          driver: this.data.driver,
          request: this.data.request,
          point: this.marker.position
        }
        this.$socket.emit('driver_finish', data);
      }
    },
    resetRequest(){
      this.markerRq.visible = false;
      this.polylineRequest.visible = false;
      this.request = {};
      this.data = {};
      this.divStarting = false;
    }
    // onConfirm(){
    //   this.$socket.emit('driver_accept_request', this.data);
    // },
    // onCancel(){
    //   this.$socket.emit('driver_discard_request', this.data);
    // }
    // removeUserFromList (userToRemove) {
    //     console.log('confirm');
    //   }
  },
  created() {},
  beforeMount() {
    this.profile = this.$store.state.profile;
    this.$socket.emit("driver_loged", { id: this.profile._id });
  },
  mounted() {
    var self=this;
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 250);
    self.$socket.on('driver_confirm_request', function(data){
      // self.$dialog.confirm('Request from ' + data.path)
      //   .then(function (dialog) {
            
      //       console.log('Clicked on proceed')
      //       dialog.close && dialog.close();
      //       console.log(data);
      //       self.$socket.emit('driver_accept_request', data);
      //       self.getPath(data);
      //   })
      //   .catch(function (error) {
      //       console.log('Clicked on cancel')
      //   });
      // self.data = data;
      // self.active = true;
      if (window.confirm('Request from ' + data.path.distance)){
        console.log(data);

        self.$socket.emit('driver_accept_request', data);
        self.data = data;
        self.divStarting = true;
        self.getPath(data);
      } else {
        self.$socket.emit('driver_discard_request', data);
      }
    });
    self.$socket.on('driver_accept_request', function(data){

    });

    self.$socket.on('drive_moving_response', function(data){
      if (data.distance > 100){
        self.$toastr.error('Distance orver 100m', 'Error');
      }
      else{
        self.$toastr.success('Driver position update', 'Success');
        self.marker.position = data.returnData.end;
      }
    });

    self.$socket.on('drive_finished', function(data){
      if (data.res){
        self.$toastr.success('Request finish', 'Success');
        self.resetRequest();
        var data = {
            driverId: self.profile._id,
            position: {lat: self.marker.position.lat,lng: self.marker.position.lng}
          }
        self.$socket.emit('driver_ready', data);
      }
      else{
        self.$toastr.error('Driver position update', 'Error');
      }
    });

  },
  beforeDestroy(){
    this.$socket.emit('driver_logout')
  }
};
</script>
<style>
.btn-located {
  max-height: 200px;
  margin: 0 20px;
}
.btn-located:hover{
  color: Khaki;
}
.group-row {
  display: block;
  margin-bottom: 20px;
  text-align: left;
  font-size: 25px;
}
</style>
