import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import Register from './views/Register.vue'
import RequestSubmited from './views/RequestSubmited.vue'
import IdentifierMap from './views/IdentifierMap.vue'
import MapPath from './views/MapPath.vue'
import store from './store'
Vue.use(Router)
export const router = new Router({
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    { path: '/', name:'home', component: Home, meta: { requiresAuth: true} },
    { path: '/login', name: 'login', component: Login,meta: {requiresVisitor: true} },
    { path: '/register', name: 'register', component: Register,meta: {requiresVisitor: true} },
    { path: '/request_submit', name: 'requestSubmit',component:RequestSubmited},
    { path: '/logout', name: 'logout',component:Logout},
    { path: '/locate/:id', name: 'locate', component:IdentifierMap},
    { path: '/view_path/:id', name: 'viewPath', component:MapPath}
  ], 
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters.loggedIn) {
      next({
        name: 'home',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
