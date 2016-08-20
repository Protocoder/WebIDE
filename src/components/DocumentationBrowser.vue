<template>
  <div class = "main_shadow documentation" v-bind:style = "">
    <div class = "header">
      <h1 class = "title">Documentation</h1>
      <input type = "text" v-model = "search" placeholder="search" />
    </div>

    <div class = "content">
      <div id = "browser">
        <div v-for = "object in documentation | orderBy 'name'" class = "object">
          <h3>{{object.name}}</h3>
          <ul>
            <li v-for = "f in object.fields | orderBy 'name' | filterBy search in 'name'"><p>{{f.name}}</p></li>
          <ul>
            <li v-for = "m in object.methods | orderBy 'name' | filterBy search in 'name'"><p v-on:click = "select_method(m)">{{m.name}}()</p></li>
          </ul>
        </div>
      </div>

      <documentation-card :data = "selected"></documentation-card>
    </div>

  </div>
</template>

<script>
import Store from '../Store'
import DocumentationCard from './DocumentationCard'

export default {
  components: {
    DocumentationCard
  },
  name: 'DocumentationBrowser',
  props: {
    documentation: ''
  },
  data () {
    return {
      selected: '',
      search: ''
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
    },
    select_method: function (method) {
      console.log(method)
      this.selected = method
    }
  },
  created () {
    Store.load_documentation()
    Store.on('documentation_loaded', this.load_documentation)
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

.documentation {
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px;
  height: 500px;
  z-index: 1;

  & > div {
    padding: 10px;
  }

  h1 {
    font-size: 1.1em;
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
    padding: 3px;
    padding-bottom: 5px;
  }

  .header {
    display: flex;
    border-bottom: 1px solid #ddd;
    background: #ddd;
    align-items: center;

    .title {
      width: 100%;
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
      column-count: auto;
      column-width: 120px;
      column-span: all;
      column-gap: 10px;

      .object {
        display: inline-block;
        padding: 10px;
        vertical-align: top;

        li {
          color: #333;
          font-weight: 300;

          p {
            cursor: pointer;
            padding: 3px;
            display: inline-block;
          }

          p:hover {
            background: @primaryAccent;
          }
        }
      }
    }

  }

}

</style>
