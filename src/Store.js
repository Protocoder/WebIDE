import Vue from 'vue'
import { EventEmitter } from 'events'
const store = new EventEmitter()
export default store
// import $ from 'jquery'

var TAG = 'store'

/*
 * Global state variables
 */
var state = {
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
 * Method that returns the ProtocoderURL Server, useful when debugging
 */
store.get_url = function (route) {
  // var url = 'http://192.168.100.13:8585'

  var url = 'http://127.0.0.1:8585'

  return url + route
}

/*
 * List all projects
 */
store.project_list_all = function () {
  console.log(TAG + ': project_list_all(query)')
  var query = {
  }

  var folder = 'examples/'

  Vue.http({ url: this.get_url('/api/project/list/' + folder), method: 'GET', data: query }).then(function (response) {
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

  Vue.http({ url: this.get_url('/api/project/load' + uri), method: 'GET', data: query }).then(function (response) {
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

/*
	$.ajax({
    url: this.get_url('/api/project/save' + this.get_current_project()),
    type: 'POST',
    data: JSON.stringify(query),
		success: function(data) {
      console.log(data)
		},
    dataType: 'json'
	});
*/

  Vue.http.post(this.get_url('/api/project/save' + this.get_current_project()), query).then(
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

  Vue.http({ url: this.get_url('/api/project' + action + this.get_current_project()), method: 'GET', data: query }).then(function (response) {
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
