<template>
  <div id = "file_manager" class = "proto_panel">
    <div class = "actionbar">
      <h1><span class = "filename">Hello World</span> Files</h1>
      <ul>
        <li>u</li>
        <li>qq</li>
      </ul>
    </div>
    <div class = "content">
      <table>
        <thead>
          <tr>
            <th> type </type>
            <th> filename </th>
            <th> size </th>
            <th> action </th>
          </tr>
        </thead>
        <tbody>
          <tr id = "files" v-for = "file in files" v-on:click = "showcontent($index, $event)">
            <td> {{{file.type | fa_icon}}} </td>
            <td> {{file.filename}} </td>
            <td> {{file.size}} </td>
            <td> Q </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <popup arrow = "right" :posy = "posyel" v-if = "showpopover" v-on-clickaway = "qaway">
  {{ selected }}
  </popup>
</template>

<script>
import Store from '../Store'
import Popup from './Popup'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  name: 'FileManager',
  components: {
    Store,
    Popup
  },
  mixins: [ clickaway ],
  data () {
    return {
      showpopover: false,
      files: [
        { type: 'folder-o', filename: 'qq1.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq2.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq3.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq4.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq5.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' }
      ]
    }
  },
  methods: {
    showcontent: function (i, e) {
      this.posyel = e.clientY
      this.selected = i
      this.showpopover = !this.showpopover
      console.log('qq')
    },
    away: function () {
      console.log('you clicked away')
      this.showpopover = false
    }
  },
  created () {

  },
  destroyed () {

  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";

#file_manager {
  z-index: 2;
  overflow: auto;

  .actionbar {
    background: rgba(0, 0, 0, 0.2);
  }

  table {
    width: 100%;
    text-align: center;
    cursor: pointer;

    thead {
      background: rgba(0, 0, 0, 0.2);
      color: white;

      th {
        padding:5px;
      }

      th:first-child {
      }

      th:last-child {
      }

    }

    tbody {
      td {
        padding:5px;
      }

      tr {
      	background: rgba(0, 0, 0, 0.2);

        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }

      tr:nth-child(odd) td {
      }
    }
  }
}

</style>
