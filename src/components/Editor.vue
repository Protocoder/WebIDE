<template>
  <div id = "myeditor">
  <project-load v-show = "show_load_project" transition="banner-anim"></project-load>
  <project-new v-show = "show_new_project" transition="banner-anim"></project-new>

  <div id = "project-options">
    <div id = "project-actions" class ="">
    <button id = "project-run" v-on:click="run" class = ""> {{ run_button_state }} </button>
    <button id = "project-save" v-on:click="save" class = ""> Save </button>
    <button id = "project-save-as" v-on:click="saveas" class = ""> Save As </button>
    </div>
  </div>

  	<div id = "editor_container" class = "main_shadow">
      <ul class = "nav_tabs">
        <li v-bind:class="{'active': currenttab == $index }" v-for="t in tabs">{{t.name}}</li>
      </ul>

			<div id = "editor">{{tabs[currentTab].text}}</div>
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
      show_new_project: false,
      show_load_example: false,
      show_load_project: false,
      run_button_state: 'run',
      currentTab: 0,
      tabs: [
        { name: 'main.js', text: '' },
        { name: 'main2.js', text: '' }
      ]
    }
  },
  route: {
    data () {
      this.title = 'Editor'
    }
  },
  ready () {
    console.log('editor loaded')
    console.log(ace)

    var ace_ = ace
    console.log(ace_)

    this.editor = ace_.edit('editor')

    this.Range = ace_.require('ace/range').Range
    ace_.require('ace/lib/event')
    ace_.require('ace/config')
    ace_.require('ace/edit_session')
    ace_.require('ace/undomanager')
    ace_.require('ace/marker')
    ace_.require('ace/range')

    var renderer = this.editor.renderer
    this.session = this.editor.getSession()

    this.editor.setTheme('ace/theme/monokai')
    this.editor.setOptions({
      fontSize: '12pt',
      enableBasicAutocompletion: true
    })
    // this.session.setWrapLimitRange(null, null)
    // this.editor.setPrintMarginColumn(false)
    // renderer.setShowPrintMargin = null
    renderer.setPadding(8)

    this.session.setMode('ace/mode/javascript')
    this.session.setUseSoftTabs(true)
    this.session.setTabSize(2)

    var that = this
    this.session.on('change', function (e) {
      // update code
      that.tabs[that.currentTab].code = that.session.getValue()
      console.log(that.session.getValue())
      that.$log()
    })
  },
  created () {
    Store.on('project_loaded', this.load_project)
    Store.on('toggle', this.toggle_section)
    Store.emit('project_list_all')
  },
  destroyed () {
    console.log('editor destroyed')
    Store.remove_listener('project_loaded', this.load_project)
    Store.remove_listener('toggle', this.toggle_section)

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
        this.run_button_state = 'stop'
        Store.emit('project_action', '/run')
      // stop the project
      } else {
        this.run_button_state = 'run'
        Store.emit('project_action', '/stop/all')
      }
    },
    save: function () {
      console.log('save project')
      // this.$log()
      Store.emit('project_save')
    },
    saveas: function () {
      console.log('saveas project')
    },
    load_project: function () {
      // update object
      var files = Store.state.current_project.files
      for (var i in files) {
        if (files[i].name === 'main.js') {
          Store.clearArray(this.tabs)
          this.tabs.push(files[i])
          this.editor.session.setValue(files[i].code)
        }
      }
    },
    toggle_section: function (what) {
      switch (what) {
        case 'load_project':
          this.show_load_project = !this.show_load_project
          break
        case 'load_example':
          this.show_load_example = !this.show_load_example
          break
        case 'new_project':
          this.show_new_project = !this.show_new_project
          break

        default:

      }
      return true
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
  height: 100%;
  padding: 0px 10px;
}

#editor_container {
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: transform 300ms ease-in-out;

  &.slide {
    transform: translateY(420px);
  }

  #editor {
    height:100%;
  }

  ul.nav_tabs {
    background-color: white;
    border-bottom: 0px;
    border-radius: 1px;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    color: black;

    li {
      display: inline-block;
      padding: 15px 20px;
      cursor: pointer;
      .anim-fast;

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
}

#project-options {
  user-select: none;
  padding: 25px 0px 25px 0px;
}

/*
* TODO move it to a theme
*/
.ace_gutter {
  background: transparent !important;
  color: #4A4A4A !important;
}

.ace_editor {
  font-size: 1.5em !important;
  line-height: 1.35em !important;
}

.ace_dark .ace_gutter-cell.ace_info {
    background-image: none;
}


</style>
