import Vue from 'vue'
import { EventEmitter } from 'events'
const store = new EventEmitter()
export default store

// var TAG = 'store'
var DEBUG = false

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
  // console.log(TAG + ': project_list_all(query)')
  var query = { }

  var folder = 'examples/'

  Vue.http({ url: get_url_webapp('/api/project/list/' + folder), method: 'GET', data: query }).then(function (response) {
    // console.log(TAG + ': project_list_all(status) > ' + response.status)
    // copyArray(response.data, store.examples)

    store.state.projects = response.data
    vm.$log()
  }, function (response) {
    // console.log(TAG + ': project_list_all(status) > ' + response.status)
  })
}

/*
 * Load a project
 */
store.project_load = function (uri) {
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project' + uri + '/load'), method: 'GET', data: query }).then(function (response) {
    // console.log(TAG + ': project_load(status) > ' + response.status)
    store.state.current_project = response.data
    store.emit('project_loaded')
    store.emit('project_files')

    // store.list_files_in_path('')
  }, function (response) {
    // console.log(TAG + ': project_load(status) > ' + response.status)
  })
}

store.list_files_in_path = function (p) {
  var query = {} // path: p}
  var splitted = p.split('/')
  var to_path = splitted.slice(3, splitted.lenth).join('/')

  console.log('listing files in path ' + to_path)
  Vue.http({ url: get_url_webapp('/api/project' + this.get_current_project() + '/files/list/' + to_path), method: 'GET', data: query }).then(function (response) {
    console.log('list_files_in_path(status) > ' + response.status)

    store.state.current_project.current_folder = '/' + to_path
    store.state.current_project.files = response.data

    store.emit('project_files')
  }, function (response) {
    console.log('list_files_in_path(status) > ' + response.status)
  })
}

/*
 * Load file
 */
store.load_file = function (file) {
  var query = {}
  Vue.http({ url: this.get_url_for_current_project() + 'files/load/' + file.name, method: 'GET', query }).then(
  function (response) {
    file.code = response.data
    // console.log(TAG + ': project_save(status) > ' + response.status)
    store.emit('file_loaded', file)
  }, function (response) {
    // console.log(TAG + ': project_save(status) > ' + response.status)
  })
}

/*
 * Save a project
 */
store.project_save = function (files) {
  console.log('project saving')
  // var project = this.state

  var query = Object.assign({}, store.state.current_project)

  query.files = files
  console.log(query)

  // vm.$log()

  Vue.http.post(get_url_webapp('/api/project/save' + this.get_current_project()), query).then(
  function (response) {
    // console.log(TAG + ': project_save(status) > ' + response.status)
    // store.emit('project_saved')
  }, function (response) {
    // console.log(TAG + ': project_save(status) > ' + response.status)
  })
}

/*
 * Run a project
 */
store.project_action = function (action) {
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project' + this.get_current_project() + action), method: 'GET', data: query }).then(function (response) {
    // console.log(response.status)
  }, function (response) {
    // console.log(response.status)
  })
}

/*
 * Execute a code line
 */
store.execute_code = function (code) {
  console.log('execute_code ' + code)
  var query = { code: code }

  Vue.http.post(get_url_webapp('/api/project/execute_code'), query).then(function (response) {
    // console.log(response.status)
  }, function (response) {
    // console.log(response.status)
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
  if (DEBUG) {
    // return '192.168.1.57'
    return '127.0.0.1'
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

store.get_url_for_current_project = function () {
  var p = store.state.current_project.project
  return get_url_webapp('/api/project/' + encodeURIComponent(p.folder + '/' + p.name + '/'))
}

/*
* Websockets for rapid communication
*/
var ws
var wsIsConnected = false
var reconnection_interval

store.websockets_init = function () {
  var that = this

  // console.log('trying to connect to ' + get_url_ws())
  ws = new WebSocket(get_url_ws())

  ws.onopen = function () {
    // console.log('ws connected')
    wsIsConnected = true
    clearInterval(reconnection_interval) // _s the reconnection
    // this.protoEvent.send('ui_appConnected', true)
  }

  ws.onmessage = function (e) {
    // console.log('ws message', e.data)
    var data = JSON.parse(e.data)

    // getting console data
    switch (data.module) {
      case 'console':
        console.log(e)
        store.emit('console', data)
        break
      // getting device data
      case 'device':
        store.emit('device', data)
        break
      default:
    }
  }

  ws.onclose = function () {
    // console.log('ws disconnected')
    // this.protoEvent.send('ui_appConnected', false)
    wsIsConnected = false

    // try to reconnect
    reconnection_interval = setTimeout(function () {
      console.log('trying to reconnect')
      that.websockets_init()
    }, 1000)
  }
}

store.send_ws_data = function (data) {
  if (wsIsConnected) ws.send(data)
}

store.websockets_init()
