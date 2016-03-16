<template>
  <!-- Project List Panel -->
  <div class = "panel main_shadow" id="projects-panel">
    <div class="panel-container">
        <div class="left">
          {{id}}
          {{state.id}}
          {{state.length}}
          <div class = "project_list" v-for="p in state.projects">
            <h1> {{p.name}} </h1>
            <ul>
              <li v-for = "f in p.files" v-on:click = "choose_folder($parent.$index, $index, $event)" id = "{{f.name}}"> {{f.name}} </li>
            </ul>
          </div>

        </div>
        <div class="right">
          <p>Double click to open</p>
          <div class = "right-container">
            <div class="img-cover"></div>
            <div class = "actions">
              <div class="action-element"></div>
              <div class="action-element"></div>
              <div class="action-element"></div>
            </div>

            <ul>
              <li v-for = "f in folder_chosen" v-on:click = "load_project(f)"> {{f.name}} </li>
            </ul>

          </div>
        </div>
    </div>
   </div>
</template>

<script>
import Store from '../Store'

export default {
  name: 'ProjectLoad',
  data () {
    return {
      state: Store.state,
      id: Store.state.id,
      folder_chosen: [],
      uri: {
        folder: '',
        fullpath: ''
      }
    }
  },
  methods: {
    new_project: function () {
      console.log('new 1')

      return true
    },
    choose_folder: function (pindex, index, event) {
      // console.log(pindex, index, this.projects[pindex].files[index].name)
      this.uri.folder = '/' + this.state.projects[pindex].name + '/' + this.state.projects[pindex].files[index].name
      this.folder_chosen = this.state.projects[pindex].files[index].files
    },
    load_project: function (folder) {
      this.uri.fullpath = this.uri.folder + '/' + folder.name
      // Store.emit('project_action', '/run', this.uri.fullpath)
      Store.emit('project_load', this.uri.fullpath)
    }
  },
  created () {
    Store.on('new_project', this.new_project)
  },
  destroyed () {
    Store.remove_listener('new_project', this.new_project)
  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#projects-panel {

  .panel-container {
    .left {
      height: 100%;
      overflow-y: scroll;

      ul {
      	list-style: none;
      	margin: 0;
      	padding: 0;

      	li {
      		padding: 5px;
          font-size: 1.5em;

      		&:hover {
      			background-color: rgba(255, 255, 255, 0.69);
      			border-radius: 1px;
      			color: black;
      		}
      	}
      }
    }

    .right {
      .right-container {
      	text-align: center;

  	    .img-cover {
  	        width: 100px;
  		    height: 100px;
  		    background-color: blue;
  	    }

  	    .actions {
  	    	margin-top: 10px;

  	    	.action-element {
  	    		width: 20px;
  				  height: 20px;
  				  background-color: green;
  				  display: inline-block;
  	    	}
  	    }

        li {
          font-size: 1.2em;
          padding: 0.5em;
        }

   		}
    }
  }
}

</style>
