<template>
  <div id = "dashboard" class = "proto_panel">
    <div class = "actionbar">
      <h1>Dashboard</h1>
      <div class = "adding_buttons">
        <button v-on:click = "addModule">+</button>
        <button v-on:click = "removeModule">-</button>
      </div>
    </div>
    <div class = "content">
      <module v-for = "m in addedModules" :info = "m"></module>

      <!--
      <div class = "card">
        <img class = "widget" src = "" />
        <button class = "widget">button</button>
      </div>

      -->

    </div>
  </div>
</template>

<script>
import Module from './dashboard/Module'

export default {
  name: 'Dashboard',
  components: {
    Module
  },
  data () {
    return {
      modules: [
        { type: 'button' },
        { type: 'text' },
        { type: 'input' },
        { type: 'slider' },
        { type: 'webview' }
      ],
      addedModules: []
    }
  },
  methods: {
    addModule: function () {
      var rnd = Math.floor(this.modules.length * Math.random())
      var type = this.modules[rnd].type
      console.log('adding module ---> ' + type)

      // var m = new Module()
      this.addedModules.push({ name: Math.random(), type: type })
    },
    removeModule: function () {
      console.log('remove module')
      this.addedModules.pop()
    }
  },
  route: {
    data () {
      this.title = 'Dashboard'
    }
  },
  created () {
  },
  mounted () {
  },
  destroyed () {
  }
}
</script>
<style lang = "less">
@import "../assets/css/variables.less";

#dashboard {
  /* background: rgba(0, 0, 0, 0.9); */
  background: #607D8B;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

#dashboard .actionbar {
  background: rgba(0, 0, 0, 0.28);
  color: rgba(255, 255, 255, 0.34);
  display: flex;
  flex: 1;

  h1 {
    padding: 10px;
    font-size: 1.2em;
    font-weight: 600;
    text-transform: uppercase;
    flex: 1;
  }

  .adding_buttons {
    padding: 5px;
  }
}

#dashboard .content {

  .card {
    background: white;
    padding: 5px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;

    * {
      flex: 1;
    }
  }




  img {
  }


}
</style>
