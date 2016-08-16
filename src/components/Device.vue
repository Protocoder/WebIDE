<template>
  <div id = "device_info" v-on:click = "togglepopup">
    <p> Connected to </p>
    <div id = "device_frame" v-bind:class = "{ 'rotate' : is_rotated }" >
      <div id = "device_screen"> </div>
    </div>
    <!-- <i class = "fa fa-mobile fa-5x"></i> -->
    <p> {{ device_properties['model name'] }} </p>


    <popup v-if = "showpopover" arrow = "left" :posx = "posx" :posy = "posy">
      <ul>
        <li v-for = "prop in device_properties">
          <span class = "key">{{ $key }} :</span> {{ prop }}
        </li>
      </ul>
    </popup>

  </div>
  <!--
  <div id = "device_popup" class = "popover main_shadow" v-show = "showpopover">
    <div class = "arrow">
    </div>
    <ul>
      <li v-for = "prop in device_properties">
        <span class = "key">{{ $key }} :</span> {{ prop }}
      </li>
    </ul>
  </div>
  -->

</template>

<script>
import Store from '../Store'
import Popup from './views/Popup'

export default {
  name: 'Device',
  components: {
    Popup
  },
  data () {
    return {
      showpopover: false,
      device_properties: {
        name: 'motorola',
        screensize: '960x800 landscape',
        battery: '25%',
        network_connection: 'Wifi',
        internet_connection: 'yes',
        orientation: 'landscape'
      },
      posx: '0px'
    }
  },
  methods: {
    togglepopup: function () {
      var rect = this.$el.getBoundingClientRect()
      console.log('qq', rect.top, rect.left, rect.height)
      this.showpopover = !this.showpopover
      this.posx = rect.left + rect.width + 'px'
      this.posy = rect.top + rect.height / 2 + 'px'
    },
    device_update: function (data) {
      this.device_properties = data
    }
  },
  computed: {
    is_rotated: function () {
      return this.device_properties.orientation === 'landscape'
    }
  },
  created () {
    Store.on('device', this.device_update)
  },
  destroyed () {
    Store.remove_listener('device', this.device_update)
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
    background-color: rgba(255, 255, 255, 0.2);
  }

  p {
  	margin: 0 0 0px;
    font-weight: 600;
    text-transform: lowercase;
    font-size: 0.7em;
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
  height: 52px;
  width: 28px;
  background: transparent none repeat scroll 0% 0%;
  border: 1px solid rgba(255, 255, 255, 0.53);
  margin: 12px auto;
  padding: 1px;
  border-radius: 3px;

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
    background: rgba(255, 255, 255, 0.06) none repeat scroll 0% 0%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1px;
  }
}

</style>
