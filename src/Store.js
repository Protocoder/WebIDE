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
  preferences: {},
  browser: {}
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
    // console.log(response.data)
    store.state.projects = response.data
    console.log(response.data)

    // order folder
    /*
    for (var i in store.state.projects) {
      store.state.projects[i].files.sort(function (a, b) {
        return (a.name.toString().localeCompare(b.name))
      })

      // order projects
      for (var j in store.state.projects[i].files) {
        store.state.projects[i].files[j].files.sort(function (a, b) {
          return (a.name.toString().localeCompare(b.name))
        })
      }
      console.log('project_listed 1')
    }
    */
    store.emit('project_listed_all')
  }, function (response) {
    // console.log(TAG + ': project_list_all(status) > ' + response.status)
  })
}

/*
 * Load a project
 */
store.project_load = function (uri) {
  var query = { }

  // console.log(uri)

  Vue.http({ url: get_url_webapp('/api/project' + uri + '/load'), method: 'GET', data: query }).then(function (response) {
    // console.log(TAG + ': project_load(status) > ' + response.status)
    store.state.current_project = response.data
    store.emit('project_loaded', true)
    store.emit('project_files')
    store.load_project_preferences()
    // store.list_files_in_path('')
  }, function (response) {
    store.emit('project_loaded', false)
    // console.log(TAG + ': project_load(status) > ' + response.status)
  })
}

store.load_project_preferences = function () {
  var query = {}
  Vue.http({ url: this.get_url_for_current_project() + 'files/load/app.conf', method: 'GET', query }).then(function (response) {
    if (response.data.files[0].code) {
      console.log(response)
      var conf = JSON.parse(response.data.files[0].code)
      store.state.current_project.conf = conf
    }
  }, function (response) {
    // console.log(TAG + ': project_save(status) > ' + response.status)
  })
}

store.list_files_in_path = function (p) {
  var query = {} // path: p}
  var splitted = p.split('/')
  var to_path = splitted.slice(3, splitted.lenth).join('/')

  // console.log('listing files in path ' + to_path)
  Vue.http({ url: get_url_webapp('/api/project' + this.get_current_project() + '/files/list/' + to_path), method: 'GET', data: query }).then(function (response) {
    // console.log('list_files_in_path(status) > ' + response.status)

    store.state.current_project.current_folder = '/' + to_path
    store.state.current_project.files = response.data

    store.emit('project_files')
  }, function (response) {
    // console.log('list_files_in_path(status) > ' + response.status)
  })
}

/*
 * Load file
 */
store.load_file = function (file) {
  var query = {}
  Vue.http({ url: this.get_url_for_current_project() + 'files/load/' + file.name, method: 'GET', query }).then(
  function (response) {
    // console.log(response)
    file.code = response.data.files[0].code

    // console.log('load_file(status) > ' + response.status, file.code)
    store.emit('file_loaded', file)
  }, function (response) {
    // console.log(TAG + ': project_save(status) > ' + response.status)
  })
}

/*
 * Create a file
 */
store.create_file = function (filetype, filename) {
  // console.log('create file ' + filetype + ' ' + filename)
  var query = {}
  query.files = [{ name: filename, path: store.state.current_project.current_folder, type: filetype }]

  Vue.http.post(get_url_webapp('/api/project' + this.get_current_project() + '/files/create'), query).then(function (response) {
    // console.log('create_file(status) OK > ' + response.status)
    store.emit('file_created')
    store.list_files_in_path(store.state.current_project.current_folder)
  }, function (response) {
    // console.log('create_file(status) NOP > ' + response.status)
  })
}

/*
 * Create a project
 */
store.project_create = function (projectName) {
  // console.log('project create')

  var query = { }

  // vm.$log()

  Vue.http({ url: get_url_webapp('/api/project' + this.get_userproject_url(projectName) + '/create'), method: 'GET', data: query }).then(function (response) {
    var data = {'type': store.userproject.type, 'folder': store.userproject.folder, 'name': projectName}
    store.emit('project_created', true, data)
    store.project_list_all()
  }, function (response) {
    store.emit('project_created', false)
    console.log('project_create(status) > ' + response.status)
  })
}

/*
 * Save a project
 */
store.project_save = function (files) {
  // console.log('project saving')

  var query = {}
  query.project = Object.assign({}, store.state.current_project.project)
  query.project.files = null
  query.files = []
  query.files = Object.assign([], files)

  Vue.http.post(get_url_webapp('/api/project' + this.get_current_project() + '/save'), query).then(function (response) {
    // console.log('project_save(status) OK > ' + response.status)
    store.emit('project_saved')

    if (store.state.current_project.conf.execute_on_save) {
      // console.log(store.state.current_project.conf.execute_on_save)
      store.execute_code(store.state.current_project.conf.execute_on_save)
    }
  }, function (response) {
    // console.log('project_save(status) NOP > ' + response.status)
  })
}

/*
 * Run a loaded project
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
 * Run a project
 */
store.project_run = function (project) {
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project/' + project.gparent + '/' + project.parent + '/' + project.name + '/run'), method: 'GET', data: query }).then(function (response) {
    // console.log(response.status)
  }, function (response) {
    // console.log(response.status)
  })
}

/*
 * Project stop all and run
 */
store.project_stop_all_and_run = function (project) {
  var query = { }

  Vue.http({ url: get_url_webapp('/api/project/' + project.gparent + '/' + project.parent + '/' + project.name + '/stop_all_and_run'), method: 'GET', data: query }).then(function (response) {
    // console.log(response.status)
  }, function (response) {
    // console.log(response.status)
  })
}

/*
 * Execute a code line
 */
store.execute_code = function (code) {
  // console.log('execute_code ' + code)
  var query = { code: code }

  Vue.http.post(get_url_webapp('/api/project/execute_code'), query).then(function (response) {
    // console.log(response.status)
  }, function (response) {
    // console.log(response.status)
  })
}

store.upload_file = function (file) {
  var formData = new FormData()
  // formData.append('_token', this.token) // just the csrf token
  // console.log(file)
  formData.append('name', file.data.name)
  formData.append('type', file.data.type)
  formData.append('file', file.data)

  Vue.http({
    url: get_url_webapp('/api/project' + this.get_current_project() + '/files/upload/'),
    method: 'POST',
    data: formData,
    xhr: {
      onprogress: function (e) {
        // console.log(e)
        // console.log('uploading')

        if (e.lengthComputable) {
          // var progress = (e.loaded / e.total) * 100
          // console.log('p1 ' + progress)
        }
      },
      onreadystatechange: function (e) {
        // console.log(e + this.readyState)
        if (this.readyState === 4) {
          // console.log(e)
        }
      }
    }
  }).then(function (response) {
    // console.log('File sent ' + response.data) // this block is never triggered
    // console.log(response)
    store.emit('file_uploaded', response.data)
  }, function (response) {
    // console.log('Error occurred...')
  })
}

/*
 * List views
 */
store.views_list_types = function (action) {
  var query = { }
  Vue.http({ url: get_url_webapp('/api/project/views_list_types'), method: 'GET', data: query }).then(function (response) {
    // console.log(response.status)
    // console.log(response.data)
    store.emit('views_list_types', response.data)
  }, function (response) {
    // console.log(response.status)
  })
}

/*
 * Add views all
 */
store.views_get_all = function (action) {
  var query = { }
  Vue.http({ url: get_url_webapp('/api/project/views_get_all'), method: 'GET', data: query }).then(function (response) {
    // console.log(response.status)
    // console.log(response.data)
    store.emit('views_get_all', response.data)
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

store.userproject = {'type': 'user_projects', 'folder': 'User Projects'}
store.get_userproject_url = function (name) {
  return '/' + store.userproject.type + '/' + store.userproject.folder + '/' + name
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

store.load_documentation = function () {
  var query = { }

  Vue.http({ url: '/static/documentation.json', method: 'GET', data: query }).then(function (response) {
    // console.log(TAG + ': project_load(status) > ' + response.status)
    // console.log('loading documentation')
    // console.log(response.data)
    store.state.documentation = response.data
    store.emit('documentation_loaded')
  }, function (response) {
  })
}

store.save_browser_config = function () {
  localStorage.setItem('browser', JSON.stringify(state.browser))
  console.log(state.browser)
}

store.load_browser_config = function () {
  state.browser = JSON.parse(localStorage.getItem('browser') || '[]')
  console.log(state.browser)
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
    store.emit('device', { connected: true })

    // restart
    store.emit('project_list_all')
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
        data.connected = true
        store.emit('device', data)
        break
      default:
    }
  }

  ws.onclose = function () {
    // console.log('ws disconnected')
    // this.protoEvent.send('ui_appConnected', false)
    wsIsConnected = false
    store.emit('device', { connected: false })

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

store.mouse = function () {
  document.onmousemove = function handleMouseMove (event) {
    event = event || window.event
    // console.log(event.button)
    // console.log(event.pageX, event.pageY)
  }
}

// store.mouse()

store.mydragg = function () {
  return {
    move: function (divid, xpos, ypos) {
      divid.style.left = xpos + 'px'
      divid.style.top = ypos + 'px'
    },
    startMoving: function (divid, container, evt) {
      evt = evt || window.event

      var posX = evt.clientX
      var posY = evt.clientY
      var divTop = divid.style.top
      var divLeft = divid.style.left

      var eWi = parseInt(divid.style.width)
      var eHe = parseInt(divid.style.height)
      var cWi = parseInt(document.getElementById(container).style.width)
      var cHe = parseInt(document.getElementById(container).style.height)

      document.getElementById(container).style.cursor = 'move'
      divTop = divTop.replace('px', '')
      divLeft = divLeft.replace('px', '')
      var diffX = posX - divLeft
      var diffY = posY - divTop

      document.onmousemove = function (evt) {
        evt = evt || window.event
        var posX = evt.clientX
        var posY = evt.clientY
        var aX = posX - diffX
        var aY = posY - diffY

        if (aX < 0) aX = 0
        if (aY < 0) aY = 0
        if (aX + eWi > cWi) aX = cWi - eWi
        if (aY + eHe > cHe) aY = cHe - eHe

        store.mydragg.move(divid, aX, aY)
      }
    },
    stopMoving: function (container) {
      document.getElementById(container).style.cursor = 'default'
      document.onmousemove = function () {}
    }
  }
}
