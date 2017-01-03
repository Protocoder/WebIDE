<template>
  <div class = "editor_panel main_shadow documentation" v-bind:style = "">
    <div class = "btn-sidebar btn-close" v-on:click = "close">
      <i class = "fa fa-close"></i>
    </div>

    <div class = "header">
      <!-- <h1 class = "title">Documentation</h1> -->
      <input type = "text" v-model = "search" placeholder="type to search..." />
    </div>

    <div class = "content">
      <div id = "browser">
        <!-- TODO orderBy -->
        <div v-for = "object in queriedDocumentation" class = "object">
          <h3>{{object.name}}</h3>
          <ul>
            <!-- TODO filter and orderBy name-->
            <li v-for = "f in object.fields"><p>{{f.name}}</p></li>
          </ul>
          <ul>
            <!-- TODO filter and orderBy name -->
            <li v-for = "m in object.methods"><p v-on:click = "select_method(object, m)">{{m.name}}()</p></li>
          </ul>
        </div>
      </div>

      <div id = "card">
        <documentation-card v-if = "show_card" :data = "selected"></documentation-card>
      </div>
    </div>

  </div>
</template>

<script>
import store from '../Store'
import _ from 'lodash'
import DocumentationCard from './DocumentationCard'

export default {
  components: {
    DocumentationCard
  },
  name: 'DocumentationBrowser',
  data () {
    return {
      documentation: store.state.documentation,
      selected: {},
      search: '',
      show_card: false
    }
  },
  computed: {
    arrowposition: function () {
    },
    queriedDocumentation: function () {
      var that = this
      var doc = _.cloneDeep(this.documentation)

      if (!doc) return
      var k = doc.length
      while (k--) {
        doc[k].methods = doc[k].methods.filter(function (o) {
          if (o.name.toLowerCase().indexOf(that.search.toLowerCase()) !== -1) {
            return o
          }
        })

        doc[k].fields = doc[k].fields.filter(function (o) {
          if (o.name.toLowerCase().indexOf(that.search.toLowerCase()) !== -1) {
            return o
          }
        })

        if (doc[k].methods.length === 0) {
          doc.splice(k, 1)
          // console.log('remove ' + k)
        }
      }
      return doc
    }
  },
  methods: {
    load_documentation: function (doc) {
      // this.documentation = store.state.documentation
      this.documentation = _.sortBy(store.state.documentation, 'name')
      for (var k in this.documentation) {
        this.documentation[k].methods = _.sortBy(this.documentation[k].methods, 'name')
        this.documentation[k].fields = _.sortBy(this.documentation[k].fields, 'name')
      }
      // console.log('loaded ', this.documentation)
    },
    select_method: function (object, method) {
      console.log(object.name, method.name)
      this.selected = { 'object': object, 'method': method }
      this.show_card = true
    },
    close: function () {
      store.emit('toggle', 'load_documentation')
    },
    performSearch: function (objs) {
      var that = this
      console.log('qq', objs)
      return objs.filter(function (o) {
        return o.name.indexOf(that.search) !== -1
      })
    }
  },
  created () {
    store.load_documentation()
    store.on('documentation_loaded', this.load_documentation)
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

.documentation {
  background: white;
  color: black;
  display: flex;
  min-height: 50%;
  max-height: 50%;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px;
  z-index: 1;

  h1 {
    font-size: 1.1em;
    text-transform: uppercase;
    font-weight: 700;
  }

  h2 {
    font-size: 1.5em;
    font-weight: 600;
  }

  h3 {
    font-weight: 600;
    font-size: 1.1em;
    padding: 1px 0px 4px 3px;
    color: @mainColor;
  }

  .header {
    background: @accentColor;
    align-items: center;
    color: black;
    padding: 0;

    .title {
      width: 100%;
    }

    input {
      border: 0px;
      outline: none;
      padding: 15px;
      border-radius: 2px;
      background: transparent;
      width: 100%;
      color: @secondaryTextColor;
      box-sizing: border-box;
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 1px;

    #browser {
      flex: 1;
      overflow-y: scroll;
      overflow-x: hidden;

      .object {
        display: inline-block;
        padding: 10px;
        vertical-align: top;
        width: 100%;
        box-sizing: border-box;

        ul {
          column-count: auto;
          -moz-column-count: auto;
          column-gap: 10px;
          -moz-column-gap: 10px;
          column-width: 80px;
          -moz-column-width: 80px;
          font-size: 0.8em;
        }

        li {
          color: #333;
          font-weight: 300;

          p {
            cursor: pointer;
            padding: 3px;
            display: inline-block;
          }

          p:hover {
            background: @accentColor;
          }
        }
      }
    }
  }

  #card {
    flex: 1;
    overflow: hidden;;
    overflow-y: auto;
  }

}

</style>
