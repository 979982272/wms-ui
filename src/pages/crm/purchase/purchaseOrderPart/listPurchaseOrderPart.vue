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
  name: 'listPurchaseOrderPart',
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
        {name: 'purchaseOrderId', title: '采购订单号', width: 160},
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsUnitName', title: '单位名称', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'purchaseAmount', title: '申请数量', width: 120},
        {name: 'receivingAmount', title: '收货数量', width: 120},
        {name: 'unitPrice', title: '单位价格', width: 120},
        {name: 'unitPriceRate', title: '含税单价', width: 120},
        {name: 'totalPrice', title: '总价', width: 120},
        {name: 'totalPriceRate', title: '含税总价', width: 120},
        {name: 'remark', title: '备注', width: 120}
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
      this.$post('/crm/purchase/purchaseOrderPart/loadData', param, {headers: {'Content-Type': 'application/json'}})
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
