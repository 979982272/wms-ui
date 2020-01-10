<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    :command="command"
    :toolbar="toolbar"
    @onDataBound="onDataBound"
    @auditInfo="auditInfo"
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
  name: 'listPurchaseOrder',
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
        {name: 'id', title: '采购订单单号', width: 150},
        {name: 'fromOrder', title: '来源单号', width: 150},
        {name: 'vendorName', title: '供应商名称', width: 120},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'status', title: '订单状态', width: 120, format: {dataSource: {}, textField: 'id', valueField: 'text'}},
        {name: 'orderDate', title: '订单日期', width: 120},
        {name: 'arrivalDate', title: '到货日期', width: 120},
        {name: 'remark', title: '备注', width: 120},
        {name: 'createTime', title: '创建时间', width: 120},
        {name: 'createEmp', title: '创建人', width: 120},
        {name: 'modifyTime', title: '修改时间', width: 120},
        {name: 'modifyEmp', title: '修改人', width: 120},
        {name: 'auditTime', title: '审核时间', width: 120},
        {name: 'auditEmp', title: '审核人', width: 120}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'},
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'},
        {name: 'opAudit', text: '<span class="el-icon-check"></span>', tooltip: '审核', click: 'auditInfo'}
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
      this.$post('/crm/purchase/purchaseOrder/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/crm/purchase/purchaseOrder/editPurchaseorder', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/crm/purchase/purchaseOrder/editPurchaseorder')
    },
    deleteInfo (item) {
      this.$delete('/crm/purchase/purchaseOrder/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    auditInfo (item) {
      this.$post('/crm/purchase/purchaseOrder/auditById?ids=' + item.id, {})
        .then((res) => {
          if (res.status) {
            this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    },
    getOrderStatus () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.purchase.PurchaseOrderStatusEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[4].format.dataSource = res
        })
    },
    onDataBound () {
      if (Object.keys(this.gridData).length > 0) {
        this.gridData.data.forEach(function (item) {
          const status = parseInt(item.status)
          if (status >= 20) {
            let opDelete = document.getElementById('opDelete' + item.id)
            if (opDelete !== null) {
              opDelete.remove()
            }
            let opAudit = document.getElementById('opAudit' + item.id)
            if (opAudit !== null) {
              opAudit.remove()
            }
          }
        })
      }
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
