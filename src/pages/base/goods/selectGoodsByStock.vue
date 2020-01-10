<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    v-on:callGetInfo="callGetInfo"
    :height="height"
    @onDataBound="onDataBound"
    @getCheckInfo="getCheckInfo"
    ref="grid"
  ></grid>
</template>

<script>
import Grid from '@/components/grid'

export default {
  name: 'selectGoodsByStock',
  components: {Grid},
  data () {
    return {
      gridData: {},
      gridColumns: [
        {name: 'id', title: '产品编码', width: 120},
        {name: 'goodsName', title: '产品名称', width: 120},
        {name: 'goodsTypeName', title: '产品类型', width: 120},
        {name: 'goodsUnitName', title: '产品单位', width: 120},
        {name: 'goodsModel', title: '规格型号', width: 120},
        {name: 'normalPrice', title: '单价', width: 120, template: {type: 'inputNumber', prop: 'normalPrice'}},
        {name: 'stockAmount', title: '期初库存', width: 120, template: {type: 'inputNumber', prop: 'stockAmount'}}
      ],
      check: true,
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18,
        'dataBound': 'onDataBound'
      },
      height: 480
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
      this.$post('/base/goods/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    onDataBound () {
      if (document.getElementById('refresh') !== undefined && document.getElementById('refresh') !== null) {
        document.getElementById('refresh').remove()
      }
    },
    getCheckInfo () {
      console.log()
      const checkList = this.$refs.grid.checkedLists
      let chooseData = []
      let itemsData = {}
      checkList.forEach(function (item) {
        itemsData[item] = item
      })
      this.gridData.data.forEach(function (item) {
        if (itemsData[item.id] !== undefined) {
          chooseData.push(item)
        }
      })
      return chooseData
    }
  },
  mounted () {
    this.callGetInfo()
  }
}
</script>

<style scoped>

</style>
