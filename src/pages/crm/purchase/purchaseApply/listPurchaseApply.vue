<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    :command="command"
    :toolbar="toolbar"
    :commandWidth="commandWidth"
    @onDataBound="onDataBound"
    @auditInfo="auditInfo"
    @cancelAuditInfo="cancelAuditInfo"
    @pushDownInfo="pushDownInfo"
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
  name: 'listPurchaseApply',
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
        {name: 'id', title: '采购申请单号', width: 140},
        {name: 'vendorName', title: '供应商名称', width: 120},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'status', title: '订单状态', format: {dataSource: {}, textField: 'id', valueField: 'text'}, width: 120},
        {name: 'applyDate', title: '申请日期', width: 120},
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
        {
          name: 'opAudit',
          text: '<span class="el-icon-circle-check-outline"></span>',
          tooltip: '审核',
          click: 'auditInfo'
        },
        {name: 'opCancelAudit', text: '<span class="el-icon-sort"></span>', tooltip: '取消审核', click: 'cancelAuditInfo'},
        {name: 'opPushDown', text: '<span class="el-icon-download"></span>', tooltip: '下推采购订单', click: 'pushDownInfo'},
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
      commandWidth: 140
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
      this.$post('/crm/purchase/purchaseApply/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    getOrderStatus () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.purchase.PurchaseApplyStatusEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[3].format.dataSource = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/crm/purchase/purchaseApply/editPurchaseapply', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/crm/purchase/purchaseApply/editPurchaseapply')
    },
    deleteInfo (item) {
      this.$delete('/crm/purchase/purchaseApply/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    auditInfo (item) {
      this.$post('/crm/purchase/purchaseApply/auditById?ids=' + item.id, {})
        .then((res) => {
          if (res.status) {
            this.gridData = {}
            this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    },
    // 取消审核
    cancelAuditInfo (item) {
      this.$post('/crm/purchase/purchaseApply/cancelAuditById?ids=' + item.id, {})
        .then((res) => {
          if (res.status) {
            this.gridData = {}
            this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    },
    // 下推采购订单
    pushDownInfo (item) {
      this.$router.push({path: '/crm/purchase/purchaseApply/pushPurchaseOrder', query: {id: item.id}})
    },
    onDataBound () {
      if (Object.keys(this.gridData).length > 0) {
        this.gridData.data.forEach(function (item) {
          const status = parseInt(item.status)
          let opCancelAudit = document.getElementById('opCancelAudit' + item.id)
          let opPushDown = document.getElementById('opPushDown' + item.id)
          let opDelete = document.getElementById('opDelete' + item.id)
          let opAudit = document.getElementById('opAudit' + item.id)
          if (status === 10) {
            if (opCancelAudit !== null) {
              opCancelAudit.remove()
            }
            if (opPushDown !== null) {
              opPushDown.remove()
            }
          }
          if (status === 20) {
            if (opDelete !== null) {
              opDelete.remove()
            }
            if (opAudit !== null) {
              opAudit.remove()
            }
          }
          if (status === 30) {
            if (opDelete !== null) {
              opDelete.remove()
            }
            if (opAudit !== null) {
              opAudit.remove()
            }
            if (opCancelAudit !== null) {
              opCancelAudit.remove()
            }
          }
          if (status === 40) {
            if (opDelete !== null) {
              opDelete.remove()
            }
            if (opAudit !== null) {
              opAudit.remove()
            }
            if (opCancelAudit !== null) {
              opCancelAudit.remove()
            }
            if (opPushDown !== null) {
              opPushDown.remove()
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
