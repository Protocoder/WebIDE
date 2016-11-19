import Vue from 'vue'
import store from './Store'
import { domain, fa_icon } from './filters'
import App from './App'
import './assets/css/font-awesome/css/font-awesome.min.css'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import Login from './components/views/Login.vue'
import Editor from './components/Editor.vue'
import TutorialLoader from './components/TutorialLoader'
import DocumentationBrowser from './components/DocumentationBrowser'
import About from './components/About'
import Preferences from './components/Preferences'
import 'vue-click-outside'

// Vue.directive('click-outside', VueClickOutSide)

// import $ from 'jquery'
// import Store from './Store'

// register filters globally
Vue.filter('domain', domain)
Vue.filter('fa_icon', fa_icon)

// install router
Vue.use(VueRouter)

// ajax stuff
Vue.use(Resource)

// routing
var router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: { name: 'editor' }
    },
    /*
    {
      path: '*',
      component: {
        template: '<div> not found </div>'
      }
    },
    */
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      title: 'Protocoder'
    },
    {
      path: '/editor/:type/:folder/:project',
      name: 'editor.load',
      component: Editor,
      /*
      component: function (resolve) {
       require(['./components/Editor.vue'], resolve)
      },
      */
      title: 'Protocoder'
    },
    {
      path: '/documentation',
      name: 'documentation',
      title: 'documentation',
      component: DocumentationBrowser
    },
    {
      path: '/tutorial/:id',
      name: 'tutorial',
      title: 'Tutorial',
      component: TutorialLoader
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences
    }
  ]
})

/*
router.beforeEach(function () {
  window.scrollTo(0, 0)
})
*/

const app = new Vue({
  router,
  ...App
})

export { app, router, store }

app.$mount('app')
// Vue.$mount(App, '#app')
