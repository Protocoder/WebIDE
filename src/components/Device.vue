<template>
  <div id = "device_info" v-on:click = "togglepopup">
    <p> Connected to </p>
    <i class = "fa fa-mobile fa-5x"></i>
    <p> Phone model </p>
  </div>
  <div id = "device_popup" class = "popover" v-show="showpopover">
    <div class = "arrow">
    </div>
    <ul>
      <li v-for = "prop in device_properties">
        {{ $key }} : {{ prop }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Device',
  data () {
    return {
      msg: 'Hello World!',
      showpopover: false,
      device_properties: {
        name: 'motorola',
        screensize: '960x800 landscape',
        battery: '25%',
        network_connection: 'Wifi',
        internet_connection: 'yes'
      }
    }
  },
  methods: {
    togglepopup: function () {
      this.showpopover = !this.showpopover
    }
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


.popover {
	background-color: rgba(255, 255, 255, 1);
	color: rgb(87, 87, 87);
  .main_shadow;
	font-family: 'Open Sans';
	font-size: 1em;
  position: absolute;
  width: 300px;
  height: 200px;
  border-radius: 2px;
  bottom: 10px;
  left: 152px;
  z-index: 5;
  border: 2px solid black;
  padding: 15px;
  opacity: 0.95;

	.arrow {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 176px;
    border-right-color: #000;
    left: -15px;
    background-color: white;
    transform: rotate(45deg);
    border-left: 2px solid black;
    border-bottom: 2px solid black;
    border-radius: 2px;
	}
}


</style>
