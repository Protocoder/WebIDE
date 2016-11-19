<template>
  <div id = "dashboard" class = "proto_panel">
    <div class = "actionbar">
      <h1>Dashboard</h1>
    </div>
    <div class = "content">
      <div class = "card">
        <img class = "widget" src = "" />
        <p class = "widget label"> text </p>
        <button class = "widget">button</button>
      </div>

      <div class = "widget text_input">
      <span> qq </span>
      <input class = "" />
      <button class = "widget"> Ok </button>
      </div>

      <div class = "widget slider">
        <span>lala</span>
        <input type="range"/>
        <span>2</span>
      </div>

      <div class = "widget html">
        <iframe src = "http://www.protocoder.org"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {

    }
  },
  methods: {

  },
  route: {
    data () {
      this.title = 'Dashboard'
    }
  },
  created () {
  },
  mounted () {
  },
  destroyed () {
  }
}
</script>
<style lang = "less">
@import "../assets/css/variables.less";

#dashboard {
  background: rgba(0, 0, 0, 0.9);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

#panels #dashboard {
  background: tomato;
  color: black;
  height: 500px;
}

#dashboard .content {
  .widget {
    border: 0px solid black;
    color: #2E2E2E;
    font-family: Roboto-Condensed-Regular, verdana, sans-serif;
    box-shadow: none;
    outline: none;
    overflow: hidden;
    margin: 5px 0px;
    padding: 2px 5px;
    border-radius: 2px;
    font-size: 1.2em;
  }

  .card {
    background: white;
    padding: 5px;
    border-radius: 2px;
    display: flex;
    flex-direction: column;

    * {
      flex: 1;
    }
  }

  .text_input, .slider {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text_input {
    span {

    }

    input {
      border: 0px;
      background: transparent;
      border-bottom: 2px solid white;
      color: white;
      flex: 2;
      min-width: 20px;
      margin: 0px 10px;
    }

    button {
      width: 50px;
    }
  }

  .slider {
    input[type=range] {
      -webkit-appearance: none;
      flex: 2;
    }

    input[type="range"]::-moz-range-thumb {
      background-color: #ffbb33;
      width: 10px;
      height: 30px;
    }

    span {

    }
  }

  img {
  }

  .label {
  }

  button {
    background-color: @primaryAccent;
    outline: none;
    border: none;

    &:hover {
      background: lighten(@primaryAccent, 20%);
    }

    &:active {
      background: darken(@primaryAccent, 10%);
    }
  }

  .html {
    margin: 0;
    padding: 0px;

    iframe {
      width: 100%;
    }

  }

}
</style>
