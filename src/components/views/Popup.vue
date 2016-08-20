<template>
  <div class = "popover {{ arrow }}" v-bind:style = "arrowposition">
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
    posx: String,
    posy: String
  },
  data () {
    return {
    }
  },
  computed: {
    arrowposition: function () {
      // 95 y 308
      console.log('popup: ' + this.posx + ' ' + this.posy)
      console.log('popup2: ' + 'top: ' + this.posy + '; left: ' + this.posx + ';')

      if (this.arrow === 'left') return 'top: 320px; left: ' + this.posx + ';'
      else return 'top: ' + this.posy + '; left: -320px;'
    }
  },
  methods: {
  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

.popover {
	background-color: rgba(255, 255, 255, 1);
	color: rgb(87, 87, 87);
	font-family: 'Open Sans';
	font-size: 1em;
  position: absolute;
  width: 300px;
  min-height: 100px;
  border-radius: 3px;
  z-index: 3;
  border: 0px solid black;
  padding: 5px;
  opacity: 1;
  filter: drop-shadow(0 0 1px rgba(0,0,0,0.4)) drop-shadow(0 3px 4px rgba(0,0,0,0.4));
  text-align: left;

  img {
    width: 100%;
  }

  ul {
    padding: 5px;
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
    z-index: -1;
	}

  &.left {
    &:before {
      left: -10px;
      bottom: 40px;
      /*
      box-shadow: -5px 3px 5px 0px rgba(0, 0, 0, 0.22);
      */
    }
  }

  &.right {
    min-height: 200px;

    &:before {
      right: -10px;
      top: 15px;
      /*
      box-shadow: 5px -3px 5px 0px rgba(0, 0, 0, 0.22);
      */
    }
  }
}


</style>
