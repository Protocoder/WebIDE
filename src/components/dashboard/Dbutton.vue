<template>
  <button class = "dbutton">{{info.name}}</button>
</template>

<script>
export default {
  name: 'DButton',
  props: ['info'],
  data () {
    return {
      pos: null
    }
  },
  computed: {
  },
  methods: {
  },
  mounted: function () {
    console.log('added dbutton')
  },
  created: function () {
    console.log('created module dbutton')
  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

.dbutton {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: @accentColor;
  outline: none;
  border: none;
  color: black;

  &:hover {
    background: lighten(@accentColor, 20%);
  }

  &:active {
    background: darken(@accentColor, 10%);
  }
}
</style>
