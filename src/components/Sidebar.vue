<template>

  <div id = "sidebar">
    <!-- navigation -->

    <!-- -->
    <ul class = "menu_separation">
      <li id = "new_project" v-on:click="toggle($event)" v-bind:class = "{'selected':'new_project' == navitem }"><i class = "fa fa-plus icon-box"></i><span>New</span></li>
    </ul>

    <ul class = "menu_separation">
      <li id = "load_project" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_project' == navitem }"><i class = "fa fa-list icon-box"></i><span>Projects</span></li>
      <!-- <li id = "load_example" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_example' == navitem }"><div class = "icon-box">/</div>Examples</li> -->
      <li id = "load_demo" class = "disabled" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_demo' == navitem }"><i class = "fa fa-list icon-box"></i><span>Demos</span></li>
    </ul>

    <!-- this group changes the view in the router -->
    <ul class = "">
      <li id = "load_documentation" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_documentation' == navitem }"><i class = "fa fa-book icon-box"></i><span>Documentation</span></li>
      <li id = "load_tutorials" class = "disabled" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_tutorials' == navitem }"><i class = "fa fa-leanpub icon-box"></i><span>Tutorials</span></li>
      <li id = "load_preferences" class = "disabled" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_preferences' == navitem }"><i class = "fa fa-sliders icon-box"></i><span>Preferences</span></li>
      <li id = "load_about" class = "disabled" v-on:click="toggle($event)" v-bind:class = "{'selected':'load_about' == navitem }"><i class = "fa fa-question icon-box"></i><span>About</span></li>
    </ul>
  </div>
</template>

<script>
import Store from '../Store'

export default {
  name: 'Sidebar',
  data () {
    return {
      navitem: '',
      qq: true
    }
  },
  methods: {
    toggle: function (event) {
      this.toggle_str(event.currentTarget.id)
      // console.log(this.navitem)
      // api.project_list_all("", function() {
      //
      // })
      // Store.project_list_all()
      // Store.project_action('run', 'Examples/Media', 'Camera')
    },
    toggle_str: function (what) {
      console.log('what')
      if (this.navitem !== what) {
        this.navitem = what
      } else {
        this.navitem = ''
      }
      Store.emit('toggle', what)
    }
  },
  created () {
    Store.on('toggle_section', this.toggle_str)
  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#sidebar {
  order: 2;
  flex: 2;
  color: @primaryTextColor;
  user-select: none;

  /* menu */
  ul {
    &.menu_separation {
      padding-bottom: 7px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .editor_options {
      padding-left: 12px;
    }

    li {
       padding: 8px 5px;
       margin-bottom: 2px;
       cursor: pointer;
       text-decoration: none;
       text-transform: uppercase;
       font-family: 'Open Sans';
       font-weight: 700;
       font-size: 0.7em;
       background: transparent linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)) repeat scroll 0% 0%;
       border: 1px solid transparent;

       &:hover, &.selected {
         border-color: rgba(255, 255, 255, 0.8);
         /* background-color: @accentColor; */
         /* background-color: rgba(255, 255, 255, 1); */
         color: rgba(255, 255, 255, 1);
         border-radius: 2px;
         /* background: transparent linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0)) repeat scroll 0% 0%; */

         .icon_box {
           color: pink;
         }
       }

      /*
      * fix this
      */
       &.v-active {
         border-right: 8px solid rgba(255, 255, 255, 0.5);
         border-left: 2px solid white;
       }

       .icon-box {
         border-radius: 2px;
         margin-right: 5px;
         display: inline-block;
         width: 15px;
         text-align: center;
         border: 0px solid rgba(255, 255, 255, 0.23);
       }
    }
  }
}

</style>
