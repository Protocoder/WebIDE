<template>
  <div>
  <div id ="top_bar">
    <h1>\\P\</h1>
    <p> examples/Device/Vibration </p>
  </div>

  <div id="main_container">
    <div v-show = "backdrop" id = "backdrop" v-on:click = "toggle_left_container"></div>
    <div id = "left_container" class = "container" v-show = "left_container">
      <logo></logo>
      <sidebar></sidebar>
      <device></device>
    </div>

    <div id = "central_container" class = "container">
      <project-checker v-show = "false"></project-checker>

      <transition name = "banneranim">
      <project-new v-show = "panel_visibility.new_project"></project-new>
      </transition>

      <transition name = "banneranim">
      <project-load v-show = "panel_visibility.load_project" transition="banner-anim"></project-load>
      </transition>

      <transition name = "banneranim">
      <documentation-browser v-show = "panel_visibility.load_documentation" transition="banner-anim"></documentation-browser>
      </transition>

      <transition name = "banneranim">
      <tutorial-loader v-show = "panel_visibility.load_tutorials" transition="banner-anim"></tutorial-loader>
      </transition>

      <transition name = "banneranim">
      <preferences v-show = "panel_visibility.load_preferences" transition="banner-anim"></preferences>
      </transition>

      <transition name = "banneranim">
      <about v-show = "panel_visibility.load_about" transition="banner-anim"></about>
      </transition>

      <!--
      <interface-editor v-show = "false"></interface-editor>
      -->

    <!--  <calender></calender> -->

  <!--

      <webview url = "http://127.0.0.1" :showcontrols = "true"></webview>
      <webview url = "http://www.slashdot.com" :showcontrols = "false"></webview>
      -->

      <!-- <p5></p5> -->

      <!--
      <gcanvas></gcanvas>
      -->

      <router-view
        class=""
        @route-data-loaded = "changeTitle"
        keep-alive
        transition="banner-anim"
        transition-mode="out-in">
      </router-view>

      <!-- <editor></editor> -->

      <!--
      <banner v-if="$route.name === 'editor' " transition="banner-anim">qq<a href="https://www.google.es"> google.es </a></banner>
      -->
    </div>

    <div id = "right_container" class = "container">
      <handle orientation = "vertical" container = "right_container"></handle>

      <div id = "panels">

        <div id ="editor_panels">
          <file-manager></file-manager>
          <handle orientation = "horizontal" container = "file_manager"></handle>

          <console></console>
          <handle orientation = "horizontal" container = "console"></handle>

        </div>
      </div>
    </div>

    <debug-panel v-show = "false"></debug-panel>
    <dashboard v-show = "false"></dashboard>
  </div>

  <canvas id="myCanvas" width = "800px" height = "800px"></canvas>
  </div>
</template>

<script>
import Store from './Store'

import DebugPanel from './components/DebugPanel'

import Logo from './components/Logo'
import Sidebar from './components/Sidebar'
import Device from './components/Device'
import Handle from './components/Handle'

import Editor from './components/Editor'
import Banner from './components/views/Banner'

import FileManager from './components/FileManager'
import Console from './components/Console'
import Dashboard from './components/Dashboard'

import ProjectLoad from './components/ProjectLoad'
import ProjectNew from './components/ProjectNew'
import DocumentationBrowser from './components/DocumentationBrowser'
import Preferences from './components/Preferences'
import About from './components/About'
import TutorialLoader from './components/TutorialLoader'

import Gcanvas from './components/visual/Gcanvas'
import Webview from './components/views/Webview'
import P5 from './components/views/P5js'

import Calender from './components/views/Calender'
import InterfaceEditor from './components/InterfaceEditor'

import ProjectChecker from './components/ProjectChecker'

// import ResizeHandle from 'resize-handle'

export default {
  components: {
    DebugPanel,
    Logo,
    Sidebar,
    Device,
    Handle,

    Editor,
    ProjectLoad,
    ProjectNew,
    DocumentationBrowser,
    TutorialLoader,
    Preferences,
    About,
    Banner,

    FileManager,
    Console,
    Dashboard,

    Gcanvas,
    Webview,
    P5,
    Calender,
    ProjectChecker,
    InterfaceEditor

  },
  data () {
    return {
      panel_visibility: {
        new_project: false,
        load_project: false,
        load_example: false,
        load_demo: false,
        load_documentation: false,
        load_tutorials: false,
        load_preferences: false,
        load_about: false
      },
      left_container: false,
      backdrop: false,
      isMobile: false,
      dndState: '',
      myVar: 'hello',
      sharedState: Store.state
    }
  },
  methods: {
    changeTitle (vm) {
      // console.log(vm)
      document.title = 'Protocoder // ' + vm.title
    },
    handleDragEnter: function () {
      this.dndState = 'enter'
    },
    handleDragLeave: function () {
      this.dndState = 'leave'
    },
    toggle_left_container: function () {
      this.backdrop = !this.backdrop
      this.left_container = !this.left_container
    },
    toggle_section: function (what) {
      console.log(what)

      for (var k in this.panel_visibility) {
        if (k === what) {
          console.log(what)
          this.panel_visibility[k] = !this.panel_visibility[k]
        } else this.panel_visibility[k] = false
      }

      if (this.isMobile) {
        this.left_container = false
        this.backdrop = false
      }
    },
    project_created: function (created) {
      if (created) this.panel_visibility.new_project = false
    },
    resize: function () {
      this.isMobile = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/"/g, '') === 'mobile'
      console.log(this.isMobile)
      this.left_container = !this.isMobile
    }
  },
  created () {
    var that = this
    Store.on('toggle', this.toggle_section)
    Store.on('toggle_left_container', this.toggle_left_container)
    // Store.emit('project_list_all')
    Store.on('project_created', this.project_created)

    this.resize()
    window.addEventListener('resize', function () {
      that.resize()
    })

    // show popup when trying to exit app
    window.onbeforeunload = function (e) {
      e = e || window.event
      var msg = 'Are you sure you want to exit? Remember to save your project before :)'
      if (e) e.returnValue = msg // For IE and Firefox prior to version 4
      return msg // For Safari
    }

    Store.state.browser = {
      'editor_width': '300px',
      'files_height': '200px',
      'console_height': '100px'
    }
    Store.save_browser_config()
    Store.state.browser = {}
    Store.load_browser_config()
    console.log(Store.state.browser.editor_width)

    var keyShortcuts = [
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyL', execute: ['toggle', 'load_project'] },
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyR', execute: ['project_run', ''] },
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyS', execute: ['project_editor_save', ''] },
      //
      //
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyD', execute: ['toggle', 'load_documentation'] },
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyH', execute: 'qq21' },
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyF', execute: 'qq21' },
      { ctrl: true, shift: false, alt: false, meta: false, key: 'KeyI', execute: ['toggle_device_info', ''] }

    ]
    // load            ctrl + shift + l
    // run / stop      ctrl + r // cmd + r
    // save            ctrl + s // cmd + s
    // save as
    // execute code    ctrl + shift + x // cmd + shift + x
    // documentation   ctrl + d // cmd + d
    // dashboard       ctrl + d // cmd + d
    // fullscreen editor ctrl + f // cmd + f
    window.addEventListener('keydown', function (e) {
      console.log('key pressed', e)

      for (var i in keyShortcuts) {
        if (keyShortcuts[i].ctrl === e.ctrlKey &&
            keyShortcuts[i].shift === e.shiftKey &&
            keyShortcuts[i].alt === e.altKey &&
            keyShortcuts[i].meta === e.metaKey &&
            keyShortcuts[i].key === e.code) {
          Store.emit(keyShortcuts[i].execute[0], keyShortcuts[i].execute[1])
          console.log('keyshortcut is pressed ' + keyShortcuts[i].execute)
          e.preventDefault()
          e.stopPropagation()
          window.event.cancelBubble = true
        }
      }
    })
  },
  mounted () {
    var canvas = document.getElementById('myCanvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    var c = canvas.getContext('2d')
    c.scale(1, 1)

    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--

      return -c / 2 * (t * (t - 2) - 1) + b
    }

    /*
     * Script
     */
    var w = canvas.width
    var h = canvas.height
    var dots = []
    var NUM_DOTS = 45

    // update
    for (var i = 0; i < NUM_DOTS; i++) {
      dots.push({ 'cx': 0, 'x': w * Math.random(), 'y': h * Math.random(), 'r': 80 * Math.random(), 'o': 0 })
    }

    function draw (t) {
      c.clearRect(0, 0, w, h)

      c.lineWidth = 1 // 2 * Math.random()
      c.fillStyle = 'rgba(255, 87, 34, 1)' // + Math.random() + ')'
      c.strokeStyle = 'rgba(0, 0, 0, 0.8)'

      // draw
      for (var i = 0; i < NUM_DOTS; i++) {
        var d = dots[i]
        c.beginPath()
        // var mx = Math.easeInOutQuad(t, d.cx, d.cx - d.x, 2000)
        // if (i === 0) console.log(d.cx, d.x, mx)
        // console.log(d.cx)
        c.arc(d.x, d.y, d.r, 0, 2 * Math.PI)
        // ctx.stroke()
        c.fill()
      }

      // window.requestAnimationFrame(draw)
    }

    console.log(draw)
    // window.requestAnimationFrame(draw)
  },
  destroyed () {
    Store.remove_listener('toggle', this.toggle_section)
    Store.remove_listener('project_created', this.project_created)
  },
  events: {
    'run': function (msg) {
      // console.log('event parent run ' + msg)
      return true
    }
  }
}

</script>

<style src="./assets/css/reset.css"></style>

<style lang="less">
@import "assets/css/variables.less";
@import "assets/css/hacks.less";

#myCanvas {
  position: absolute;
  top: 0;
  z-index: -1
}

body {
  /* background: linear-gradient(180deg, @backgroundColor, @backgroundColor_second); */
  background: @backgroundColor;
  font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
  color: @primaryTextColor;
  font-size: @defaultFontSize;
  overflow: hidden;
}

/* hack to export the media queries to javascript
https://www.lullabot.com/articles/importing-css-breakpoints-into-javascript
*/
body:before {
  content: "desktop";
  display: none;
}

@keyframes initAnim {
    0% {
        transform: translateY(-40px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

#top_bar {
  color: black;
  font-size: 1em;
  width: 100%;
  background: rgb(245, 211, 40);
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.29);
  display: none;

  & > * {
    padding: 10px;
  }

  h1 {
    font-size: 1.5em;
  }

  p {
    background: rgba(0, 0, 0, 0.2);
    color: white;
    padding: 5px 20px;
    font-size: 1em;
    border-radius: 125px;
    margin: 10px;
    font-weight: 600;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}

#backdrop {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  position: absolute;
  z-index: 3;
}

.btn-sidebar {
  display: none;
  font-size: 2em;
  color: @mainColor;
  cursor: pointer;
  z-index: 3;

  &:hover {
    color: darken(@accentColor, 10%);
  }

  &:active {
    color: darken(@accentColor, 30%);
  }
}

.btn-open {
  margin-left: 5px;
  margin-right: 12px;
}

.btn-close {
  padding: 10px;
  position: absolute;
  right: 0;
}

#main_container {
  display: flex;
  height: 100vh;
  flex-flow: row;
  flex-flow: row nowrap;

  .container {
  }
}

#left_container {
  display: flex;
  flex-flow: column;
  order: 1;
  animation: 0.3s ease-out 0s 1 normal initAnim;
  animation-fill-mode: backwards;
  padding: 0px 5px;
  min-width: 105px;
}

#central_container {
  order: 2;
  flex: 2;
  animation: 0.3s ease-out 0.2s 1 normal initAnim;
  animation-fill-mode: backwards;
  padding: 0 4px;
}

#right_container {
  position: relative;
  order: 3;
  width: 300px;
  min-width: 100px;
  animation: 0.3s ease-out 0.4s 1 normal initAnim;
  animation-fill-mode: backwards;
  padding: 0px 8px;
  min-width: 135px;

  /*
  flex: 1;
  min-width: 250px;
  max-width: 550px;
  */
}

/********* global thingies **/
button {
  position: relative;
	border-radius: 0px;
	cursor: pointer;
  padding: 6px 5px;
  width: 70px;
  margin-right: 3px;
  border-radius: 1px;
  border: 0px;
  font-family: 'Open Sans';
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.8em;
  background-color: lighten(@backgroundColor, 10%);
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.11);

  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: transparent;
  }

  &:hover {
    background-color: white;
    color: black;
  }

  &:active {
    background: rgb(200, 200, 200)
  }

  &.torun {
    &:before {
      background: rgba(0, 238, 255, 0.8);
    }
  }

  &.tostop {

  }
}

.btn-primary {
  color: #fff;
  background-color: #474747;
  border: 0px;
}

.editor_panel {
  position: relative;
  display: flex;
  flex-flow: row;
  background: white;
  color: @mainColor;
  padding: 10px 15px;
  border-radius: 1px;
  max-height: 80%;
  z-index: 1;

 	.left, .right {
    overflow-y: auto;
    padding: 5px;
    box-sizing: border-box;
 	}

  .left {
    flex: 0.60;
  }

	.right {
    flex: 0.40;
    border-left: 1px solid @mainColor;
	}

}

#panels {
  margin-top: 61px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  #editor_panels {
    position: relative;
    height: 100%;

    .proto_panel {
      background: @mainColor;
      max-height: 70%;
      color: black;
      box-sizing: border-box;
    	position: relative;
      width: 100%;
      border-radius: 2px;
      margin-bottom: 12px;
      font-family: 'Open Sans';
      color: white;
      border: 0px solid rgba(0, 0, 0, 0);
      border-radius: 2px;
      height: 200px;
      min-height: 30px;
      overflow: hidden;

      .wrapper {
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      &:hover {
        border: 0px solid @accentColor;

        .actionbar ul {
          box-sizing: border-box;
        }
      }

      &:hover > ul {
      }

    	.actionbar {
        display: flex;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.8em;
        border-bottom: 0px solid rgba(255, 255, 255, 0.1);
        width: 100%;
        min-height: 25px;
        max-height: 25px;
        text-transform: uppercase;;
        font-weight: 700;
        font-size: 0.7em;
        box-sizing: border-box;

        & > * {
          padding: 8px;
          box-sizing: border-box;
        }

    	  h1 {
    	    text-align: left;
    	    color: rgba(255, 255, 255, 0.3);
          flex: 1;

    			.filename {
    				text-decoration: underline;
    			}
    	  }

    		ul {
          display: block;;

    			li {
    				display: inline-block;
    				padding: 0px 5px;
    				cursor: pointer;
            color: rgba(255, 255, 255, 0.5);

    				&:hover, &.enabled {
              color: white;
    				}

    			}

    		}
    	}

      .content {
        height: calc(~"100% - 1em");
        padding: 10px;
        overflow-y: auto;
      }
    }
  }
}



/* always present */
.banneranim-enter, .banneranim-leave-active {
  opacity: 0;
  transform: translate3d(0px, -20px, 0) scale3d(1, 1, 1);
}

.banneranim-enter-active, .banneranim-leave-active {
  transition: all 0.3s ease;
}



/*
.banneranim-active, .banneranim-leave-active {
  transition: all 0.3s ease;
  transform: translate3d(0px, 20px, 0) scale3d(1, 1, 1);
  overflow: hidden;
}

.banneranim-enter, .banneranim-leave-active {
  transform: translate3d(0px, -20px, 0) scale3d(1, 1, 1);
  opacity: 0;
  height: 0px;
}
*/

.banner-anim2-transition {
  transition: all 0.3s ease;
  transform: scale3d(1, 1, 1);
  overflow: hidden;
}

.banner-anim2-enter, .banner-anim2-leave {
  transform: translate3d(0px, -20px, 0) scale3d(1, 1, 1);
  opacity: 0;
}


/* adjust to different sizes */
@media screen and (max-width: 600px) {

  body:before {
    content: "mobile";
  }

  #sidebar ul li {
    font-size: 1em !important;
  }

  .btn-sidebar {
    display: inline;
  }

  #central_container {
    padding: 0;
  }

  #left_container {
    display: flex;
    flex-flow: column;
    order: 1;
    animation: .3s ease-out 0s 1 normal initAnim;
    animation-fill-mode: backwards;
    padding: 0 5px;
    position: absolute;
    z-index: 100;
    height: 100%;
    left: 0px;
    background: @backgroundColor;

    &:on {
      left: 0px;
    }
  }

  #right_container {
    display: none;
  }

  #myeditor {
    padding: 0px;
  }

  #project-options {
    padding: 16px 5px 16px 5px !important;

    #project-actions {
    }
  }

  .editor_panel {
    max-height: 100%;
    height: 100%;
  }
}

.disabled {
  opacity: 0.2;
  pointer-events: none;
}

</style>
