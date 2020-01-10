<template>
  <div>
    <grid
      :data="gridData"
      :columns="gridColumns"
      :check="check"
      :requestInfo="requestInfo"
      :command="command"
      :toolbar="toolbar"
      v-on:callGetInfo="callGetInfo"
      v-on:editInfo="editInfo"
      v-on:create="create"
      v-on:deleteInfo="deleteInfo"
      ref="grid"
    >
    </grid>
    <el-dialog title="编辑产品单位" :visible.sync="dialogVisible" @close="closeDialog">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-dialog>
  </div>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listGoodsUnit',
  data () {
    return {
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18,
        // 数据初始化完成后的回调
        'dataBound': 'onDataBound'
      },
      // 列信息
      gridColumns: [
        {name: 'id', title: '单位编号', width: 0},
        {name: 'unitName', title: '单位名称', width: 0},
        {name: 'remark', title: '备注', tooltip: true, width: 0},
        {name: 'createTime', title: '创建时间', width: 0},
        {name: 'createEmp', title: '创建人', width: 0},
        {name: 'modifyTime', title: '修改时间', width: 0},
        {name: 'modifyEmp', title: '修改人', width: 0}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'},
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'}
      ],
      // 自定义事件回调方法
      callMethods: {'editInfo': 'editInfo'},
      // 是否显示复选框
      check: true,
      // 上方工具条
      toolbar: [
        {name: 'opCreate', text: '新建', click: 'create', type: 'primary'}
      ],
      dialogVisible: false
    }
  },
  methods: {
    callGetInfo (page, filter) {
      const param = {}
      if (page === undefined) {
        page = 1
      }
      param['page'] = page
      param['pageSize'] = this.requestInfo.pageSize
      param['filter'] = filter
      this.$post('/base/goodsUnit/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.dialogVisible = true
      this.$router.push({path: '/base/goodsUnit/editGoodsUnit', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.dialogVisible = true
      this.$router.push('/base/goodsUnit/editGoodsUnit')
    },
    deleteInfo (item) {
      this.$delete('/base/goodsUnit/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    closeDialog () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
