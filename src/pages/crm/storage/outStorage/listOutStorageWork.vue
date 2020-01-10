<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :requestInfo="requestInfo"
    :command="command"
    v-on:callGetInfo="callGetInfo"
    v-on:editInfo="editInfo"
    @inStorage="inStorage"
    @onDataBound="onDataBound"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listOutStorageWork',
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
        {name: 'id', title: '出库单号', width: 140},
        {name: 'fromOrder', title: '来源单号', width: 140},
        {name: 'status', title: '订单状态', width: 120, format: {dataSource: {}, textField: 'id', valueField: 'text'}},
        {name: 'orderType', title: '订单类型', width: 120, format: {dataSource: {}, textField: 'id', valueField: 'text'}},
        {name: 'orderDate', title: '订单日期', width: 120},
        {name: 'customerId', title: '客户编码', width: 120},
        {name: 'customerName', title: '客户名称', width: 120},
        {name: 'warehouseId', title: '仓库编码', width: 120},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'remark', title: '备注', width: 120}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-view"></span>', tooltip: '查看', click: 'editInfo'},
        {name: 'opInStorage', text: '<span class="el-icon-upload2"></span>', tooltip: '出库', click: 'inStorage'}
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
      this.$post('/crm/outStorage/outStorageWork/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/crm/storage/outStorage/editOutStorageWork', query: {id: item.id}})
    },
    inStorage (item) {
      this.$post('/crm/outStorage/outStorageWork/outStorageByStorageId?ids=' + item.id, {})
        .then((res) => {
          if (res.status) {
            this.gridData = {}
            this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
            this.$successMsg(res.msg)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    },
    getOrderStatus () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.storage.StorageStatusEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[2].format.dataSource = res
        })
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.OrderTypeEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[3].format.dataSource = res
        })
    },
    onDataBound () {
      if (Object.keys(this.gridData).length > 0) {
        this.gridData.data.forEach(function (item) {
          const status = parseInt(item.status)
          let opInStorage = document.getElementById('opInStorage' + item.id)
          if (status >= 40) {
            if (opInStorage !== null) {
              opInStorage.remove()
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
