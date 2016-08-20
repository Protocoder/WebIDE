<template>
  <div id = "info">
    <h2><span class = "object">ui.</span><span class = "method">{{data.name}}()</span></h2>
    <p class = "description">{{data.description}}</p>
    <div class = "example">
      <h3>example</h3>
      <code class = "code">
        <pre class = "javascript">
        function () {
          console.log('hola')
        }
        </pre>
      </code>
    </div>
    <div class = "usage">
      <h3>Usage</h3>
      <ul>
        <li v-for = "signature in data.signatures">
          .{{data.name}}(<span v-for = "f in signature.fields">{{f.name}}<span v-if = "$index != signature.fields.length-1">, </span></span>)
        </li>
      </ul>
    </div>
    <div class = "params">
      <h3>params</h3>
      <table>
        <tr v-for = "p in data.params">
          <td class = "param">{{p.name}}</td>
          <td class = "type">String</td>
          <td class = "description">{{p.description}}</td>
        </tr>
      </table>
    </div>
    <div class = "returns">
      <h3>returns</h3>
      <table>
        <tr>
          <td class = "type">{{data.returning.type}}</td>
          <td class = "description">{{data.returning.name}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Marked from 'marked'
import Highlight from 'highlight.js'
import 'highlight.js/styles/monokai.css'

Marked.setOptions({
  highlight: function (code, lang) {
    return Highlight.highlightAuto(code, [lang]).value
  }
})

export default {
  name: 'DocumentationCard',
  filters: {
    marked: Marked
  },
  props: {
    data: Object,
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
  },
  ready () {
    // $('pre code').each(function(i, block) {
    // hljs.highlightBlock(block)
    console.log('------------------')
    Highlight.highlightBlock(this.$el.querySelector('.code'))
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

#info {
  width: 40%;

  & > * {
    padding: 5px 10px;
  }
  h2 {
    .object {
      color: @primaryAccent;
    }

    .method {
    }
  }
  h3 {
    padding: 5px 0px;
    color: #888;
    font-weight: 300;
    font-size: 0.9em;
    text-transform: uppercase;
  }

  table {
    width: 100%;
  }

  code {
    padding: 10px 0px;
    border-radius: 2px;
    width: 100%;
  }

  code, .usage>ul, .param {
    font-family: 'Source Code Pro';
  }

  .description {
    font-weight: 300;
  }

  .usage {
    li {
      padding: 2px;
    }
  }

}

</style>
