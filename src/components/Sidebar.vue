<template>

  <!-- navigation -->
  <div id = "sidebar">
    <!--
    <ul>
      <li id = "list" v-link="{ path: '/loader' }"> <i class="fa fa-list fa-2x"></i> <p>Firmwares</p> </li>
      <li id = "code" v-link="{ path: '/editor' }"> <i class="fa fa-code fa-2x"></i> <p>Editor</p> </li>
      <li class = "disabled" id = "console"> <i class="fa fa-terminal fa-2x"></i> <p>Consola</p></li>
    </ul>
  -->

    <ul id = "menu">
      <div class = "editor_set">
        <li id = "m_editor" v-link="{ name: 'editor', params: { id: 1 }, activeClass: 'selected' }"><span class = "icon-box">*</span><span>Editor</span></li>
        <div class = "editor_options" v-if="$route.name === 'editor'" transition="banner-anim2">
          <li id = "new" v-on:click="toggle('new_project')" class="active" data-toggle="modal" data-target="#mymodal"><div class = "icon-box"><div class = "icon-char">+</div></div>New</li>
          <li id = "projects" v-on:click="toggle('load_project')"><div class = "icon-box">></div>Projects</li>
          <li id = "examples" v-on:click="toggle('load_example')"><div class = "icon-box">*</div>Examples</li>
        </div>
      </div>
      <li id = "tutorials" v-link="{ name: 'tutorial', params: { id: 1 }, activeClass: 'selected' }"><div class = "icon-box">*</div>Tutorials</li>
      <li id = "preferences" v-link="{ name: 'preferences', activeClass: 'selected' }"><div class = "icon-box">"</div>Preferences</li>
      <li id = "help" v-link="{ name: 'help', activeClass: 'selected' }"><div class = "icon-box"></div>Help</li>
    </ul>

  </div>

</template>

<script>
import Store from '../Store'

export default {
  name: 'Sidebar',
  methods: {
    toggle: function (what) {
      // api.project_list_all("", function() {
      //
      // })
      // Store.project_list_all()
      // Store.project_action('run', 'Examples/Media', 'Camera')
      Store.emit('toggle', what)
    }

  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#sidebar {
  position: absolute;
  width: 170px;
  height: 100%;
  color: @secondaryAccent;
  user-select: none;
  padding-top: 12px;

  /* menu */
  ul {

    .editor_options {
      padding-left: 12px;
    }

    li {
       padding: 15px 15px;
       cursor: pointer;
       text-decoration: none;
       text-transform: uppercase;
       font-family: 'Open Sans';
       font-weight: 100;
       color: #FFFFFF;
       border-left: 2px solid transparent;

       &:hover {
         background-color: rgba(255, 255, 255, 0.8);
         color: black;
       }

       &.v-link-active {
         border-right: 8px solid rgba(255, 255, 255, 0.5);
         border-left: 2px solid white;
       }

       .icon-box {
         border-radius: 2px;
         margin-right: 8px;
         color: rgba(255, 255, 255, 0.6);
         width: 20px;
         height: 20px;
         float: left;
         text-align: center;
         border: 1px solid rgba(255, 255, 255, 0.23);
       }
    }
  }
}

</style>
