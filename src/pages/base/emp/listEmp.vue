<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    :command="command"
    :toolbar="toolbar"
    @reSetPassword="reSetPassword"
    v-on:callGetInfo="callGetInfo"
    v-on:editInfo="editInfo"
    v-on:create="create"
    v-on:deleteInfo="deleteInfo"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listEmp',
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
        {name: 'id', title: '编号', width: 140},
        {name: 'username', title: '姓名', width: 140},
        {
          name: 'sex',
          title: '性别',
          width: 140,
          format: {
            dataSource: [{value: '男', text: '1'}, {value: '女', text: '0'}],
            valueField: 'value',
            textField: 'text'
          }
        },
        {name: 'department', title: '所属机构', width: 140},
        {name: 'superior', title: '上司', width: 140},
        {name: 'post', title: '职务', width: 140},
        {name: 'title', title: '职称', tooltip: true, width: 140},
        {name: 'phone', title: '电话', width: 140},
        {name: 'email', title: '邮箱', width: 140},
        {name: 'birth', title: '出生日期', width: 140},
        {name: 'enrollment', title: '入职日期', width: 140},
        {name: 'resign', title: '离职日期', width: 140},
        {name: 'contract', title: '合同到期日期', width: 140},
        {name: 'createtime', title: '创建日期', width: 140},
        {name: 'createEmp', title: '创建人', width: 140},
        {name: 'modifytime', title: '修改日期', width: 140},
        {name: 'modifyEmp', title: '修改人', width: 140}
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
        {name: 'opCreate', text: '新建', click: 'create', type: 'primary'},
        {name: 'opReSetPassword', text: '重置密码', click: 'reSetPassword', type: 'warning'}
      ]
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
      this.$post('/base/emp/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/base/emp/editEmp', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/base/emp/editEmp')
    },
    deleteInfo (item) {
      this.$delete('/base/emp/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    reSetPassword (checkedInfo) {
      if (checkedInfo.length <= 0) {
        this.$errorMsg('请勾选需要操作的数据')
        return false
      }
      this.$post('/base/emp/reSetPassword?ids=' + checkedInfo, {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.$successMsg('操作成功')
        })
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
