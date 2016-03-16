<template>
  <div id = "console" class = "proto_panel">
    <div class = "actionbar">
      <h1> console </h1>
      <ul>
        <li>s</li>
        <li>c</li>
      </ul>
    </div>
    <div class = "content">
      <ul v-for="file in files">
        <li> {{file.text}} </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Console',
  data () {
    return {
      msg: 'Hello World!',
      files: [
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' },
        { type: 'text', text: 'qq.png' }
      ]
    }
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
