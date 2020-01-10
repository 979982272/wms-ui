<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    :toolbar="toolbar"
    @addGoodsInfo="addGoodsInfo"
    v-on:callGetInfo="callGetInfo"
    :width="width"
    :height="height"
    ref="grid"
  ></grid>
</template>

<script>
import Grid from '@/components/grid'

export default {
  name: 'multipleSelectGoodsByStock',
  components: {Grid},
  props: {
    warehouseId: String
  },
  data () {
    return {
      gridData: {},
      gridColumns: [
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'stockAmount', title: '可用库存', width: 120},
        {name: 'goods.normalPrice', title: '标准零售价', width: 120},
        {name: 'unitCostPriceRate', title: '库存成本', width: 120},
        {name: 'goods.goodsTypeName', title: '产品类型', width: 120},
        {name: 'goods.goodsUnitName', title: '产品单位', width: 120},
        {name: 'goods.goodsBrandName', title: '品牌', width: 120},
        {name: 'goods.goodsModel', title: '规格型号', width: 120}
      ],
      check: true,
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18
      },
      // 上方工具条
      toolbar: [
        {name: 'opCreate', text: '添加', click: 'addGoodsInfo', type: 'primary'}
      ],
      width: 1000,
      height: 500
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
      this.$post('/crm/stock/stockPart/loadSelectGoodsData?warehouseId=' + this.warehouseId, param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          console.log(res)
          this.gridData = res
        })
    },
    addGoodsInfo (items) {
      if (items.length <= 0) {
        this.$errorMsg('请勾选需要保存的商品!')
        return false
      }
      let chooseData = []
      let itemsData = {}
      items.forEach(function (item) {
        itemsData[item] = item
      })
      this.gridData.data.forEach(function (item) {
        if (itemsData[item.id] !== undefined) {
          chooseData.push(item)
        }
      })
      this.$emit('closeDialog', chooseData)
    }
  },
  mounted () {
    if (this.warehouseId !== undefined) {
      this.callGetInfo()
    }
  },
  watch: {
    'warehouseId' (a, b) {
      this.callGetInfo()
    }
  }
}
</script>

<style scoped>

</style>
