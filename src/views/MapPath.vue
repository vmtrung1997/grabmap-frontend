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
        <l-marker v-show="markers.length!=0" v-for="(marker, index) in markers" :key="index" :visible="marker.visible"
          :draggable="marker.draggable"
          :lat-lng.sync="marker.position"
          :icon = "marker.icon">
          <l-popup>
            <div @click="popupClick">
              Client
            </div>
          </l-popup>
        </l-marker>
        <l-polyline
          :lat-lngs="polyline.latlngs"
          :color="polyline.color"/>
        </l-map>
        </div>
        <div class="col-md-3">
          <div class = "info">
            <span id="label-driver">
              DRIVER INFORMATION 
            </span>
            <table class="table table-bordered table-hover table-info">
              <tbody>
                 <tr>
                  <th scope="row">Full name</th>
                  <td>{{driver.fullname}}</td>
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  <td>{{driver.type}}</td>  
                </tr>
                <tr>
                  <th scope="row">Phone</th>
                  <td>{{driver.phone}}</td>  
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
import { LMap, LTileLayer, LMarker, LPopup, LPolyline} from "vue2-leaflet";

import { L } from "vue2-leaflet";

export default {
  name: "identifiermap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline,
  },
  data() {
    return {
      zoom: 15,
      center: L.latLng(10.7721, 106.65777),
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      markers: [],
      
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
    getDriverInfo(){
      return new Promise((resolve, reject) => {
        this.$store.dispatch('getDriverDetail', {idRequest: this.$route.params.id})
        .then(data => {
          resolve(data);
        })
        .catch(error => reject(error));
      });
      
    }, 
  },
  beforeMount(){
      var self = this;
      self.getDriverInfo().then(result => {
        self.markers.push({
          id: 'm1',
          position: {lat: result.request.position.lat, lng: result.request.position.lng},
          tooltip: 'tooltip for marker1',
          draggable: true,
          visible: true,
          icon: L.icon.glyph({
            prefix: '',
            glyph: 'A'})
        });
        self.markers.push({
          id: 'm2',
          position: {lat: result.request.driverPosition.lat, lng: result.request.driverPosition.lng},
          tooltip: 'tooltip for marker2',
          draggable: true,
          visible: true,
          icon: L.icon.glyph({
            prefix: '',
            glyph: 'B'})
        });
        self.$store.dispatch('getRouteDriverClient',
         {requestPosition: result.request.position, driverPosition: result.request.driverPosition})
          .then(data => {
            var ret = new Array;
            var dataArr  = data.res.paths[0].points.coordinates;
            for(var i of dataArr) {
                ret.push(i.reverse());
            }
            self.driver = result.driver;
            self.polyline.latlngs = ret;
          });
      })
      
    },
  mounted() {
    setTimeout(function() {
      window.dispatchEvent(new Event("resize"));
    }, 250);
  }
};
</script>
<style>
.info {
  margin-top: 15%;
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

#label-info {
  font-size: 25px;
  text-decoration-line: left;
  letter-spacing: 3px;
  font-family: "Georgia", Times, serif;
}

.table-info {
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
