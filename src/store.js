import Vue from 'vue'
import Vuex from 'vuex'
import { router } from './router'
import axios from 'axios'
Vue.use(Vuex)

axios.defaults.baseURL = 'http://localhost:3000/api'

export default new Vuex.Store({
  state: {
    connected: false,
    error: '',
    message: '',
    profile: {},
    access_token: localStorage.getItem('access_token') || null,
    refresh_token: null,
  },
  getters: {
    loggedIn(state) {
      return state.access_token !== null
    },
    userType(state) {
      return state.profile.type;
    },
    profile(state) {
      return state.profile;
    }
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.connected = true
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false
    },
    SOCKET_USER_GET_SUCCESS(state, data) {
      state.profile = data[0].profile;
      state.token = data[0].token;
      state.type = state.profile.type;
      localStorage.setItem('access_token', state.token);
      router.push({ name: 'home' });
      console.log(data);
    },
    SOCKET_HELLO_WORLD(state, message) {
      state.message = message
    },
    SOCKET_USER_LOGIN_ERROR(state, message) {
      state.error = message.error
    },
    retrieveAccessToken(state, token) {
      state.access_token = token
    },
    destroyAccessToken(state, token) {
      state.access_token = null;
    },
    retrieveRefreshToken(state, token) {
      state.refresh_token = token
    },
    destroyRefreshToken(state, token) {
      state.refresh_token = null;
    },
    destroyToken(state, token) {
      state.access_token = null;
      state.refresh_token = null;
    },
    retrieveProfile(state, data) {
      state.profile = data;
    },
    clearProfile(state, data) {
      state.profile = {};
    }
  },
  actions: {
    socket_userGetSuccess(context, data) {
      console.log('user get success');
    },
    getProfile(context, data) {
      var refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        return new Promise((resolve, reject) => {
          axios.post('/user/getaccess', { refresh_token: refresh_token })
            .then(result => {
              var res = result.data;
              context.commit('retrieveAccessToken', res.access_token);
              context.commit('retrieveRefreshToken', res.refresh_token);
              context.commit('retrieveProfile', res.user);
              resolve(res)
            }).catch(err => {
              reject(err);
            })
        })
      }
    },
    destroyToken(context, data) {
      console.log(context.state.access_token);
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      axios.defaults.headers.common['x-refresh-token'] = context.state.refresh_token
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios.get('/logout')
            .then(data => {
              console.log(data);
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              context.commit('destroyToken')
              resolve(data)
              // console.log(response);
              // context.commit('addTodo', response.data)
            })
            .catch(error => {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token');
              context.commit('destroyToken');

              reject(error)
            })
        })
      }
    },
    retrieveToken(context, credentials) {

      return new Promise((resolve, reject) => {
        axios.post('/user/login', {
          username: credentials.username,
          password: credentials.password,
        })
          .then(response => {
            const token = response.data.access_token;

            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', response.data.refresh_token);

            context.commit('retrieveAccessToken', token);
            context.commit('retrieveProfile', response.data.user);
            context.commit('retrieveRefreshToken', response.data.refresh_token);
            resolve(response)
            // console.log(response);
            // context.commit('addTodo', response.data)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
    register(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/user/register', data)
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })
    },
    submitRequest(context, data) {
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      return new Promise((resolve, reject) => {
        axios.post('/request/create_request', data)
          .then(data => {
            resolve(data);
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      });
    },
    clearProfile(context) {
      context.commit('clearProfile')
    },
    getRequestTable(context, data) {
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      console.log(data);
      return new Promise((resolve, reject) => {
        axios.post('/request/get_requests', data)
          .then(result => {
            resolve(result.data)
          })
          .catch(error => {
            console.log(error);
            reject(error)
          })
      });
    },
    getRequestLocation(context, data) {
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      console.log(data);
      return new Promise((resolve, reject) => {
        axios.post('/request/locate_request', data)
          .then(result => {
            resolve(result.data)
          })
          .catch(error => {
            console.log(error);
            reject(error)
          })
      });
    },
    requestLocated(context, data) {
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      return new Promise((resolve, reject) => {
        axios.post('/request/located_request', data)
          .then(result => {
            resolve(result.data)
          })
          .catch(error => {
            console.log(error);
            reject(error)
          })
      });
    },
    driverLocated(context, data) {
      axios.defaults.headers.common['x-access-token'] = context.state.access_token
      var driverInfo = {
        profile: context.state.profile,
        position: data
      }
      return new Promise((resolve, reject) => {
        axios.post('/driver/driver_located', driverInfo)
          .then(result => {
            resolve(result.data)
          })
          .catch(error => {
            console.log(error);
            reject(error)
          })
      });
    }
  }
})
