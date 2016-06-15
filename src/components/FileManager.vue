<template>
  <div id = "file_manager" class = "proto_panel">
    <div class = "actionbar">
      <h1><span class = "name">{{project_name}}</span> Files</h1>
      <p>{{current_folder}}</p>
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
            <th> name </th>
            <th> size </th>
            <th> action </th>
          </tr>
        </thead>
        <tbody>
          <tr id = "back" v-on:click = "change_dir('..')">
            <td><i class = "fa fa-folder-o"></i></td>
            <td> .. </td>
            <td> </td>
            <td> </td>
          </tr>
          <tr id = "files" v-bind:class="{ 'selected': selected == $index }" v-for = "file in files" v-on:click = "showcontent($index, $event)">
            <td> {{{file.type | fa_icon}}} </td>
            <td> {{file.name}} </td>
            <td> {{file.size}} </td>
            <td> Q </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <popup arrow = "right" :posy = "posyel" v-if = "showpopover" v-on-clickaway = "qaway">
  {{{popup_content}}}
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
      popup_content: '',
      current_folder: '',
      project_name: '',
      files: [
        /*
        { type: 'folder-o', name: 'qq1.png', size: '25kb' },
        { type: 'folder-o', name: 'qq2.png', size: '25kb' },
        { type: 'folder-o', name: 'qq3.png', size: '25kb' },
        { type: 'folder-o', name: 'qq4.png', size: '25kb' },
        { type: 'folder-o', name: 'qq5.png', size: '25kb' },
        { type: 'file-o', name: 'qq.png', size: '25kb' },
        { type: 'file-o', name: 'qq.png', size: '25kb' },
        { type: 'file-o', name: 'qq.png', size: '25kb' },
        { type: 'file-o', name: 'qq.png', size: '25kb' },
        { type: 'file-o', name: 'qqm.png', size: '25kb' },
        { type: 'file-o', name: 'qqmm.png', size: '25kb' }
        */
      ]
    }
  },
  methods: {
    showcontent: function (i, e) {
      var selected_file = this.files[i]

      if (selected_file.isDir) {
        // we can change dir
        this.change_dir(selected_file.path)
      } else {
        console.log('qq')
        if (selected_file.name.endsWith('.png') ||
            selected_file.name.endsWith('.jpg') ||
            selected_file.name.endsWith('.jpeg')) {
          // we check if we preview or open in editor
          this.posyel = e.clientY
          this.selected = i
          var url = Store.get_url_for_current_project() + 'files/load/' + selected_file.name
          this.popup_content = '<img src=' + url + '/>'
          // console.log(url)
          this.showpopover = !this.showpopover
        } else if (selected_file.name.endsWith('.js')) {
          console.log('selected js ' + selected_file.name)
          Store.load_file(selected_file)
        }
      }
    },
    away: function () {
      console.log('you clicked away')
      this.showpopover = false
    },
    list_files: function () {
      // update object
      this.current_folder = Store.state.current_project.current_folder
      var files = Store.state.current_project.files
      this.project_name = Store.state.current_project.project.name
      Store.clearArray(this.files)

      files.sort(function (a, b) {
        return (b.isDir - a.isDir) || (a.name.toString().localeCompare(b.name))
      })

      for (var i in files) {
        this.files.push(files[i])
      }
    },
    change_dir: function (path) {
      console.log('changing dir ' + path)
      Store.list_files_in_path(path)
    }
  },
  ready () {
    console.log('ready')
    Store.on('project_files', this.list_files)

    // var fileselect = document.getElementById('fileselect')
    var filedrag = document.getElementById('file_manager')
    // var submitbutton = document.getElementById('submitbutton')

    // check if file d&d is supported
    if (window.File && window.FileList && window.FileReader && window.Blob) {
      // filedrag.style.display = 'block'
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
    text-align: left;
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
