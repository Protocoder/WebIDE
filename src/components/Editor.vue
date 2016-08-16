<template>
  <div id = "myeditor">
  <project-new v-show = "panel_visibility.new_project" transition="banner-anim"></project-new>
  <project-load v-show = "panel_visibility.load_project" transition="banner-anim"></project-load>

  <div id = "project-options">
    <div id = "project-actions" class ="">
      <button id = "project-run" v-on:click="run" v-bind:class = "{ 'torun' : isConnected }"> {{ run_button_state }} </button>
      <button id = "project-save" v-on:click="save" class = ""> Save </button>
      <button id = "project-save-as" v-on:click="saveas" class = ""> Save As </button>
    </div>
  </div>

  	<div id = "editor_container" class = "main_shadow">
      <div id = "nav_tabs">
        <div id = "project_name">
          <p class = "folder">{{project.folder}}</p><p class = "name" v-show = "project.name">{{project.name}}</p>
        </div>
        <ul id = "tabs">
          <li v-bind:class="{'active': currentTab == $index }" v-on:click="select_tab($index)" v-for="t in tabs">{{t.name}}</li>
        </ul>
        <div id = "add_tab" class = "fa fa-plus" v-on:click = "add_tab()"></div>
      </div>
			<div id = "editor"></div>
      <div id = "msg" v-show = "isError"><p>there is a problem opening the file :/<button id = "reload">try again</button></p></div>
		</div>
  </div>
</template>

<script>
import Store from '../Store'

import ProjectLoad from './ProjectLoad'
import ProjectNew from './ProjectNew'

export default {
  name: 'Editor',
  components: {
    ProjectLoad,
    ProjectNew
  },
  data () {
    return {
      panel_visibility: {
        new_project: false,
        load_project: false,
        load_example: false,
        load_demo: false
      },
      run_button_state: 'run',
      currentTab: 0,
      tabs: [
        { name: 'main.js', text: '' }
      ],
      project: '',
      isConnected: false,
      isError: false
    }
  },
  route: {
    data () {
      console.log(this.$route.params)
      var type = this.$route.params.type
      var folder = this.$route.params.folder
      var project = this.$route.params.project
      var url = type + '/' + folder + '/' + project
      Store.project_load('/' + url)

      this.title = url

      console.log(type + ' ' + folder + ' ' + project)

      // this.fetchTutorial(this.$route.params.id)
    }
  },
  ready () {
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
    this.session = this.editor.getSession()

    this.editor.setTheme('ace/theme/monokai')
    this.editor.setOptions({
      fontSize: '12pt',
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: false
    })
    // this.editor.setPrintMarginColumn(true)
    this.editor.setShowPrintMargin(false)
    renderer.setPadding(8)

    this.session.setMode('ace/mode/javascript')
    this.session.setUseSoftTabs(true)
    this.session.setTabSize(2)

    var that = this
    this.session.on('change', function (e) {
      // update code
      that.tabs[that.currentTab].code = that.session.getValue()
      // console.log(that.session.getValue())
      // that.$log()
    })

    /*
     * Commands
     */

    // run
    this.editor.commands.addCommand({
      name: 'run_command',
      bindKey: {
        win: 'Ctrl-R',
        mac: 'Command-R',
        sender: 'editor|cli'
      },
      exec: function (env, args, request) {
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
        console.log('shortcut save')
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
        var selectedText = that.session.getTextRange(range)

        var liveExec = {}

        // get the code selected or the whole row
        if (selectedText.length > 0) {
          liveExec.text = selectedText
          liveExec.range = range
          console.log('tiny select')
        } else {
          console.log('line select')
          var cursorPosition = that.editor.getCursorPosition()
          var numLine = cursorPosition['row']
          liveExec.numLine = numLine
          liveExec.text = that.session.getDocument().$lines[liveExec.numLine]
          liveExec.range = new that.Range(liveExec.numLine, 0, liveExec.numLine, liveExec.text.length)
        }

        // highlight text
        var marker = that.session.addMarker(liveExec.range, 'execute_code_highlight', 'line', true)
        setTimeout(function () {
          that.session.removeMarker(marker)
        }, 500)

        console.log(liveExec)

        Store.execute_code(liveExec.text)
      }
    })
  },
  created () {
    Store.on('project_loaded', this.load_project)
    Store.on('file_loaded', this.load_file)
    Store.on('toggle', this.toggle_section)
    Store.emit('project_list_all')
    Store.on('device', this.device_update)
    Store.on('project_created', this.project_created)
  },
  destroyed () {
    console.log('editor destroyed')
    Store.remove_listener('project_loaded', this.load_project)
    Store.remove_listener('file_loaded', this.load_file)
    Store.remove_listener('toggle', this.toggle_section)
    Store.remove_listener('device', this.device_update)
    Store.remove_listener('project_created', this.project_created)

    this.editor.remove()
  },
  events: {
    'run': function (msg) {
      console.log('event run ' + msg)
    }
  },
  methods: {
    run: function () {
      console.log(this.run_button_state + ' project')

      // run the project
      if (this.run_button_state === 'run') {
        // this.run_button_state = 'stop'
        Store.emit('project_action', '/run')
      // stop the project
      } else {
        // this.run_button_state = 'run'
        Store.emit('project_action', '/stop')
      }
    },
    save: function () {
      console.log('save project')
      // this.$log()
      Store.emit('project_save', this.tabs)
    },
    saveas: function () {
      console.log('saveas project')
    },
    load_project: function (status) {
      if (status === true) {
        // update object
        var files = Store.state.current_project.files
        this.project = Store.state.current_project.project
        for (var i in files) {
          if (files[i].name === 'main.js') {
            Store.clearArray(this.tabs)
            var f = files[i]
            f.session = ace.createEditSession(f.code, 'ace/mode/javascript')
            this.tabs.push(f)
            this.editor.session.setValue(files[i].code)
          }
        }
      } else { // project couldnt be loaded
        this.isError = true
      }
    },
    load_file: function (f) {
      // check if opened
      f.session = ace.createEditSession(f.code, 'ace/mode/javascript')
      this.tabs.push(f)

      // console.log('load file ' + f.name + ' ' + f.code)
    },
    toggle_section: function (what) {
      // if toggle the given panel, the rest off
      for (var k in this.panel_visibility) {
        if (k === what) this.panel_visibility[k] = !this.panel_visibility[k]
        else this.panel_visibility[k] = false
      }
    },
    add_tab: function () {
      this.tabs.push({name: 'qq', text: 'lala'})
    },
    select_tab: function (index) {
      this.currentTab = index
      // this.editor.session.setValue(this.tabs[index].code)
      this.editor.setSession(this.tabs[index].session)
    },
    device_update: function (data) {
      if (data['running script'] === 'none') {
        this.run_button_state = 'run'
      } else {
        this.run_button_state = 'stop'
      }

      this.isConnected = data.connected
    },
    project_created (status, data) {
      if (status) {
        this.panel_visibility.new_project = false
        this.$route.router.go({name: 'editor.load', params: { type: data.type, folder: data.folder, project: data.name }})
      }
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
  height: 100vh;
  padding: 0 8px;

  #project-actions button{
    width: 85px;
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

  &.slide {
    transform: translateY(420px);
  }

  #editor {
    height:100%;
  }

  #msg {
    font-size: 1.2em;
    position: absolute;
    z-index: 5;
    text-align: center;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);

    p {
      padding: 10px 22px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 58px;
      color: @primaryAccent;
    }

    #reload {
      border-left: 1px solid rgba(255, 255, 255, 0.5);
      padding-left: 12px;
      margin-left: 12px;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.9em;
      background: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
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
        display: inline-block;
        padding: 12px 20px;
        cursor: pointer;
        .anim-fast;
        border-bottom: 4px solid @transparent;

        &.active {
           border-bottom: 4px solid @primaryAccent;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        a {
          margin-left: 15px;
          font-size: 0.8em;
          margin-bottom: 0px;
          border-radius: 2px 2px 0px 0px;
          border: 0px;
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
    background: #f5d328;
    font-size: 0.7em;
    padding: 0px 10px;
    margin-right: 5px;
    color: #444444;
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
}

#project-options {
  user-select: none;
  padding: 26px 0px 26px 0px;
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
