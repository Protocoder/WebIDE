<template>
  <div class = "audio">
    <audio :src = "src" preload = "auto" controls></audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    src: String
  },
  data () {
    return {
    }
  },
  computed: {
    arrowposition: function () {
    }
  },
  methods: {
  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

.audio {
  audio {
    width: 100%;
  }
}


</style>
