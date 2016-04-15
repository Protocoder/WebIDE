<template>
  <div id = "device_info" v-on:click = "togglepopup">
    <p> Connected to </p>
    <div id = "device_frame" v-bind:class = "{ 'rotate' : is_rotated }" >
      <div id = "device_screen"> </div>
    </div>
    <!-- <i class = "fa fa-mobile fa-5x"></i> -->
    <p> {{ device_properties.modelName }} </p>
  </div>

  <popup v-if = "showpopover" arrow = "left">
    <ul>
      <li v-for = "prop in device_properties">
        <span class = "key">{{ $key }} :</span> {{ prop }}
      </li>
    </ul>
  </popup>


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
import Popup from './Popup'

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
      }
    }
  },
  methods: {
    togglepopup: function () {
      this.showpopover = !this.showpopover
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
  cursor: pointer;
  text-align: center;
  bottom: 0;
  position: absolute;
  font-size: 0.8em;
  font-weight: 100;
  font-family: 'Open Sans';
  padding: 15px 52px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  p {
  	margin: 0 0 0px;
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
  height: 64px;
  width: 36px;
  background: transparent none repeat scroll 0% 0%;
  border: 1px solid rgba(255, 255, 255, 0.53);
  margin: 12px 6px;
  padding: 3px;
  border-radius: 3px;

  &.rotate {
    transform: rotate3d(0, 0, 1, 90deg);
  }

  &.rotate * {
    transform: translate3d(0px, 3px, 0px);
  }

  #device_screen {
    .all-transitions;
    width: 35px;
    height: 55px;
    background: rgba(255, 255, 255, 0.06) none repeat scroll 0% 0%;
    border: 1px solid rgba(255, 255, 255, 0.17);
  }
}

</style>
