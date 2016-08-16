<template>
  <div class = "p5">
    <div id = "myContainer"></div>
  </div>
</template>

<script>
import P5 from 'p5'

export default {
  name: 'P5js',
  props: {
    arrow: String
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
  },
  created () {
    var s = function (sketch) {
      var x = 100
      var y = 100

      sketch.setup = function () {
        sketch.createCanvas(700, 410)
      }

      sketch.draw = function () {
        sketch.background(0)
        sketch.fill(255)
        sketch.rect(x, y, 50, 50)
      }
    }
    var myp5 = new P5(s, 'myContainer')
    console.log(myp5)
  },
  destroyed () {

  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

.p5 {

}


</style>
