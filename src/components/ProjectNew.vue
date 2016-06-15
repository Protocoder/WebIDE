<template>
  <!-- Project Creation Panel -->
  <div class = "editor_panel main_shadow" id="editor_panel_new">
    <div class = "left">
      <form class="">
        <!-- info input -->
        <label for="choosefolder">choose a folder</label>
        <select id="choosefolder" name="choosefolder" class="form-control">
          <option value="1">Option one</option>
          <option value="2">Option two</option>
        </select>

        <label for="projectname">project name</label>
        <input id="projectname" name="projectname" type="text" placeholder=":)" class="form-control input-md" required="">

        <div class = "login_bottom">
          <label for="create"></label>
          <button id="create" name="create" class="btn btn-success">Create</button>
          <button id="cancel" name="cancel" class="btn btn-default">Cancel</button>
        </div>
      </form>
    </div>

    <div class="right">
      <p>Create a new project</p>
    </div>
  </div>

</template>

<script>
export default {
  name: 'ProjectNew'
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#editor_panel_new {
  height: 300px;

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
