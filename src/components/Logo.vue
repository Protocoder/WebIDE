<template>
  <h1 class = "logo">
  \\\\\\\\
    <!--
    <span class="accent">&gt;</span>Proto<span class="bolder">coder<span></span></span><span class="accent">_ </span>
    -->
  </h1>
</template>

<script>
export default {
  name: 'Logo'
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

/* logo */
h1.logo {
  order: 1;
  color: white;
  font-family: 'Source Code Pro';
  font-size: 1.2em;
  font-weight: 100;
  margin: 23px 0em 33px 0px;

  color: darken(@primaryTextColor, 60%);
  font-weight: 800;
  text-align: center;

  .accent {
    color: @accentColor;
    font-weight: 500;
  }

  .bolder {
    font-weight: 500;
  }
}

</style>
