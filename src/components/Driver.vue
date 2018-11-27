<template>
  <div>
    <div class="container">
      <div class="col-md-8">
        <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 400px;width: 600px"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate">
      <l-tile-layer
        :url="url"
        :attribution="attribution"/>
      <l-marker :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position"/>
    </l-map>
      </div>
      <div class="col-md-4">
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
    </div>
    <!-- <md-dialog-confirm
      :md-active.sync="active"
      md-title="Use Google's location service?"
      md-content="Let Google help apps determine location. <br> This means sending <strong>anonymous</strong> location data to Google, even when no apps are running."
      md-confirm-text="Agree"
      md-cancel-text="Disagree"
      @md-cancel="onCancel"
      @md-confirm="onConfirm" /> -->
    <div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import Vue from 'vue'
import { L } from "vue2-leaflet";

export default {
  name: "identifiermap",
  components: {
    LMap,
    LTileLayer,
    LMarker
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
          glyph: "A"
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
      var position = {
        lat: this.marker.position.lat,
        lng: this.marker.position.lng
      };
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
    onConfirm () {
        this.value = 'Agreed'
        this.active = false;
      },
      onCancel () {
        this.value = 'Disagreed'
        this.active = false;
      }
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
      //   })
      //   .catch(function () {
      //       console.log('Clicked on cancel')
      //   });
      // self.data = data;
      // self.active = true;
      var r = confirm('Request from ' + data.path.distance);
      if (r){
        self.$socket.emit('driver_accept_request', data);
      } else {
        self.$socket.emit('driver_discard_request', data);
      }
    })
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
.group-row {
  display: block;
  margin-bottom: 20px;
  text-align: left;
}
</style>
