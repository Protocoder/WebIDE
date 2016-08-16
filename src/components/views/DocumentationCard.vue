<template>

  <div id = "info">
    <h2><span class = "object">ui.</span><span class = "method">addButton()</span></h2>
    <p class = "description">this is a MarkDown description</p>
    <div class = "usage">
      <p>usage</p>
      <ul>
        <li>ui.addButton(0, 0, 1, 1)</li>
      </ul>
    </div>

    <p class = "description">this is a MarkDown description</p>
    <p class = "description">this is a MarkDown description</p>

  </div>

</template>

<script>
export default {
  name: 'DocumentationCard',
  props: {
    arrow: String,
    posy: Number
  },
  data () {
    return {
    }
  },
  computed: {
    arrowposition: function () {
    }
  },
  methods: {
  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

#info {
  & > * {
    padding: 5px;
  }
  h2 {
    .object {
      color: @primaryAccent;
    }

    .method {

    }
  }

  .description {
    font-weight: 300;
  }

}

</style>
