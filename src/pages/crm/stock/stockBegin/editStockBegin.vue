<template>
  <div>
    <edit-form
      :tool-bar="toolBar"
      :form-info="formInfo"
      :model-data="modelData"
      :columns="columns"
      v-on:saveEditInfo="saveEditInfo"
      v-on:warehouseChange='warehouseChange'
      ref="editform"
    >
    </edit-form>
    <select-goods-by-stock ref="selectGoodsByStock">
    </select-goods-by-stock>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import SelectGoodsByStock from '../../../base/goods/selectGoodsByStock'
import Qs from 'qs'

export default {
  components: {SelectGoodsByStock, EditForm},
  name: 'editStockBegin',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {
          label: '仓库编码',
          prop: 'warehouseId',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'warehouseChange'
        }
      ],
      formInfo: {formName: 'modelData'},
      modelData: {warehouseId: ''},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/crm/stock/stockBegin/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          const checkInfo = this.$refs.selectGoodsByStock.getCheckInfo()
          let goodsIds = []
          let goodsPrice = []
          let stockAmounts = []
          let isSave = true
          checkInfo.forEach((dataItem, index) => {
            console.log(dataItem)
            const stockAmount = dataItem.stockAmount
            const normalPrice = dataItem.normalPrice
            if (normalPrice === undefined || normalPrice === '') {
              this.$errorMsg('请输入第【' + (index + 1) + '】行中的产品单价!')
              isSave = false
              return false
            }
            if (stockAmount === undefined || stockAmount === '') {
              this.$errorMsg('请输入第【' + (index + 1) + '】行中的期初库存数量!')
              isSave = false
              return false
            }
            goodsIds.push(dataItem.id)
            goodsPrice.push(normalPrice)
            stockAmounts.push(stockAmount)
          })
          if (isSave) {
            goodsIds = goodsIds.join(',')
            goodsPrice = goodsPrice.join(',')
            stockAmounts = stockAmounts.join(',')
            var data = {}
            data['goodsIds'] = goodsIds
            data['goodsPrice'] = goodsPrice
            data['stockAmounts'] = stockAmounts
            data['warehouseId'] = this.modelData['warehouseId']
            data = Qs.stringify(JSON.parse(JSON.stringify(data)))
            this.$post('/crm/stock/stockBegin/saveStockBegin', data, {
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
              dataType: 'json'
            })
              .then((res) => {
                if (res.status) {
                  this.$successMsg(res.msg)
                  this.op = 'update'
                } else {
                  this.$errorMsg(res.msg)
                }
              })
          }
        }
      })
    },
    warehouseChange (text, vue) {

    },
    getAutocompletDataSourceByWarehouseId () {
      this.$post('/base/warehouse/findWarehouseCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[0].dataSource = res
        })
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
    this.getAutocompletDataSourceByWarehouseId()
  }
}
</script>

<style scoped lang="stylus">
</style>
