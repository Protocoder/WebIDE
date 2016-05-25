<template>
  <div id="main_container">
    <div id = "left_container" class = "container">
      <logo></logo>
      <sidebar></sidebar>
      <device></device>
    </div>

    <div id = "central_container" class = "container">
      <editor></editor>


      <!--
      <banner v-if="$route.name === 'editor' " transition="banner-anim">qq<a href="https://www.google.es"> google.es </a></banner>
      -->
    </div>

    <div id = "right_container" class = "container">
      <div id = "handle"></div>


      <div id = "panels">
        <router-view
          class="view proto_panel"
          @route-data-loaded = "changeTitle"
          keep-alive
          transition="banner-anim"
          transition-mode="out-in">
        </router-view>

        <div id ="editor_panels">
          <file-manager></file-manager>
          <console></console>
          <dashboard></dashboard>
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

import Editor from './components/Editor'
import Banner from './components/Banner'

import FileManager from './components/FileManager'
import Console from './components/Console'
import Dashboard from './components/Dashboard'

import TutorialLoader from './components/TutorialLoader'

// import ResizeHandle from 'resize-handle'

export default {
  components: {
    Logo,
    Sidebar,
    Device,

    Editor,
    Banner,

    FileManager,
    Console,
    Dashboard,

    TutorialLoader
  },
  data () {
    return {
      // sharedState: Store.state
    }
  },
  methods: {
    changeTitle (vm) {
      console.log(vm)
      document.title = 'Protocoder // ' + vm.title
    }
  },
  created () {
    Store.emit('project_list_all')
  },
  ready () {
    var handle = document.querySelector('#handle')
    var container = document.querySelector('#right_container')

    handle.onmousedown = function (e) {
      var handleX = handle.getBoundingClientRect().left
      var containerW = container.getBoundingClientRect().width

      document.onmousemove = function (e) {
        e.preventDefault()

        // move handle
        var barW = handle.getBoundingClientRect().width
        var position = e.pageX - handleX - barW / 2

        console.log(handleX + ' ' + ' ' + ' ' + e.pageX + ' ' + position)

        // adjust container size
        container.style.width = containerW - position + 'px'
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
      }
    }

    handle.onmouseup = function () {
      console.log('handle mouse up')
      document.onmousemove = null
    }
  },
  destroyed () {
    Store.remove_listener('toggle', this.toggle_section)
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

#main_container {
  display: flex;
  height: 100vh;
  flex-flow: row;
  flex-flow: row nowrap;

  .container {
    padding: 0px 10px;
  }
}

#left_container {
  display: flex;
  flex-flow: column;
  order: 1;
}

#central_container {
  order: 2;
  flex: 2;
}

#right_container {
  position: relative;
  order: 3;
  width: 300px;
  min-width: 200px;
  max-width: 500px;

  /*
  flex: 1;
  min-width: 250px;
  max-width: 550px;
  */
}

#handle {
  position: absolute;
  width: 5px;
  height: 100%;
  left: -3px;
  top: 82px;
  z-index: 2;
}

#handle:hover {
  cursor: col-resize;
  background: rgba(255, 255, 255, 0.2);
}

#handle:active {
  background: rgba(255, 255, 255, 0.5);
}

/********* global thingies **/
button {
	border-radius: 0px;
	cursor: pointer;
  padding: 6px 20px;
  border-radius: 1px;
  border: 0px solid @transparentWhite;
  font-size: 12px;
  font-family: 'Open Sans';
  color: white;
  font-weight: 100;
  text-transform: lowercase;
  background-color: transparent;
  background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.11);

  &:hover {
    background-color: white;
    color: black;
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
  margin-top: 80px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.proto_panel {
  color: black;
  padding: 15px 10px;
  overflow: hidden;
  box-sizing: border-box;
	position: relative;
  width: 100%;
  border-radius: 2px;
  margin-bottom: 12px;
  font-family: 'Open Sans';
  color: white;
  border: 1px solid rgba(0, 0, 0, 0);
  height: 200px;
  .anim-fast;

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
    height: 25px;

	  h1 {
	    text-align: left;
	    color: rgba(255, 255, 255, 0.3);
	    text-transform: lowercase;
	    font-weight: 600;
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

				&:hover {
          color: white;
				}
			}

		}
	}

  .content {
    height: calc(~"100% - 1em");
    overflow-y: auto;
  }
}

/* always present */
.banner-anim-transition {
  transition: all 0.3s ease;
  transform: scale3d(1, 1, 1);
    height: 500px;
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
}

</style>
