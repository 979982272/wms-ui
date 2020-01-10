<template>
  <edit-form
    :tool-bar="toolBar"
    :form-info="formInfo"
    :model-data="modelData"
    :columns="columns"
    @changeGoodsType="changeGoodsType"
    @changeGoodsUnit="changeGoodsUnit"
    @changeGoodsBrand="changeGoodsBrand"
    v-on:saveEditInfo="saveEditInfo"
    ref="editform"
  >
  </edit-form>
</template>

<script>
import EditForm from '@/components/editForm'

export default {
  components: {EditForm},
  name: 'editGoods',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '产品编码', prop: 'id', required: true, type: 'input'},
        {label: '产品名称', prop: 'goodsName', required: true, type: 'input'},
        {
          label: '产品类型',
          prop: 'goodsType',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'changeGoodsType'
        },
        {
          label: '产品单位',
          prop: 'goodsUnit',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'changeGoodsUnit'
        },
        {
          label: '品牌',
          prop: 'goodsBrand',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'changeGoodsBrand'
        },
        {label: '规格型号', prop: 'goodsModel', type: 'input'},
        {label: '条形码', prop: 'goodsBarcode', type: 'input'},
        {label: 'sap物料编码', prop: 'sapCode', type: 'input'},
        {label: '标准价格', prop: 'normalPrice', type: 'inputNumber'},
        {label: '税率', prop: 'rate', type: 'inputNumber'},
        {label: '采购参考价', prop: 'purchasePrice', type: 'inputNumber'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {'goodsType': '', 'goodsUnit': '', 'goodsBrand': ''},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/goods/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/goods/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
            .then((res) => {
              if (res.status) {
                this.$successMsg(res.msg)
                this.modelData = res.other.entity
                this.op = 'update'
              } else {
                this.$errorMsg(res.msg)
              }
            })
        }
      })
    },
    changeGoodsType (text, value) {
      this.modelData['goodsTypeName'] = value
    },
    getAutocompletDataSourceGoodsType () {
      this.$post('/base/goodsType/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[2].dataSource = res
        })
    },
    changeGoodsUnit (text, value) {
      this.modelData['goodsUnitName'] = value
    },
    getAutocompletDataSourceByGoodsUnit () {
      this.$post('/base/goodsUnit/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[3].dataSource = res
        })
    },
    changeGoodsBrand (text, value) {
      this.modelData['goodsBrandName'] = value
    },
    getAutocompletDataSourceByGoodsBrand () {
      this.$post('/base/goodsBrand/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[4].dataSource = res
        })
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
    this.getAutocompletDataSourceGoodsType()
    this.getAutocompletDataSourceByGoodsUnit()
    this.getAutocompletDataSourceByGoodsBrand()
  }
}
</script>

<style scoped lang="stylus">
</style>
