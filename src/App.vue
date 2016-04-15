<template>
  <div id="wrapper">

    <div id = "left_panel">
      <logo></logo>
      <sidebar></sidebar>
      <device></device>
    </div>

    <div id = "central_panel">

      <router-view
        class="view"
        @route-data-loaded = "changeTitle"
        keep-alive
        transition="banner-anim"
        transition-mode="out-in">
      </router-view>

      <!--
      <banner v-if="$route.name === 'editor' " transition="banner-anim">qq<a href="https://www.google.es"> google.es </a></banner>
      -->
    </div>

    <div id = "right_panel">
      <div id ="panels">
        <file-manager></file-manager>
        <console></console>
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

import TutorialLoader from './components/TutorialLoader'

export default {
  components: {
    Logo,
    Sidebar,
    Device,

    Editor,
    Banner,

    FileManager,
    Console,

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

html {
  height: 100%;
}

body {
  overflow: hidden;
	font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
  color: @primaryTextColor;
	background: @primaryBackground;
	font-size: @defaultFontSize;
	min-width: 700px;
  overflow: hidden;
  background: linear-gradient(0deg, #716938, #415A71)
}

.main-container {
	opacity: 0;

	&.show {
		transition: opacity 300ms ease-in-out;
		opacity: 1;
	}
}

#left_panel {

}

#central_panel {
  position: absolute;
  left: 170px;
  right: 270px;
  top: 0px;
  bottom: 0px;
}

#right_panel {
  position: absolute;
  width: 270px;
  right: 0px;
  top: 0;
  bottom: 0;
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

.panel {
  background-color: rgba(255, 255, 255, 0.34);
  color: white;
  padding: 10px 15px;
  border-radius: 1px;
  height: 400px;
  z-index: 1;

  .panel-container {
  	width: 100%;
		height: 100%;

   	.left {
   		float: left;
			width: 65%;
   	}

		.right {
			float: right;
	    border-left: 1px solid rgba(255, 255, 255, 0.27);
	    height: 100%;
	    padding-left: 10px;
	    width: 30%;
		}
  }
}


#panels {
  margin-top: 80px;
  width: 100%;
  height: 100%;
  padding: 0px 10px;
  box-sizing: border-box;
}

.proto_panel {
	position: relative;
  width: 100%;
  border-radius: 2px;
  padding: 0px;
  margin-bottom: 12px;
  font-family: 'Open Sans';
  color: white;
  border: 0px solid rgba(0, 0, 0, 0.2);
  .anim-fast;

  &:hover {
      border: 0px solid @primaryAccent;
  }

	.actionbar {
		padding: 12px 0px 12px 0px;

	  h1 {
			padding: 5px 18px;
	    text-align: left;
	    color: #ccc;
	    text-transform: lowercase;
	    font-weight: 600;

			.filename {
				text-decoration: underline;
			}
	  }

		ul {
			position: absolute;
			top: 8px;
			right: 0;

			li {
				display: inline-block;
				background-color: black;
				padding: 8px 10px;
				cursor: pointer;

				&:hover {
					background-color: #555;
				}
			}

		}
	}

}

.floatleft {
	float: left;
}

.floatright {
	float: right;
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

</style>
