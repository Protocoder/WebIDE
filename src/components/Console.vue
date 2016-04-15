<template>
  <div id = "console" class = "proto_panel">
    <div class = "actionbar">
      <h1> console </h1>
      <ul>
        <li>s</li>
        <li>c</li>
      </ul>
    </div>
    <div v-el:log class = "content">
      <ul>
        <li v-for="file in files | limitBy 10000000"> {{file.text}} </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Store from '../Store'

export default {
  name: 'Console',
  data () {
    return {
      msg: 'Hello World!',
      files: [
        { type: 'log', text: 'qq.png' }
      ]
    }
  },
  methods: {
    console: function (data) {
      this.files.push({type: 'log', text: data.log})
      // $('#console #logs').scrollTo(0, 0)
      var ul = this.$els.log.getElementsByTagName('ul')

      ul.scrollTop = '10000px' // ul.scrollHeight
      // scrollIntoView()
    }
  },
  created () {
    Store.on('console', this.console)
  },
  destroyed () {
    Store.remove_listener('console', this.console)
  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#console {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  overflow: auto;
  height: 300px;

  .content ul {
    li {
      padding: 8px 10px;
      border-bottom: 1px dashed #333;
      .anim-fast;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}


</style>
