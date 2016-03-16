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
          <tr  v-for="file in files">
            <td> {{{file.type | fa_icon}}} </td>
            <td> {{file.filename}} </td>
            <td> {{file.size}} </td>
            <td> Q </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileManager',
  data () {
    return {
      msg: 'Hello World!',
      files: [
        { type: 'folder-o', filename: 'qq.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq.png', size: '25kb' },
        { type: 'folder-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' },
        { type: 'file-o', filename: 'qq.png', size: '25kb' }
      ]
    }
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
        .anim-fast;

        &:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }

      tr:nth-child(odd) td {
      }
    }
  }
}

</style>
