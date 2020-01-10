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
  name: 'listStockBegin',
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
        {name: 'id', title: '期初编号', width: 140},
        {name: 'status', title: '状态', width: 120, format: {dataSource: {}, textField: 'id', valueField: 'text'}},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsUnitId', title: '单位编码', width: 120},
        {name: 'goodsUnitName', title: '单位名称', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'stockAmount', title: '期初库存', width: 120},
        {name: 'unitPrice', title: '单位价格', width: 120},
        {name: 'unitPriceRate', title: '含税单价', width: 120},
        {name: 'totalPrice', title: '总价', width: 120},
        {name: 'totalPriceRate', title: '含税总价', width: 120},
        {name: 'ratePrice', title: '税金总额', width: 120},
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
      this.$post('/crm/stock/stockBegin/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/crm/stock/stockBegin/editStockbegin', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/crm/stock/stockBegin/editStockbegin')
    },
    deleteInfo (item) {
      this.$delete('/crm/stock/stockBegin/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    getOrderStatus () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.OrderStatusEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[1].format.dataSource = res
        })
    },
    auditInfo (item) {
      this.$post('/crm/stock/stockBegin/auditStockBegin?ids=' + item.id, {})
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
          if (status === 20) {
            if (opDelete !== null) {
              opDelete.remove()
            }
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
