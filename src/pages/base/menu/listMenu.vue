<template>
  <div>
    <tree-table :list.sync="gridData"
                :gridColumns="gridColumns"
                :command="command"
                :toolbar="toolbar"
                @createInfo="createInfo"
                @create="create"
                @handlerExpand="handlerExpand"
                @editInfo="editInfo"
                @deleteInfo="deleteInfo"
                @callGetInfo="callGetInfo"
    ></tree-table>
    <el-dialog title="编辑菜单" :visible.sync="dialogVisible" @close="closeDialog">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-dialog>
  </div>
</template>

<script>

import Grid from '@/components/grid'
import TreeTable from '@/components/tree-table'

export default {
  components: {TreeTable, Grid},
  name: 'listMenu',
  data () {
    return {
      // 列信息
      gridColumns: [
        {name: 'text', title: '文本', width: 140},
        {name: 'url', title: '地址', width: 140},
        {name: 'icon', title: '图标', width: 140},
        {name: 'remark', title: '备注', width: 140}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'},
        {name: 'opAdd', text: '<span class="el-icon-plus"></span>', tooltip: '添加下级', click: 'createInfo'},
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'}
      ],
      // 上方工具条
      toolbar: [
        {name: 'opCreate', text: '新建', click: 'create', type: 'primary'}
      ],
      dialogVisible: false
    }
  },
  methods: {
    callGetInfo (page, filter) {
      this.$post('/base/menu/loadAllDataByChildren', {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.dialogVisible = true
      this.$router.push({path: '/base/menu/editMenu', query: {id: item.id}})
    },
    createInfo (item) {
      this.dialogVisible = true
      this.$router.push({path: '/base/menu/editMenu', query: {parentId: item.id, level: item.level + 1}})
    },
    create (checkedInfo) {
      this.dialogVisible = true
      this.$router.push('/base/menu/editMenu')
    },
    deleteInfo (item) {
      this.$delete('/base/menu/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(1, {})
        }
      })
    },
    closeDialog () {
      this.$router.go(-1)
    },
    handlerExpand (item) {
      item.isExpand = !item.isExpand
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
