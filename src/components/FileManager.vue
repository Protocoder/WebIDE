<template>
  <div id = "file_manager" class = "proto_panel">
    <div class = "actionbar">
      <h1><span class = "filename">Hello World</span> Files</h1>
      <ul>
        <li class="fa fa-folder"></li>
      </ul>

      <!--
      <div id = "drag_overlay"><i class = "fa fa-download fa-5x"></i></div>

      <div>
        <form id="upload" action="index.html" method="POST" enctype="multipart/form-data">
        <fieldset>
          <legend>HTML File Upload</legend>
          <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="300000" />
          <div>
            <label for="fileselect">Files to upload:</label>
            <input type="file" id="fileselect" name="fileselect[]" multiple="multiple" />
            <div id="filedrag">or drop files here</div>
          </div>
          <div id="submitbutton">
            <button type="submit">Upload Files</button>
          </div>
        </fieldset>
        </form>
      </div>
      -->

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
          <tr id = "files" v-bind:class="{ 'selected': selected == $index }" v-for = "file in files" v-on:click = "showcontent($index, $event)">
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
      qq: true,
      selected: -1,
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
        { type: 'file-o', filename: 'qqm.png', size: '25kb' },
        { type: 'file-o', filename: 'qqmm.png', size: '25kb' }
      ]
    }
  },
  methods: {
    showcontent: function (i, e) {
      this.posyel = e.clientY
      this.selected = i
      this.showpopover = !this.showpopover
    },
    away: function () {
      console.log('you clicked away')
      this.showpopover = false
    }
  },
  ready () {
    console.log('ready')
    // var fileselect = document.getElementById('fileselect')
    var filedrag = document.getElementById('file_manager')
    // var submitbutton = document.getElementById('submitbutton')

    console.log(filedrag)

    // check if file d&d is supported
    if (window.File && window.FileList && window.FileReader && window.Blob) {
      // filedrag.style.display = 'block'
      console.log('qq')
      filedrag.addEventListener('dragover', function (e) {
        console.log('dragover')
        e.stopPropagation()
        e.preventDefault()
        e.target.className = 'dragover'
        // filedrag.className = 'dragover'
        e.dataTransfer.dropEffect = 'copy'
      }, false)

      /*
      filedrag.addEventListener('dragleave', function (e) {
        console.log('dragleave')
        e.stopPropagation()
        e.preventDefault()
        // e.target.className = ''
      }, false)
      */
      filedrag.addEventListener('drop', function (e) {
        e.stopPropagation()
        e.preventDefault()
        var files = e.dataTransfer.files
        var file = files[0]
        console.log(file)
        window.alert(file.name + ' ' + file.size + ' ' + file.type)
      }, false)
      /*
      filedrag.addEventListener('dragend', function () {
        console.log('dragend')
      }, false)
      filedrag.addEventListener('dragover', function () {
        console.log('dragover')
      }, false)
      filedrag.addEventListener('dragexit', function () {
        console.log('dragexit')
      }, false)
      */
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


&.dragover {
  border: 2px solid red;
  background: red;
}

#file_manager {
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);

  .actionbar {
    
  }

  table {
    width: 100%;
    text-align: center;
    cursor: pointer;

    thead {
      color: rgba(255, 255, 255, 0.5);

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
        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        &.selected {
          background: white;
          color: black;
        }
      }

      tr:nth-child(odd) td {
      }
    }
  }
}

</style>
