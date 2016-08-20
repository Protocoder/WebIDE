<template>
  <div id = "file_manager"
    class = "proto_panel"
    >
      <div class = "wrapper">
      <div class = "actionbar">
        <h1>Files</h1>
        <p>{{current_folder}}</p>
        <ul>
          <!-- <li class="fa fa-folder" for = "get_file"></li> -->
          <li class="fa fa-upload" for = "get_file" v-on:click = "show_upload_dialog"></li>
        </ul>
        <div id = "upload_container" v-bind:class = "{'show' : isDnd, 'todrop': isReadyToDrop }">
          <p>Drop the files here</p>
          <input id = "upload" type = "file" _change = "onFileChange" multiple = "">
        </div>
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
      <div id = "uploading" v-show = "showUploadingFiles">
        <h1> uploading... </h1>
        <ul>
          <li v-for = "u in uploadingFiles" v-show = "u.uploading">
            {{u.data.name}} {{u.uploading}}
            <div class = "progress pre"></div>
            <div class = "progress"></div>
          </li>
        </ul>
      </div>
    </div>
    <popup arrow = "right" :posx = "posx" :posy = "posy" v-if = "showpopover">
    {{{popup_content}}}
    </popup>
  </div>
</template>

<script>
import Store from '../Store'
import Popup from './views/Popup'

export default {
  name: 'FileManager',
  components: {
    Store,
    Popup
  },
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
        */
      ],
      uploadingFiles: [
      ],
      showUploadingFiles: false,
      isDnd: false,
      isReadyToDrop: false,
      dndState: 'none',
      posx: 0,
      posy: 0,
      input: null
    }
  },
  methods: {
    showcontent: function (i, e) {
      var selected_file = this.files[i]

      // change directories
      if (selected_file.isDir) {
        this.change_dir(selected_file.path)
      // preview file
      } else if (selected_file.name.toLowerCase().endsWith('.png') ||
            selected_file.name.toLowerCase().endsWith('.jpg') ||
            selected_file.name.toLowerCase().endsWith('.jpeg')) {
        // we check if we preview or open in editor
        // console.log(e)
        this.posx = e.clientX - 300 + 'px'
        this.posy = e.target.offsetTop + 22 + 'px'
        this.selected = i
        var url = Store.get_url_for_current_project() + 'files/load/' + selected_file.name
        this.popup_content = '<img src=' + url + '/>'
        // console.log(url)
        this.showpopover = !this.showpopover
      // try to open file
      } else { // if (selected_file.name.endsWith('.js')) {
        console.log('opening file ' + selected_file.name)
        Store.load_file(selected_file)
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
    },
    show_upload_dialog: function (e) {
      this.input.click()
    },
    /* file upload */
    onFileChange: function (e) {
      this.showUploadingFiles = true
      var files = e.target.files || e.dataTransfer.files
      // console.log(this.uploadingFiles)

      // clean uploading files
      // Store.clearArray(this.uploadingFiles)

      // send
      for (var i = 0; i < files.length; i++) {
        // console.log(files[i].name + ' ' + files[i].size + ' ' + files[i].type)
        this.uploadingFiles.push({data: files[i], uploading: true})
        Store.upload_file(this.uploadingFiles[i])
      }
      // if (!files.length) return
      // this.createImage(files[0])
    },
    file_uploaded: function (name) {
      var uploading = false

      for (var i = 0; i < this.uploadingFiles.length; i++) {
        if (this.uploadingFiles[i].data.name === name) {
          // console.log(name + ' is uploaded')
          // console.log(this.uploadingFiles)
          // console.log(typeof (this.uploadingFiles))
          this.uploadingFiles[i].uploading = false
        }
        uploading = uploading || this.uploadingFiles[i].uploading
        // console.log(this.uploadingFiles[i].uploading)
        this.uploadingFiles.splice(i, 1) // remove item
      }

      // console.log(this.uploadingFiles)
      if (!uploading) {
        this.showUploadingFiles = false
        Store.list_files_in_path('')
      }
    }
  },
  ready () {
    // console.log('ready')
    Store.on('project_files', this.list_files)
    Store.on('file_uploaded', this.file_uploaded)

    var that = this
    var firstTarget

    this.$el.ondrop = function (e) {
      // upload
      that.showUploadingFiles = true

      that.onFileChange(e)
      that.isDnd = false
      that.isReadyToDrop = false
      e.preventDefault()
    }

    document.addEventListener('dragenter', function (e) {
      firstTarget = e.target
      // console.log('dragenter ', e)
      that.isDnd = true
      // e.stopPropagation()
      e.preventDefault()
    })

    document.addEventListener('dragover', function (e) {
      e.target.effectAllowed = true
    })

    document.addEventListener('dragover', function (e) {
      // console.log('dragover')
      // console.log('dragover -->' + e.target.id)
      if (e.target.id === 'upload') {
        // console.log('yeah!')
        e.dataTransfer.dropEffect = 'copy'
        that.isReadyToDrop = true
        that.showUploadingFiles = true
      }
      // e.stopPropagation()
      e.preventDefault()
    }, false)

    document.addEventListener('dragleave', function (e) {
      if (firstTarget === e.target) {
        // console.log('dragleave')
        that.isDnd = false
        that.isReadyToDrop = false
        // e.stopPropagation()
        e.preventDefault()
      } else if (e.target.id === 'upload') {
        that.isReadyToDrop = false
      }
    })

    document.addEventListener('dragcancel', function (e) {
      if (firstTarget === e.target) {
        // console.log('dragcancel')
        that.isDnd = false
        that.isReadyToDrop = false
        e.stopPropagation()
        e.preventDefault()
      }
    })

    this.input = this.$el.querySelector('#upload')
  },
  created () {

  },
  destroyed () {
    document.removeEventListener('dragover')
    document.removeEventListener('dragleave')
    document.removeEventListener('dragcancel')
  }
}
</script>

<style lang='less'>
@import "../assets/css/variables.less";


#file_manager {
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);
  height: 150px;
  position: relative;

  &.hovered {
    border: 2px solid red;
    background: tomato;

    input {
      display: block;
    }
  }

  #upload_container {
    display: none;
    background: fadeout(@primaryAccent, 20%);
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &.show {
      display: flex;
      align-items: center;
      font-size: 2em;
    }

    &.todrop {
      background: red;
    }

    p {
      text-align: center;
      width: 100%;
    }

    input {
      cursor: pointer;
      position: absolute;
      top: 0px;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  table {
    width: 100%;
    text-align: left;
    cursor: pointer;

    thead {
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
      font-size: 0.8em;

      th {
        padding: 0px 5px 12px 5px;
      }

      th:first-child {
      }

      th:last-child {
      }

    }

    tbody {
      font-size: 0.8em;
      td {
        padding:0.5em;
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

  #uploading {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    top: 0;
    font-size: 0.8em;
    font-weight: 500;
    font-family: 'Open Sans';
    box-sizing: content-box;
    vertical-align: middle;
    display: flex;
    align-items: center;

    h1 {
      position: absolute;
      top: 0;
      right: 0;
      padding: 8px;
    }

    ul {
      list-style: none;
      width: 100%;
      padding: 8px 22px;
      li {
        position: relative;
        width: 100%;
        padding: 0.7em 0px;
      }
    }

    .progress {
      position: absolute;
      background: #ffeb00;
      height: 2px;
      width: 100%;
      border-radius: 2px;
      margin-top: 3px;
    }

    .pre {
      background: gray;
      width: 100%;
    }

  }
}

</style>
