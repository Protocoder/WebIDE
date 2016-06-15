<template>
  <div id = "preferences" class = "proto_panel">
    <div class = "actionbar">
      <h1>Preferences</h1>
    </div>
    <div class = "content">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preferences',
  data () {
    return {
    }
  },
  methods: {

  },
  route: {
    data () {
      this.title = 'Preferences'
    }
  },
  created () {
  },
  ready () {
  },
  destroyed () {
  }
}
</script>
<style lang = "less">
@import "../assets/css/variables.less";

#panels #preferences {
  background: white;
  color: black;
  height: 200px;
}
</style>
