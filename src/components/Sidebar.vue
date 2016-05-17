<template>

  <!-- navigation -->
  <div id = "sidebar">
    <!-- -->
    <ul class = "menu_separation">
      <li id = "new" v-on:click="toggle('new_project')" v-link="{activeClass: 'selected'}"><div class = "icon-box">+</div>New</li>
    </ul>

    <ul class = "menu_separation">
      <li id = "projects" v-on:click="toggle('load_project')" v-bind:class = "{'selected':'qq' === 'qw'}"><div class = "icon-box">/</div>Projects</li>
      <li id = "examples" v-on:click="toggle('load_example')"><div class = "icon-box">/</div>Examples</li>
      <li id = "demos" v-on:click="toggle('load_demo')"><div class = "icon-box">/</div>Demos</li>
    </ul>

    <!-- this group changes the view in the router -->
    <ul class = "">
      <li id = "tutorials" v-link="{ name: 'tutorial', params: { id: 1 }, activeClass: 'selected' }"><div class = "icon-box">*</div>Tutorials</li>
      <li id = "preferences" v-link="{ name: 'preferences', activeClass: 'selected' }"><div class = "icon-box">"</div>Preferences</li>
      <li id = "about" v-link="{ name: 'about', activeClass: 'selected' }"><div class = "icon-box">?</div>About</li>
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
  order: 2;
  flex: 2;
  color: @secondaryAccent;
  user-select: none;

  /* menu */
  ul {
    &.menu_separation {
      padding-bottom: 15px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }
    
    .editor_options {
      padding-left: 12px;
    }

    li {
       padding: 12px 15px;
       margin-bottom: 2px;
       cursor: pointer;
       text-decoration: none;
       text-transform: uppercase;
       font-family: 'Open Sans';
       font-weight: 100;
       color: #FFFFFF;
       border-left: 2px solid transparent;

       &:hover, &.selected {
         background-color: rgba(255, 255, 255, 1);
         color: black;
         border-radius: 2px;

         .icon_box {
           color: pink;
         }
       }

       &.v-link-active {
         border-right: 8px solid rgba(255, 255, 255, 0.5);
         border-left: 2px solid white;
       }

       .icon-box {
         border-radius: 2px;
         margin-right: 12px;
         display: inline-block;
         width: 15px;
         text-align: center;
         border: 0px solid rgba(255, 255, 255, 0.23);
       }
    }
  }
}

</style>
