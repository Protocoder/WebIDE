<template>
  <div id = "console" class = "proto_panel">
    <div class = "actionbar">
      <h1>console</h1>
      <ul>
        <li class="fa fa-lock" v-on:click="toggleLock()" v-bind:class="{'enabled':lock}"></li>
        <li class="fa fa-trash" v-on:click="clear()"></li>
      </ul>
    </div>
    <div class = "content">
      <ul v-el:log>
        <li v-for="log in logs | limitBy 10000000" class={{log.action}}> {{log.text}} </li>
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
      logs: [
      /* {action: 'error', text: 'potato'}
      */],
      count: 0,
      lock: false
    }
  },
  methods: {
    console: function (data) {
      this.logs.push({action: data.action, text: data.data})

      if (this.lock) return

      var ul = this.$els.log
      // wait until vue rerenders
      this.$nextTick(function () {
        ul.scrollTop = ul.scrollHeight
      })
    },
    clear: function () {
      console.log('clear')
      this.logs = []
    },
    toggleLock () {
      this.lock = !this.lock
    }
  },
  created () {
    Store.on('console', this.console)
    /*
    var that = this

    setInterval(function () {
      that.console({action: 'msg', data: 'log ' + ++that.count})
    }, 2000)
    */
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
  height: 300px;

  .content ul {
    height: calc(~"100%");
    overflow-y: auto;

    li {
      padding: 5px 10px;
      border-bottom: 1px dashed #333;
      font-family: Source Code Pro;
      line-height: 1.8em;
      .anim-fast;

      &.log_error {
        border-left: 2px solid @error;
      }

      &.log_error::before {
        content: "error";
        background: @error;
        padding: 1px 2px;
      }

      &.log_error:hover {
        background: lighten(@error, 10%)
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}


</style>
