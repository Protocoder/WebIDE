<template>
  <div id = "myeditor">
    <div id = "project-options">
      <div id = "project-actions" class ="">
        <div class = "btn-sidebar btn-open" v-on:click = "toggle_left_container">
          <i class = "fa fa-bars"></i>
        </div>

        <button id = "project-run" v-on:click="run" v-bind:class = "{ 'torun' : isConnected, 'shortcut': runShortcut }"> {{ run_button_state }} </button>
        <button id = "project-save" v-on:click="save" v-bind:class = "{ 'shortcut': saveShortcut }"> Save </button>
        <button id = "project-save-as" v-on:click="saveas" v-bind:class = "{ 'shortcut': saveAsShortcut }"> Save As </button>
      </div>
    </div>
  	<div id = "editor_container" class = "main_shadow">
      <div id = "nav_tabs">
        <div id = "project_name" v-on:click = "store.emit('toggle_section', 'load_project')">
          <p class = "folder">{{project.folder}}</p><p class = "name" v-show = "project.name">{{project.name}}</p>
        </div>
        <ul id = "tabs">
          <li v-bind:class="{'active': currentTab == index, 'isModified': t.modified }" v-on:click="select_tab(index)" v-for="(t, index) in tabs">{{t.name}}<i class = "close fa fa-times" v-on:click = "close_tab(index)"></i></li>
        </ul>
        <!-- <div id = "add_tab" class = "fa fa-plus" v-on:click = "add_tab()"></div> -->
      </div>
			<div id = "editor"></div>
      <div class = "msg_error" v-show = "isError"><p>there is a problem opening the file :/<button id = "reload">try again</button></p></div>
		</div>
  </div>
</template>

<script>
import store from '../Store'

export default {
  name: 'Editor',
  components: {

  },
  data () {
    return {
      run_button_state: 'run',
      currentTab: 0,
      tabs: [
        { name: 'main.js', text: '', modified: '' }
      ],
      sessions: [],
      project: '',
      isConnected: false,
      isError: false,
      runShortcut: false,
      saveShortcut: false,
      saveAsShortcut: false,
      d: null,
      store: store
    }
  },
  watch: {
    '$route': 'fetchData'
  },
  mounted () {
    this.$nextTick(function () {
      this.init_editor()
      this.fetchData()
      // console.log('init editor')
    })
  },
  created () {
    store.on('project_loaded', this.load_project)
    store.on('file_loaded', this.load_file)
    store.emit('project_list_all')
    store.on('device', this.device_update)
    store.on('project_created', this.project_created)
    store.on('project_saved', this.project_saved)
  },
  destroyed () {
    // console.log('editor destroyed')
    store.remove_listener('project_loaded', this.load_project)
    store.remove_listener('file_loaded', this.load_file)
    store.remove_listener('device', this.device_update)
    store.remove_listener('project_created', this.project_created)

    this.editor.remove()
  },
  events: {
    'run': function (msg) {
      // console.log('event run ' + msg)
    }
  },
  methods: {
    fetchData: function () {
      var type = this.$route.params.type
      var folder = this.$route.params.folder
      var project = this.$route.params.project
      var url = type + '/' + folder + '/' + project
      store.project_load('/' + url)

      this.title = url

      // console.log(type + ' ' + folder + ' ' + project)
      // this.fetchTutorial(this.$route.params.id)
    },
    init_editor: function () {
      var ace_ = ace
      this.editor = ace_.edit('editor')
      this.Range = ace_.require('ace/range').Range
      ace_.require('ace/lib/event')
      ace_.require('ace/config')
      ace_.require('ace/edit_session')
      ace_.require('ace/undomanager')
      ace_.require('ace/marker')
      ace_.require('ace/range')
      ace_.require('ace/ext/language_tools')

      var renderer = this.editor.renderer

      this.editor.setTheme('ace/theme/monokai')
      this.editor.setOptions({
        fontSize: '12pt',
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false
      })
      // this.editor.setPrintMarginColumn(true)
      this.editor.setShowPrintMargin(false)
      renderer.setPadding(8)

      /*
       * Commands
       */
      var that = this
      // run
      this.editor.commands.addCommand({
        name: 'run_command',
        bindKey: {
          win: 'Ctrl-R',
          mac: 'Command-R',
          sender: 'editor|cli'
        },
        exec: function (env, args, request) {
          that.runShortcut = true
          setTimeout(function () {
            that.runShortcut = false
          }, 200)
          that.run()
        }
      })

      // save
      this.editor.commands.addCommand({
        name: 'save_command',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S',
          sender: 'editor|cli'
        },
        exec: function (env, args, request) {
          that.saveShortcut = true
          setTimeout(function () {
            that.saveShortcut = false
          }, 200)
          // console.log('shortcut save')
          that.save()
        }
      })

      // save
      this.editor.commands.addCommand({
        name: 'liveExecution',
        bindKey: {
          win: 'Ctrl-Shift-X',
          mac: 'Command-Shift-X',
          sender: 'editor'
        },
        exec: function (env, args, request) {
          var range = that.editor.getSelection().getRange()
          var selectedText = that.sessions[that.currentTab].getTextRange(range)

          var liveExec = {}

          // get the code selected or the whole row
          if (selectedText.length > 0) {
            liveExec.text = selectedText
            liveExec.range = range
            // console.log('tiny select')
          } else {
            // console.log('line select')
            var cursorPosition = that.editor.getCursorPosition()
            var numLine = cursorPosition['row']
            liveExec.numLine = numLine
            liveExec.text = that.sessions[that.currentTab].getDocument().$lines[liveExec.numLine]
            liveExec.range = new that.Range(liveExec.numLine, 0, liveExec.numLine, liveExec.text.length)
          }

          // highlight text
          var marker = that.sessions[that.currentTab].addMarker(liveExec.range, 'execute_code_highlight', 'line', true)
          setTimeout(function () {
            that.sessions[that.currentTab].removeMarker(marker)
          }, 500)

          // console.log(liveExec)

          store.execute_code(liveExec.text)
        }
      })
    },
    run: function () {
      // console.log(this.run_button_state + ' project')

      // run the project
      if (this.run_button_state === 'run') {
        // this.run_button_state = 'stop'
        store.emit('project_action', '/run')
      // stop the project
      } else {
        // this.run_button_state = 'run'
        store.emit('project_action', '/stop')
      }
    },
    save: function () {
      // console.log('save project')
      // this.$log()
      store.emit('project_save', this.tabs)
    },
    saveas: function () {
      // console.log('saveas project')
    },
    load_project: function (status) {
      if (status === true) {
        // update object
        var files = store.state.current_project.files
        this.project = store.state.current_project.project
        for (var i in files) {
          if (files[i].name === 'main.js') {
            store.clearArray(this.tabs)
            store.clearArray(this.sessions)
            this.load_file(files[i])
          }
        }
        this.isError = false
      } else { // project couldnt be loaded
        this.isError = false
      }
    },
    createSession: function (f) {
      var session = ace.createEditSession(f.code, 'ace/mode/javascript')

      session.setMode('ace/mode/javascript')
      session.setUseSoftTabs(true)
      session.setTabSize(2)

      return session
    },
    load_file: function (f) {
      // check if opened
      var tabPos = this.file_is_in_tabs(f)
      if (tabPos === -1) {
        // console.log('loading new')
        var session = this.createSession(f)
        session.setValue(f.code)

        f = Object.assign({}, f, { modified: false })
        this.tabs.push(f)
        this.sessions.push(session)

        session.on('change', function (e) {
          // update code
          f.code = session.getValue()
          f.modified = true
          // console.log('modified')
        })

        this.select_tab(this.tabs.length - 1)
      } else {
        // console.log('already exist')
        this.select_tab(tabPos)
      }
      // console.log('load file ' + f.name + ' ' + f.code)
    },
    file_is_in_tabs: function (f) {
      for (var i = 0; i < this.tabs.length; i++) {
        if (f.path === this.tabs[i].path) return i
      }
      return -1
    },
    add_tab: function () {
      this.tabs.push({name: 'qq', text: 'lala'})
    },
    select_tab: function (index) {
      // console.log('qq ' + index)
      this.currentTab = index
      // this.editor.session.setValue(this.tabs[index].code)
      this.editor.setSession(this.sessions[index])
    },
    close_tab: function (index) {
      if (this.currentTab > 0) {
        this.tabs.splice(index, 1)
        this.sessions.splice(index, 1)
        this.select_tab(this.currentTab - 1)
      }
    },
    device_update: function (data) {
      // console.log(data)

      if (typeof data.info !== 'undefined') {
        if (data.info.script['running script'] === 'none') {
          this.run_button_state = 'run'
        } else {
          this.run_button_state = 'stop'
        }
      }
      // console.log('device update ' + data.connected)

      this.isConnected = data.connected
    },
    project_created: function (status, data) {
      if (status) {
        this.$router.push({name: 'editor.load', params: { type: data.type, folder: data.folder, project: data.name }})
      }
    },
    project_saved: function () {
      for (var k in this.tabs) {
        this.tabs[k].modified = false
      }
    },
    toggle_left_container: function () {
      store.emit('toggle_left_container')
    }

    /*
    * Editor functions
    */

  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

#myeditor {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  height: 100%;

  #project-actions {
    display: flex;
  }

  .shortcut {
    background: @primaryAccent;
  }
}

#editor_container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: transform 300ms ease-in-out;
  display: flex;
  flex-direction: column;
  border-bottom: 0px;

  &.slide {
    transform: translateY(420px);
  }

  #editor {
    height:100%;
  }

  #nav_tabs {
    display: flex;
    flex-flow: row nowrap;
    background-color: white;
    border-bottom: 0px;
    border-radius: 1px;
    padding-left: 0;
    margin-bottom: 0;

    #tabs {
      flex: 2;
      list-style: none;
      color: black;

      li {
        position: relative;
        display: inline-block;
        padding: 12px 20px;
        cursor: pointer;
        .anim-fast;
        border-bottom: 4px solid @transparent;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100px;
        white-space: nowrap;
        height: 100%;
        box-sizing: border-box;

        &.active {
           border-bottom: 4px solid @primaryAccent;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);

          .close {
            display: block;
          }
        }

        a {
          margin-left: 15px;
          font-size: 0.8em;
          margin-bottom: 0px;
          border-radius: 2px 2px 0px 0px;
          border: 0px;
        }

        &.isModified {
          border-color: #E91E63;
        }

        .close {
          display: none;
          position: absolute;
          top: 5px;
          right: 2px;
          color: gray;
          font-size: 0.8em;

          &:hover {
            color: black;
          }
        }
      }
    }

    #add_tab {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.5);
      padding: 1.3em;
    }

    #add_tab:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    #add_tab:active {
      background: rgba(0, 0, 0, 0.5);
    }
  }

  #project_name {
    cursor: pointer;
    background: linear-gradient(0deg, #f5d328, rgba(245, 211, 40, 0.5));
    font-size: 0.7em;
    padding: 0px 10px;
    margin-right: 5px;
    color: black;
    min-width: 50px;
    text-align: left;
    display: flex;
    flex-flow: column;
    justify-content: center;

    .folder {
      padding-bottom: 4px;
      font-weight: 500;
    }

    .name::before {
      content: "└";
      padding-right: 2px;
    }

    .name {
      margin-left: 5px;
      font-weight: 700;
    }
  }

  .msg_error {
    position: absolute;
    z-index: 5;
  }
}

#project-options {
  user-select: none;
  padding: 18px 0px 18px 0px;
  /* padding: 26px 0px 26px 0px; */
}

/*
* TODO move it to a theme
*/
.ace_gutter {
  background: transparent !important;
  color: #4A4A4A !important;
}

.ace_editor {
  font-size: 1.1em !important;
  line-height: 1.25em !important;
}

.ace_dark .ace_gutter-cell.ace_info {
    background-image: none;
}

.ace-tm .ace_marker-layer .run_code{
  background-color: rgba(0, 255, 0, 0.38);
  position: absolute;
  width: 100% !important;
  left: 0 !important;
  z-index: 25 !important;
}

.ace_editor.ace_autocomplete {
  border: 0px !important;
  border-radius: 2px 0px 0px 2px;
}

.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {
  background-color: @primaryAccent;
}

.execute_code_highlight {
    background: fade(@primaryAccent, 50%);
    position: absolute;
    width: calc(~"100% - 5px") !important;
    border: 1px solid @primaryAccent;
    left: 0 !important;
}

/* adjust to different sizes */
@media screen and (max-width: 600px) {
  #myeditor {
    padding: 0px;
  }
}

</style>
