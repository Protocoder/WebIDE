import Vue from 'vue'
import { EventEmitter } from 'events'
const store = new EventEmitter()
export default store

var TAG = 'store'
var DEBUG = true

// constants
var WEBAPP_PORT = 8585
var WS_PORT = 8587

/*
 * Global state variables
 */
var state = {
  DEBUG,
  projects: [],
  examples: [],
  current_project: { },
  preferences: {}
}

var vm = new Vue({
  data: {
    state: state
  }
})

store.state = state
store.vm = vm

/*
 * List all projects
 */
store.project_list_all = function () {
  console.log(TAG + ': project_list_all(query)')
  var query = { }

  var folder = 'examples/'

  Vue.http({ url: get_url_webapp('/api/project/list/' + folder), method: 'GET', data: query }).then(function (response) {
    console.log(TAG + ': project_list_all(status) > ' + response.status)
    // copyArray(response.data, store.examples)

    store.state.projects = response.data
    vm.$log()
  }, function (response) {
    console.log(TAG + ': project_list_all(status) > ' + response.status)
  })
}

/*
 * Load a project
 */
store.project_load = function (uri) {
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project/load' + uri), method: 'GET', data: query }).then(function (response) {
    console.log(TAG + ': project_load(status) > ' + response.status)
    store.state.current_project = response.data
    store.emit('project_loaded')
  }, function (response) {
    console.log(TAG + ': project_load(status) > ' + response.status)
  })
}

/*
 * Save a project
 */
store.project_save = function () {
  console.log('project saving')
  var query = this.state.current_project

  // vm.$log()

  Vue.http.post(get_url_webapp('/api/project/save' + this.get_current_project()), query).then(
  function (response) {
    console.log(TAG + ': project_save(status) > ' + response.status)

    // store.emit('project_saved')
  }, function (response) {
    console.log(TAG + ': project_save(status) > ' + response.status)
  })
}

/*
 * Run a project
 */
store.project_action = function (action) {
  // store.current.project
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project' + action + this.get_current_project()), method: 'GET', data: query }).then(function (response) {
    console.log(response.status)
  }, function (response) {
    console.log(response.status)
  })
}

/*
* Event Listeners
*/
store.on('project_list_all', store.project_list_all)
store.on('project_action', store.project_action)
store.on('project_load', store.project_load)
store.on('project_save', store.project_save)

/*
 * Helper functions
 */
store.get_current_project = function () {
  return '/' + store.state.current_project.project.folder + '/' + store.state.current_project.project.name
}

store.clearArray = function (dst) {
  while (dst.length) dst.pop()
}

store.copyArray = function (or, dst) {
  this.clearArray(dst)
  for (var i in or) {
    dst.push(or[i])
  }
}

/*
 * Method that returns the ProtocoderURL Server, useful when debugging
 */
var get_url = function (route) {
  // var url = 'http://192.168.100.13:8585'
  if (DEBUG) {
    return '192.168.1.98'
  } else {
    return window.location.hostname
  }
}

var get_url_webapp = function (route) {
  return 'http://' + get_url() + ':' + WEBAPP_PORT + route
}

var get_url_ws = function () {
  return 'ws://' + get_url() + ':' + WS_PORT
}

/*
* Websockets for rapid communication
*/
var reconnection_interval

store.websockets_init = function () {
  var that = this

  var url = get_url_ws()
  console.log('trying to connect to ' + url)

  var ws = new WebSocket(get_url_ws())
  console.log(ws)

  ws.onopen = function () {
    console.log('ws connected')
    clearInterval(reconnection_interval) // _s the reconnection
    // this.protoEvent.send('ui_appConnected', true)
  }

  ws.onmessage = function (e) {
    console.log('ws message', e.data)

    var data = JSON.parse(e.data)
    if (data.action === 'console') {
      store.emit('console', data)
    } else if (data.action === 'device') {
      store.emit('device', data)
    }
  }

  ws.onclose = function () {
    console.log('ws disconnected')
    // this.protoEvent.send('ui_appConnected', false)

    // try to reconnect
    reconnection_interval = setTimeout(function () {
      console.log('trying to reconnect')
      that.websockets_init()
    }, 1000)
  }
}

store.websockets_init()
