<template>
  <!-- Project Creation Panel -->
  <div class = "panel main_shadow" id="new-project-panel">
    <div class="panel-container">
      <div class = "left">

        <form class="">
          <!-- info input -->
          <label for="choosefolder">choose a folder</label>
          <select id="choosefolder" name="choosefolder" class="form-control">
            <option value="1">Option one</option>
            <option value="2">Option two</option>
          </select>

          <label for="projectname">project name</label>
          <input id="projectname" name="projectname" type="text" placeholder="placeholder" class="form-control input-md" required="">

          <div class = "login-bottom">
            <label for="create"></label>
            <button id="create" name="create" class="btn btn-success">Create</button>
            <button id="cancel" name="cancel" class="btn btn-default">Cancel</button>
          </div>
        </form>

      </div>

      <div class="right">
        <div class = "right-container">
            <p>Create a new project</p>
        </div>
      </div>
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

#new-project-panel {

  label {
    font-size: 1.5em;
  }

  select, input {
    padding: 12px 0px;
    margin: 8px 0px 28px 0px;
    width: 100%;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.2);
    border: none;
    width: 100%;
    outline: none;
    box-sizing: content-box;
  }

}

</style>
