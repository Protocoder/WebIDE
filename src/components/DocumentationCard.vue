<template>
  <div id = "info">
    <h2><span class = "object">{{data.object.name}}.</span><span class = "method">{{data.method.name}}()</span></h2>
    <div class = "stub">
      <h2>Documentation incomplete</h2>
      <p>Help improve the documentation of this method</p>

      <a v-bind:href = "getGithubUrl(data.method)" target = "_blank">Link to this file in Github</a>
      <a href = "http://" target = "_blank">How to contribute</a>

    </div>
    <p class = "description">{{data.method.description}}</p>
    <div class = "example">
      <h3>example</h3>
      <code class = "code">
        <pre class = "javascript">
function () {
  console.log('hola')
}</pre>
      </code>
    </div>
    <div class = "usage">
      <h3>Usage</h3>
      <ul>
        <li v-for = "(signature, index) in data.method.signatures">
          {{data.object.name}}.{{data.method.name}}(<span v-for = "f in signature.fields">{{f.name}}<span v-if = "index != signature.fields.length-1">, </span></span>)
        </li>
      </ul>
    </div>
    <div class = "params">
      <h3>params</h3>
      <table>
        <tr v-for = "p in data.method.params">
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
          <td class = "type">{{data.method.returning.type}}</td>
          <td class = "description">{{data.method.returning.name}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Marked from 'marked'
import Highlight from 'highlight.js'
import 'highlight.js/styles/github-gist.css'

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
    getGithubUrl: function (method) {
      var urlGithub = 'https://github.com/Protocoder/Protocoder/blob/app_cleanup/'
      return urlGithub + method.locationFile.substring(14) + '#L' + method.locationInfile
    }
  },
  mounted () {
    this.$nextTick(function () {
      // $('pre code').each(function(i, block) {
      // hljs.highlightBlock(block)
      console.log('------------------')
      Highlight.highlightBlock(this.$el.querySelector('.code'))
    })
  }
}
</script>

<style lang = "less">
@import "../assets/css/variables.less";

#info {
  & > * {
    padding: 5px 10px;
  }
  h2 {
    .object {
    }

    .method {
      border-bottom: 3px solid #f5d328;
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
    overflow: initial;
  }

  .description {
    font-weight: 300;
  }

  .usage {
    li {
      padding: 2px;
    }
  }

  .stub {
    background: #ec4f4f;
    margin: 10px;
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    display: block;
    color: white;
    padding: 12px;
    /* animation: fadeIn 1s infinite alternate; */

    h2 {
      font-weight: 800;
      padding-bottom: 10px;
    }

    p {
      margin-bottom: 10px;
    }

    a {
      padding: 5px 5px;
      background: rgba(255, 255, 255, 0.26);
      border-radius: 2px;
      color: white;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      margin: 2px 0px;
      border: 1px solid rgba(255, 255, 255, 0.11);

      &:hover {
        opacity: 0.8;
      }

      &:active {
        opacity: 0.6;
      }
    }
  }


  @keyframes fadeIn {
    from { opacity: 0.8; }
  }
}

</style>
