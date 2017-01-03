<template>
  <div id = "handle" v-bind:class = "orientation"> </div>
</template>

<script>
import Store from '../Store'

export default {
  name: 'Handle',
  props: {
    orientation: String,
    container: String
  },
  mounted () {
    var that = this

    this.$nextTick(function () {
      var handle = this.$el
      var container = document.querySelector('#' + this.container)
      // console.log(this.orientation + ' ' + handle + ' ' + this.container)

      handle.onmousedown = function (e) {
        var handlePos
        var containerSize
        // console.log(this.orientation)
        // console.log(e)

        if (that.orientation === 'vertical') {
          handlePos = handle.getBoundingClientRect().left
          containerSize = container.getBoundingClientRect().width
          // console.log(that.container + ' qq')
        } else {
          // console.log('qq2')
          handlePos = handle.getBoundingClientRect().top
          containerSize = container.getBoundingClientRect().height
        }

        document.onmousemove = function (e) {
          if (that.orientation === 'vertical') {
            // move handle
            var barW = handle.getBoundingClientRect().width
            var positionX = e.pageX - handlePos - barW / 2
            // console.log(handleX + ' ' + ' ' + ' ' + e.pageX + ' ' + position)

            // adjust container size
            container.style.width = containerSize - positionX + 'px'
          } else {
            // move handle
            var barH = handle.getBoundingClientRect().height
            var positionY = e.pageY - handlePos - barH / 2
            // console.log(handleX + ' ' + ' ' + ' ' + e.pageX + ' ' + position)

            // adjust container size
            container.style.height = containerSize + positionY + 'px'
          }
          e.preventDefault()
          e.stopPropagation()
        }

        document.onmouseup = function (e) {
          document.onmousemove = null
        }

        e.preventDefault()
        e.stopPropagation()
      }

      handle.onmouseup = function () {
        // console.log('handle mouse up')
        document.onmousemove = null
      }
    })
  },
  destroyed () {
    Store.remove_listener('toggle', this.toggle_section)
  }
}

</script>

<style lang='less'>
@import "../assets/css/variables.less";

#handle {
  position: absolute;
  z-index: 2;
  border-radius: 1px;


  &.vertical, &.horizontal  {
      &:hover {
        cursor: col-resize;
        background: fade(@accentColor, 82%);
      }

      &:active {
        background: @accentColor;
      }
  }

  &.vertical {
    width: 5px;
    height: 100%;
    left: -1px;
    top: 62px;

    &:hover {
      cursor: col-resize;
    }

  }

  &.horizontal {
    width: 100%;
    height: 5px;
    width: calc(~"100%");
    margin-top: -8px;

    &:hover {
      cursor: row-resize;
    }
  }

}


</style>
