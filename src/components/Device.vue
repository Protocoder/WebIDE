<template>
  <div id = "device_info" v-show = "device_properties.connected" v-on:click = "togglepopup">
    <div id = "device_frame" v-bind:class = "{ 'rotate' : is_rotated }" >
      <div id = "device_screen"> </div>
    </div>
    <!-- <i class = "fa fa-mobile fa-5x"></i> -->
    <p> Connected to </p>
    <p v-if = "ready"> {{ device_properties.info.device['model name'] }} </p>

    <popup v-if = "showpopover" arrow = "left" :posx = "posx" :posy = "posy">
      <ul>
        <li v-for = "(prop, key1) in device_properties.info">
          <div class = "title">{{key1}}</div>
          <ul>
            <li v-for = "(value, key2) in prop"><span class = "key">{{ key2 }} :</span> {{ value }}</li>
          </ul>
        </li>
      </ul>
    </popup>

  </div>
</template>

<script>
import store from '../Store'
// import _ from 'lodash'

import Popup from './views/Popup'

export default {
  name: 'Device',
  components: {
    Popup
  },
  data () {
    return {
      ready: false,
      showpopover: false,
      device_properties: {
        connected: true,
        name: 'motorola',
        screensize: '960x800 landscape',
        battery: '25%',
        network_connection: 'Wifi',
        internet_connection: 'yes',
        orientation: 'portrait'
      },
      posx: '0px'
    }
  },
  methods: {
    togglepopup: function () {
      var rect = this.$el.getBoundingClientRect()
      // console.log('qq', rect.top, rect.left, rect.height)
      this.showpopover = !this.showpopover
      this.posx = rect.left + rect.width + 'px'
      this.posy = rect.top + rect.height / 2 + 'px'
    },
    device_update: function (data) {
      if (typeof data.info !== 'undefined') {
        // this.device_properties = _.orderBy(data, 'name')
        this.device_properties = data
        this.ready = true
      }
    },
    showinfo: function () {
      this.showpopover = !this.showpopover
    }
  },
  computed: {
    is_rotated: function () {
      return this.device_properties.orientation === 'landscape'
    }
  },
  created () {
    store.on('device', this.device_update)
    store.on('toggle_device_info', this.showinfo)
  },
  destroyed () {
    store.remove_listener('device', this.device_update)
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

#device_info {
  order: 3;
  align-self: flex-end;
  cursor: pointer;
  text-align: center;
  font-size: 0.8em;
  font-weight: 100;
  font-family: 'Open Sans';
  width: 100%;
  margin: 10px 0px;
  border-radius: 2px;
  padding: 10px;
  box-sizing: border-box;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .title {
    color: #BCBCBC;
    text-transform: uppercase;
    font-size: 0.8em;
    font-weight: 800;
    padding: 0px 5px;
  }

  p {
  	margin: 0 0 0px;
    font-weight: 600;
    text-transform: lowercase;
    font-size: 0.8em;
  }

  i {
  	padding: 4px 20px;

  	&.rotated {
  		transform: rotateZ(90deg);
  	}
  }
}

#device_frame {
  .all-transitions;
  background: darken(@mainColor, 20%);
  border: 0;
  padding: 3px 2px 6px 2px;
  margin: 10px auto;
  border-radius: 1px;
  display: inline-block;

  &.rotate {
    transform: rotate3d(0, 0, 1, 90deg);
  }

  &.rotate * {
    transform: translate3d(0px, 3px, 0px);
  }

  #device_screen {
    .all-transitions;
    width: 26px;
    height: 42px;
    background: lighten(@backgroundColor, 10%);
    border-radius: 0px;
  }
}

</style>
