<template>
  <div id="main_container"  @dragenter.prevent.stop = "handleDragEnter" @dragend = "handleDragLeave">
    <div id = "left_container" class = "container">
      <logo></logo>
      {{dndState}}
      <sidebar></sidebar>
      <device></device>
    </div>

    <div id = "central_container" class = "container">
      <documentation-browser></documentation-browser>
      <!--
      <dashboard></dashboard>
    -->
    <!--  <calender></calender> -->

      <!--
      <audio-player src = "/static/meow.ogg"></audio-player>
      <video-player src = "/static/cityfireflies.m4v"></video-player>
      <video-player src = "https://www.youtube.com/embed/BC2dRkm8ATU"></video-player>
      <video-player src = "http://player.vimeo.com/video/25071870"></video-player>

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

          <!-- <dashboard></dashboard> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Store from './Store'

import Logo from './components/Logo'
import Sidebar from './components/Sidebar'
import Device from './components/Device'
import Handle from './components/Handle'

import Editor from './components/Editor'
import Banner from './components/views/Banner'

import FileManager from './components/FileManager'
import Console from './components/Console'
import Dashboard from './components/Dashboard'

import TutorialLoader from './components/TutorialLoader'

import Gcanvas from './components/visual/Gcanvas'
import Webview from './components/views/Webview'
import P5 from './components/views/P5js'
import VideoPlayer from './components/views/VideoPlayer'
import AudioPlayer from './components/views/AudioPlayer'
import Calender from './components/views/Calender'

import DocumentationBrowser from './components/views/DocumentationBrowser'

// import ResizeHandle from 'resize-handle'

export default {
  components: {
    Logo,
    Sidebar,
    Device,
    Handle,

    Editor,
    Banner,

    FileManager,
    Console,
    Dashboard,

    TutorialLoader,

    Gcanvas,
    Webview,
    P5,
    VideoPlayer,
    AudioPlayer,
    Calender,
    DocumentationBrowser
  },
  data () {
    return {
      dndState: ''
      // sharedState: Store.state
    }
  },
  methods: {
    changeTitle (vm) {
      console.log(vm)
      document.title = 'Protocoder // ' + vm.title
    },
    handleDragEnter: function () {
      this.dndState = 'enter'
    },
    handleDragLeave: function () {
      this.dndState = 'leave'
    }
  },
  created () {
    Store.emit('project_list_all')

    // show popup when trying to exit app
    window.onbeforeunload = function (e) {
      e = e || window.event
      var msg = 'Are you sure you want to exit? Remember to save your project before :)'
      if (e) e.returnValue = msg // For IE and Firefox prior to version 4
      return msg // For Safari
    }
  },
  ready () {

  },
  destroyed () {
  },
  events: {
    'run': function (msg) {
      console.log('event parent run ' + msg)
      return true
    }
  }
}

</script>

<style src="./assets/css/reset.css"></style>

<style lang="less">
@import "assets/css/variables.less";
@import "assets/css/hacks.less";

body {
	font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
  color: @primaryTextColor;
	background: @primaryBackground;
	font-size: @defaultFontSize;
  overflow: hidden;
  background: linear-gradient(0deg, #716938, #415A71)
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
  padding: 0px 8px;
}

#central_container {
  order: 2;
  flex: 2;
  animation: 0.3s ease-out 0.2s 1 normal initAnim;
  animation-fill-mode: backwards;

}

#right_container {
  position: relative;
  order: 3;
  width: 300px;
  min-width: 100px;
  animation: 0.3s ease-out 0.4s 1 normal initAnim;
  animation-fill-mode: backwards;
  padding: 0px 8px;

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
  padding: 6px 20px;
  border-radius: 1px;
  border: 0px solid @transparentWhite;
  font-family: 'Open Sans';
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.8em;
  background-color: transparent;
  background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.15));
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
      background: rgba(122, 255, 0, 0.5);
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
  display: flex;
  flex-flow: row;
  background-color: rgba(255, 255, 255, 0.34);
  color: white;
  padding: 10px 15px;
  border-radius: 1px;
  height: 400px;
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
    border-left: 1px solid rgba(255, 255, 255, 0.27);
	}

}

#panels {
  margin-top: 76px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.proto_panel {
  color: black;
  overflow: hidden;
  box-sizing: border-box;
	position: relative;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 12px;
  font-family: 'Open Sans';
  color: white;
  border: 1px solid rgba(0, 0, 0, 0.28);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
  height: 200px;
  min-height: 30px;

  &:hover {
    border: 1px solid @primaryAccent;

    .actionbar ul {
      opacity: 1;
    }
  }

  &:hover > ul {
  }

	.actionbar {
    display: flex;
    padding: 10px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.8em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    text-transform: uppercase;;
    font-weight: 700;
    font-size: 0.7em;
    box-sizing: border-box;

	  h1 {
	    text-align: left;
	    color: rgba(255, 255, 255, 0.3);
      flex: 1;

			.filename {
				text-decoration: underline;
			}
	  }

		ul {
      opacity: 0;

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
  }
}

/* always present */
.banner-anim-transition {
  transition: all 0.3s ease;
  transform: scale3d(1, 1, 1);
  overflow: hidden;
}

.banner-anim-enter, .banner-anim-leave {
  transform: translate3d(0px, -20px, 0) scale3d(1, 1, 1);
  opacity: 0;
  height: 0px;
}

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
  #left_container {
    display: none;
    flex-flow: row;
  }

  #right_container {
    display: none;
  }

  #myeditor {
    padding: 0px;
  }

  #project-options {
    padding: 16px 5px 16px 5px !important;
  }
}

.disabled {
  opacity: 0.2;
  pointer-events: none;
}

</style>
