<template>
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
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listCustomer',
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
        {name: 'id', title: '客户编码', width: 120},
        {name: 'customerName', title: '客户名称', width: 120},
        {name: 'customerType', title: '客户类型', width: 120},
        {name: 'customerEmpName', title: '客户负责人', width: 120},
        {name: 'salesType', title: '销售方式', width: 120},
        {name: 'customerLevel', title: '客户级别', width: 120},
        {name: 'receivableAmount', title: '应收金额', width: 120},
        {name: 'country', title: '国家', width: 120},
        {name: 'province', title: '省份', width: 120},
        {name: 'city', title: '城市', width: 120},
        {name: 'postCode', title: '邮编', width: 120},
        {name: 'address', title: '地址', width: 120},
        {name: 'contactPerson', title: '联系人', width: 120},
        {name: 'contactPhone', title: '联系电话', width: 120},
        {name: 'contactFax', title: '传真', width: 120},
        {name: 'contactEmail', title: '邮件', width: 120},
        {name: 'legalPerson', title: '法人', width: 120},
        {name: 'businessLicense', title: '营业执照', width: 120},
        {name: 'taxationCode', title: '税务登记号', width: 120},
        {name: 'openingBank', title: '开户行', width: 120},
        {name: 'openingBankAccount', title: '开户账号', width: 120},
        {name: 'remark', title: '备注', width: 120},
        {name: 'createTime', title: '创建时间', width: 120},
        {name: 'createEmp', title: '创建人', width: 120},
        {name: 'modifyTime', title: '修改时间', width: 120},
        {name: 'modifyEmp', title: '修改人', width: 120}
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
      this.$post('/base/customer/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/base/customer/editCustomer', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/base/customer/editCustomer')
    },
    deleteInfo (item) {
      this.$delete('/base/customer/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
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
