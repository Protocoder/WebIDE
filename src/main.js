import Vue from 'vue'
import { domain, fa_icon } from './filters'
import App from './App'
import './assets/css/font-awesome/css/font-awesome.min.css'
import Router from 'vue-router'
import Resource from 'vue-resource'
import Editor from './components/Editor.vue'
import Login from './components/Login.vue'
import TutorialLoader from './components/TutorialLoader'
import Help from './components/Help'
import Preferences from './components/Preferences'
import $ from 'jquery'
// import Store from './Store'

$(document).ready(function () {
  console.log('jquery ready!')
})

// register filters globally
Vue.filter('domain', domain)
Vue.filter('fa_icon', fa_icon)

// install router
Vue.use(Router)

// ajax stuff
Vue.use(Resource)

// routing
var router = new Router()

router.map({

  '*': {
    component: {
      template: '<div> not found </div>'
    }
  },
  'login': {
    name: 'login',
    component: Login
  },
  '/editor': {
    name: 'editor',
    component: Editor,
    subRoutes: {
      '/': {
        component: {
          template: 'nada de nada {{$route.params | json}}'
        }
      }
    }
  },
  '/tutorial/:id': {
    name: 'tutorial',
    title: 'Tutorial',
    component: TutorialLoader
  },
  'help': {
    name: 'help',
    component: Help
  },
  '/preferences': {
    name: 'preferences',
    component: Preferences
  }

})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '/': '/editor'
})

router.start(App, '#app')
