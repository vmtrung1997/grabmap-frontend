import Vue from 'vue'
import VueSocketio from 'vue-socket.io';
import App from './App.vue'
import {router} from './router'
import store from './store'
import './registerServiceWorker'
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import { L } from 'vue2-leaflet';
import 'leaflet.icon.glyph';
import 'leaflet/dist/leaflet.css';
import VuejsDialog from "vuejs-dialog"
 
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


// include the default style
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
 
// Tell Vue to install the plugin.
Vue.use(VuejsDialog,{
    html: true, 
    loader: true,
    okText: 'Accept',
    cancelText: 'Decline',
    animation: 'bounce', 
})
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'
 
// Vue.use(VueMaterial)

window.toastr = require('toastr')

Vue.use(VueToastr2)

Vue.config.productionTip = false

Vue.use(VueSocketio, 'http://localhost:3000', store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
