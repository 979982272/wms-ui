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
    @auditInfo="auditInfo"
    @onDataBound="onDataBound"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listSalesOrder',
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
        {name: 'id', title: '销售订单主键', width: 140},
        {name: 'customerId', title: '客户编码', width: 120},
        {name: 'customerName', title: '客户名称', width: 120},
        {name: 'status', title: '订单状态', width: 120, format: {dataSource: {}, textField: 'id', valueField: 'text'}},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'orderDate', title: '订单日期', width: 120},
        {name: 'deliveryDate', title: '申请发货日期', width: 120},
        {name: 'receipt', title: '发票号', width: 120},
        {name: 'remark', title: '备注', width: 120},
        {name: 'address', title: '收货地址', width: 120},
        {name: 'person', title: '联系人', width: 120},
        {name: 'phone', title: '联系电话', width: 120}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'},
        {
          name: 'opAudit',
          text: '<span class="el-icon-circle-check-outline"></span>',
          tooltip: '审核',
          click: 'auditInfo'
        },
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
      this.$post('/crm/sales/salesOrder/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/crm/sales/salesOrder/editSalesorder', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/crm/sales/salesOrder/editSalesorder')
    },
    deleteInfo (item) {
      this.$delete('/crm/sales/salesOrder/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    auditInfo (item) {
      this.$post('/crm/sales/salesOrder/' + item.id + '/auditById', {})
        .then((res) => {
          if (res.status) {
            this.gridData = {}
            this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    },
    onDataBound () {
      if (Object.keys(this.gridData).length > 0) {
        this.gridData.data.forEach(function (item) {
          const status = parseInt(item.status)
          let opDelete = document.getElementById('opDelete' + item.id)
          let opAudit = document.getElementById('opAudit' + item.id)
          if (status >= 20) {
            if (opDelete !== null) {
              opDelete.remove()
            }
            if (opAudit !== null) {
              opAudit.remove()
            }
          }
        })
      }
    },
    getOrderStatus () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.sales.SalesOrderStatusEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[3].format.dataSource = res
        })
    }
  },
  mounted () {
    this.callGetInfo(1)
    this.getOrderStatus()
  }
}
</script>
<style scoped lang="stylus">

</style>
