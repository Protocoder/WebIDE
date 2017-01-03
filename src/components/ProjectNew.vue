<template>
  <div class = "editor_panel main_shadow" id="editor_panel_new">
    <div class = "btn-sidebar btn-close" v-on:click = "close">
      <i class = "fa fa-close"></i>
    </div>

    <div class = "left">
      <div class = "form">
        <!-- info input -->
        <!--
        <label for="choosefolder">choose a folder</label>
        <select id="choosefolder" name="choosefolder" class="form-control">
          <option value="1">Option one</option>
          <option value="2">Option two</option>
        </select>
        -->

        <label for="projectname">New Project</label>
        <input id="projectname" name="projectname" type="text" placeholder="MyProject" class="form-control input-md" v-model = "projectName" required="">

        <div class = "submit">
          <button id="create" name="create" class="btn btn-success" v-on:click = "create_project()">Create</button>
          <button id="close" name="close" class="btn btn-default" v-on:click = "close()">Cancel</button>
          <message-error v-show = "!status">The project cannot be created</message-error>
        </div>
      </div>
    </div>

    <!--
    <div class="right">
      <p>Create a new project</p>
      <p>{{status}}</p>
    </div>
    -->
  </div>

</template>

<script>
import Store from '../Store'
import MessageError from './views/MessageError'

export default {
  name: 'ProjectNew',
  components: {
    MessageError
  },
  data () {
    return {
      projectName: '',
      status: true
    }
  },
  methods: {
    create_project: function () {
      Store.project_create(this.projectName)
    },
    project_created (status) {
      this.status = status
      console.log('created ' + status)
    },
    close () {
      Store.emit('toggle', 'new_project')
      this.status = true
    }
  },
  created () {
    Store.on('project_created', this.project_created)
  },
  destroyed () {
    Store.remove_listener('project_created', this.project_created)
  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#editor_panel_new {

  .left {
    flex: 1;
  }

  label {
    font-size: 1em;
    line-height: 2em;
  }

  select, input {
    padding: 12px 10px;
    margin: 8px 0px 28px 0px;
    width: 100%;
    border-radius: 2px;
    background-color: @mainColor;
    border: none;
    width: 100%;
    outline: none;
    box-sizing: border-box;
    color: @primaryTextColor;
  }

  .login_bottom {
    text-align: center;
  }

  .submit {
    display: flex;
    align-items: center;
  }

}

</style>
