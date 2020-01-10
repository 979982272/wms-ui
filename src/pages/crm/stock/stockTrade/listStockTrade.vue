<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :requestInfo="requestInfo"
    v-on:callGetInfo="callGetInfo"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listStockTrade',
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
        {
          name: 'tradeType',
          title: '交易类型',
          width: 120,
          format: {
            dataSource: [],
            valueField: 'text',
            textField: 'id'
          }
        },
        {name: 'tradeTime', title: '库存交易时间', width: 120},
        {name: 'warehouseId', title: '仓库编码', width: 120},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsUnitName', title: '单位名称', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'formOrder', title: '来源单号', width: 140},
        {name: 'tradeAmount', title: '交易数量', width: 120},
        {name: 'unitPrice', title: '单位价格', width: 120},
        {name: 'unitPriceRate', title: '含税单价', width: 120},
        {name: 'totalPrice', title: '总金额', width: 120},
        {name: 'totalPriceRate', title: '含税总金额', width: 120}
      ],
      // 列数据
      gridData: {}
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
      this.$post('/crm/stock/stockTrade/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    getTradeTypeDataSource () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.stock.StockTradeTypeEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          this.gridColumns[0].format.dataSource = res
        })
    }
  },
  mounted () {
    this.callGetInfo(1)
    this.getTradeTypeDataSource()
  }
}
</script>
<style scoped lang="stylus">

</style>
