<template>
  <!-- Project Creation Panel -->
  <div class = "editor_panel main_shadow" id="editor_panel_new">
    <div class = "left">
      <div class = "form">
        <!-- info input -->
        <label for="choosefolder">choose a folder</label>
        <select id="choosefolder" name="choosefolder" class="form-control">
          <option value="1">Option one</option>
          <option value="2">Option two</option>
        </select>

        <label for="projectname">project name</label>
        <input id="projectname" name="projectname" type="text" placeholder="Write here the project name" class="form-control input-md" v-model = "projectName" required="">

        <div class = "">
          <label for="create"></label>
          <button id="create" name="create" class="btn btn-success" v-on:click = "create_project()">Create</button>
          <button id="cancel" name="cancel" class="btn btn-default">Cancel</button>
        </div>
      </div>
    </div>

    <div class="right">
      <p>Create a new project</p>
      <p>{{status}}</p>
    </div>
  </div>

</template>

<script>
import Store from '../Store'

export default {
  name: 'ProjectNew',
  data () {
    return {
      projectName: ''
    }
  },
  methods: {
    create_project: function () {
      Store.project_create(this.projectName)
    },
    project_created (status) {
      this.status = status
      console.log('created ' + status)
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
  height: 250px;

  label {
    font-size: 1em;
    line-height: 2em;
    color: rgba(255, 255, 255, 0.59);
  }

  select, input {
    padding: 12px 10px;
    margin: 8px 0px 28px 0px;
    width: 100%;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.2);
    border: none;
    width: 100%;
    outline: none;
    box-sizing: border-box;
  }

  .login_bottom {
    text-align: center;
  }

}

</style>
