<template>
  <div class = "popover main_shadow {{ arrow }}" v-bind:style = "arrowposition">
    <slot>
    No content to display
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    arrow: String,
    posy: Number
  },
  data () {
    return {
    }
  },
  computed: {
    arrowposition: function () {
      console.log('mm')
      console.log(this.arrow)
      console.log(this.posy)
      console.log('---')
      if (this.arrow === 'left') return 'bottom: 10px; left: 150px'
      else return 'top: ' + (this.posy - 32) + 'px; right: 270px'
    }
  },
  methods: {
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

.popover {
	background-color: rgba(255, 255, 255, 1);
	color: rgb(87, 87, 87);
	font-family: 'Open Sans';
	font-size: 1em;
  position: absolute;
  width: 300px;
  border-radius: 3px;
  z-index: 3;
  border: 0px solid black;
  padding: 20px;
  opacity: 1;

  img {
    width: 100%;
  }

  ul {
    .key {
      font-weight: 800
    }
    li {
      padding-bottom: 0.5em;
    }
  }

  /* arrow */
  &:before {
    content: ' ';
    width: 25px;
    height: 25px;
    position: absolute;
    bottom: auto;
    border-right-color: #000;
    background-color: white;
    transform: rotate(45deg);
    border-left: 0px solid black;
    border-bottom: 0px solid black;
    border-radius: 2px;
    z-index: 0;
	}

  &.left {
    &:before {
      left: -10px;
      bottom: 40px;
      box-shadow: -5px 3px 5px 0px rgba(0, 0, 0, 0.22);
    }
  }

  &.right {
    min-height: 200px;

    &:before {
      right: -10px;
      top: 15px;
      box-shadow: 5px -3px 5px 0px rgba(0, 0, 0, 0.22);
    }
  }
}


</style>
