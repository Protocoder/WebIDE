<template>
  <div class = "documentation" v-bind:style = "">
    <div class = "header">
      <h1 class = "title">Documentation</h1>
      <input/>
    </div>

    <div class = "content">
      <div id = "browser">
        <div v-for = "object in documentation" class = "object">
          <h3>{{object.name}}</h3>
          <ul>
            <li v-for = "m in object.methods"><p>{{m.name}}</p></li>
          </ul>
        </div>

      </div>

      <documentation-card></documentation-card>
    </div>

  </div>
</template>

<script>
import Store from '../../Store'
import DocumentationCard from './DocumentationCard'

export default {
  components: {
    DocumentationCard
  },
  name: 'DocumentationBrowser',
  props: {
    arrow: String,
    posy: Number,
    documentation: ''
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
    load_documentation: function (doc) {
      console.log('loaded')
      this.documentation = Store.state.documentation
    }
  },
  created () {
    Store.load_documentation()
    Store.on('documentation_loaded', this.load_documentation)
  }
}
</script>

<style lang = "less">
@import "../../assets/css/variables.less";

.documentation {
  background: white;
  color: black;
  height: 500px;

  & > div {
    padding: 10px;
  }

  h1 {
    font-size: 1.5em;
    text-transform: uppercase;
    color: #555;
    font-weight: 700;
  }

  h2 {
    font-size: 1.5em;
    font-weight: 600;
  }

  h3 {
    font-weight: 600;
    font-size: 1.2em;
  }

  .header {
    display: flex;
    border-bottom: 1px solid #ddd;
    background: #ddd;

    .title {
      width: 70%;
    }

    input {
      background: gray;
      color: white;
      border: 0px;
      outline: none;
      padding: 5px;
      border-radius: 2px;
    }
  }

  .content {
    display: flex;
    height: 100%;

    #browser {
      width: 60%;
      overflow-y: scroll;

      .object {
        display: inline-block;
        padding: 10px;
        vertical-align: top;

        li {
          padding: 2px 0px;
          color: #333;
          font-weight: 300;
          cursor: default;

          p {
            border-bottom: 1px solid transparent;
            display: inline-block;
          }

          p:hover {
            border-color: @primaryAccent;
          }
        }
      }
    }

  }

}

</style>
