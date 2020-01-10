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
  name: 'listStockPart',
  data () {
    return {
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18
      },
      // 列信息
      gridColumns: [
        {name: 'warehouseId', title: '仓库编码', width: 120},
        {name: 'warehouseName', title: '仓库名称', width: 120},
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsUnitName', title: '单位名称', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'totalStockAmount', title: '总库存', width: 120},
        {name: 'stockAmount', title: '可用库存', width: 120},
        {name: 'inStockAmount', title: '入库库存', width: 120},
        {name: 'lockStockAmount', title: '锁定库存', width: 120},
        {name: 'unitCostPrice', title: '单位成本', width: 120},
        {name: 'unitCostPriceRate', title: '含税单位成本', width: 120},
        {name: 'totalCostPrice', title: '总成本', width: 120},
        {name: 'totalCostPriceRate', title: '含税总成本', width: 120}
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
      this.$post('/crm/stock/stockPart/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
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
