<template>
  <h1 class = "logo"><span class="accent">&gt;</span>Proto<span class="bolder">coder<span></span></span><span class="accent">_ </span></h1>
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
  color: white;
  font-family: 'Source Code Pro';
  font-size: 1.2em;
  font-weight: 100;
  margin: 30px 0em 1.5em 2em;

  .accent {
    color: @primaryAccent;
    font-weight: 500;
  }

  .bolder {
    font-weight: 500;
  }
}

</style>
