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
      <l-marker v-for="(marker, index) in markers" :key="index" :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position">
        <l-popup>
          <div @click="popupClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit 
            </p>
          </div>
        </l-popup>
      </l-marker>
      <l-marker :visible="marker.visible"
        :draggable="marker.draggable"
        :lat-lng.sync="marker.position"/>
    </l-map>
      </div>
      <div class="col-md-4">
        <div>
          <form action="">
            <h2>
              Request
            </h2>
            <div class="form-group">
              <label for=""> Fullname: </label>{{request.name}}
            </div>
            <div class="form-group">
              <label for="">Phone: </label>{{request.phone}}
            </div>
            <div class="form-group">
              <label for="">Address: </label>{{request.address}}
            </div>
            <div class="form-group">
              <label for="">Note: </label>{{request.note}}
            </div>
          </form>
        </div>
        <div class="group-row">
          <input type="button" class="btn btn-default btn-located" @click="setLocation" value="Set locate" :disabled="!isDisable"/>
        </div>
        <div class="group-row">
          <input type="button" class="btn btn-default btn-located" @click="submitRequest" value="Submit" :disabled="isDisable"/>
        </div>
      </div>
    </div>
    <div>
     
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LLayerGroup } from "vue2-leaflet";

import { L } from "vue2-leaflet";

export default {
  name: "identifiermap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
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
        position: { lat: 1, lng: 1 },
        draggable: false,
        visible: false,

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
      isDisable: true
    };
  },
  created() {
    var self = this;
    this.$store
      .dispatch("getRequestLocation", { idRequest: this.$route.params.id })
      .then(result => {
        self.$socket.emit('identifier_locating_request');
        console.log(result);
        self.request = result.request;
        let i = 0;

        if (result.location.length > 0) {
          for (let item of result.location) {
            let marker = new Object({
              id: i,
              position: { lat: item.latitude, lng: item.longitude },
              tooltip: item.state,
              draggable: false,
              visible: true,

              icon: L.icon.glyph({
                prefix: "",
                glyph: "A"
              })
            });
            i = i + 1;
            self.markers.push(marker);
          }
          let item = result.location[0];
          self.center = L.latLng(item.latitude, item.longitude);
        }
      });
  },
  beforeMount() {
    console.log(this.$route.params);
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    popupClick() {
      alert("Popup Click!");
    },
    submitRequest() {
      var self = this;
      var requestLocated = {
        request: this.request,
        position: this.marker.position
      }
      console.log(requestLocated)
      this.$store.dispatch('requestLocated',requestLocated).then(result=>{
        this.$socket.emit('identifier_located_request', requestLocated);
        this.$toastr.success('Request has been submited', 'Success');
        self.$router.push({name: 'home'})
        
      }).catch(error=>{
        console.log(error);
        this.$toastr.error('Some error', 'Error');
      });
    },
    setLocation() {
      this.tempMarkers = this.markers;
      this.markers = [];
      this.marker.visible = true;
      this.marker.position.lat = this.currentCenter.lat;
      this.marker.position.lng = this.currentCenter.lng;
      this.marker.draggable = true;
      this.isDisable = false
    }
  },
  mounted() {
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 250);
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
