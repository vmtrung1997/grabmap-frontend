<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="col-md-9">
        <l-map
        :zoom-control="false"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 500px;width: 900px"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate">
        <l-tile-layer
          :url="url"
          :attribution="attribution"/>
        <l-marker v-for="(marker, index) in markers" :key="index" :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"
          :icon = "marker.icon">
          <l-popup>
            <div @click="popupClick">
              Client
            </div>
          </l-popup>
        </l-marker>
        <l-marker :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"/>
        <l-polyline
          :lat-lngs="polyline.latlngs"
          :color="polyline.color"/>
        </l-map>
        </div>
        <div class="col-md-3">
          <div class = "driver-info">
            <span id="label-driver">
              DRIVER INFORMATION 
            </span>
            <table class="table table-bordered table-hover">
              <tbody>
                 <tr>
                  <th scope="row">User Name</th>
                  <td>{{driver.username}}</td>
                </tr>
                <tr>
                  <th scope="row">State</th>
                  <td>{{driver.state}}</td>  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LLayerGroup, LPolyline, LPolygon} from "vue2-leaflet";

import { L } from "vue2-leaflet";

export default {
  name: "identifiermap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
    LPolygon 
  },
  data() {
    return {
      zoom: 15,
      center: L.latLng(10.7721, 106.65777),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [
        { 
          id: 'm1',
          position: {lat: 10.7721, lng: 106.65777},
          tooltip: 'tooltip for marker1',
          draggable: true,
          visible: true,
          icon: L.icon.glyph({
            prefix: '',
            glyph: 'A'})
        },
        { 
          id: 'm2', 
          position: {lat: 10.8721, lng: 106.75777},
          tooltip: 'tooltip for marker2', 
          draggable: true,
          visible: true,
          icon: L.icon.glyph({
            prefix: '',
            glyph: 'B'})
      },
      ],
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
      polyline: {
        latlngs: [],
        color: 'green'
      },
      currentZoom: 11.5,
      currentCenter: L.latLng(10.7721, 106.65777),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      request: {},
      driver: {},
      isDisable: true
    };
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
    setLocation() {
      this.tempMarkers = this.markers;
      this.markers = [];
      this.marker.visible = true;
      this.marker.position.lat = this.currentCenter.lat;
      this.marker.position.lng = this.currentCenter.lng;
      this.marker.draggable = true;
      this.isDisable = false
    },
    getDriverInfo(){
      var self = this;
      this.$store.dispatch('getDriverDetail', {idRequest: this.$route.params.id})
      .then(data => {
        self.driver = data.dataDriver; 
        self.request = data.DataRequest;
      })
      .catch(error => console.log(error));
    }, 
  },
  beforeMount(){
      var self = this;
      this.$store.dispatch('getRouteDriverClient', {requestPosition: this.markers[0].position, driverPosition: this.markers[1].position})
      .then(data => {
        var ret = new Array;
        var dataArr  = data.res.paths[0].points.coordinates;
        for(var i of dataArr) {
            ret.push(i.reverse());
        }
        this.polyline.latlngs = ret;
        this.center = this.markers[1].position;
      });
    },
  mounted() {
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }
};
</script>
<style>
.driver-info {
  margin-top: 20%;
}

.btn-located {
  max-height: 200px;
  margin: 0 20px;
}
.group-row {
  display: block;
  margin-bottom: 20px;
  text-align: left;
}

#label-driver {
  font-size: 25px;
  text-decoration-line: left;
  letter-spacing: 3px;
  font-family: "Georgia", Times, serif;
}

table {
  margin-top: 15%;
  width: 100%;
  border-collapse: collapse;
  padding: 10px;
}

th, td {
  padding: 10px;
  font-size: 20px;
  text-decoration: none;
}

.content {
  margin-left: -15px;
  margin-top: 30px;
}

</style>
