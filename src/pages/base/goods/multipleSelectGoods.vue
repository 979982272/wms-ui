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
  name: 'multipleSelectGoods',
  components: {Grid},
  props: {
    vendorId: String
  },
  data () {
    return {
      gridData: {},
      gridColumns: [
        {name: 'goodsId', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsTypeName', title: '产品类型', width: 120},
        {name: 'goodsUnitName', title: '产品单位', width: 120},
        {name: 'goodsBrandName', title: '品牌', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'normalPrice', title: '供应价格', width: 120},
        {name: 'goodsBarcode', title: '条形码', width: 120},
        {name: 'sapCode', title: 'sap物料编码', width: 120}
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
      this.$post('/base/vendorGoods/loadData?vendorId=' + this.vendorId, param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
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
    if (this.vendorId !== undefined) {
      this.callGetInfo(this.vendorId)
    }
  },
  watch: {
    'vendorId' (a, b) {
      this.callGetInfo(this.vendorId)
    }
  }
}
</script>

<style scoped>

</style>
