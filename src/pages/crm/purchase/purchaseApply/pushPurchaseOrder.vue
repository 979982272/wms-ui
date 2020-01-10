<template>
  <div>
    <edit-form
      :tool-bar="toolBar"
      :form-info="formInfo"
      :model-data="modelData"
      :columns="columns"
      v-on:saveEditInfo="saveEditInfo"
      v-on:vendorChange='vendorChange'
      v-on:warehouseChange='warehouseChange'
      ref="editform"
    >
    </edit-form>
    <grid
      :columns="gridColumns"
      :data="gridData"
      :requestInfo="requestInfo"
      :height="gridHeight"
      :toolbar="gridToolbar"
      :command="command"
      @onDataBound="onDataBound"
      @addGoodsInfo="addGoodsInfo"
      @deleteInfo="deleteInfo"
      ref="grid"
    >
    </grid>
    <el-dialog title="添加产品" :visible.sync="dialogVisible">
      <multiple-select-goods
        :vendorId.sync="vendorId" @closeDialog="closeDialog"
      ></multiple-select-goods>
    </el-dialog>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import Grid from '@/components/grid'
import MultipleSelectGoods from '@/pages/base/goods/multipleSelectGoods'

export default {
  components: {
    MultipleSelectGoods,
    Grid,
    EditForm
  },
  name: 'editPurchaseApply',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '下推采购订单', click: 'saveEditInfo', type: 'primary', disabled: false}
      ],
      columns: [
        {label: '采购申请单号', prop: 'id', required: true, type: 'input', disabled: true},
        {
          label: '供应商编码',
          prop: 'vendorId',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'vendorChange'
        },
        {
          label: '仓库编码',
          prop: 'warehouseId',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'warehouseChange'
        },
        {label: '订单日期', prop: 'orderDate', required: true, type: 'datePicker'},
        {label: '到货日期', prop: 'arrivalDate', required: true, type: 'datePicker'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {vendorId: '', warehouseId: '', id: '', orderDate: '', arrivalDate: ''},
      op: 'create',
      gridColumns: [
        {name: 'goodsId', title: '产品编码', search: true},
        {name: 'goodsName', title: '产品名称', search: true},
        {name: 'goodsUnitName', title: '单位名称', search: true},
        {name: 'goodsModel', title: '规格型号', search: true},
        {name: 'purchaseAmount', title: '采购数量', search: true, template: {type: 'inputNumber', prop: 'purchaseAmount'}},
        {name: 'unitPrice', title: '采购价格', search: true, template: {type: 'inputNumber', prop: 'unitPrice'}},
        {name: 'rate', title: '税率(%)', search: true, template: {type: 'inputNumber', prop: 'rate'}},
        {name: 'remark', title: '备注', search: true, template: {type: 'input', prop: 'remark'}}
      ],
      gridData: {'total': 0, 'data': []},
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 9999,
        'dataBound': 'onDataBound'
      },
      gridHeight: 530,
      dialogVisible: false,
      vendorId: '',
      oldPurchaseAmount: {}
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/crm/purchase/purchaseOrder/getPurchaseOrder?id=' + id).then((res) => {
        if (res.status) {
          res.other.modelData['arrivalDate'] = ''
          this.modelData = res.other.modelData
          this.gridData['data'] = res.other.modelData.purchaseOrderParts
          let oldPurchase = {}
          this.gridData['data'].forEach(function (item) {
            oldPurchase[item.goodsId] = item.purchaseAmount
          })
        } else {
          this.$errorMsg(res.msg)
        }
      })
    },
    setDisableByStatus () {
      const status = parseInt(this.modelData['status'])
      if (status >= 20) {
        this.gridToolbar[0]['disabled'] = true
        this.toolBar[0]['disabled'] = true
      }
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          this.modelData['purchaseOrderParts'] = this.gridData.data
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/crm/purchase/purchaseOrder/savePurchaseOrderByApplyPush', data, {headers: {'Content-Type': 'application/json'}})
            .then((res) => {
              if (res.status) {
                this.$successMsg(res.msg)
                this.toolBar[0]['disabled'] = true
              } else {
                this.$errorMsg(res.msg)
              }
            })
        }
      })
    },
    vendorChange (text, vue) {
      this.modelData['vendorName'] = vue
    },
    getAutocompletDataSourceByVendorId () {
      this.$post('/base/vendor/findVendorCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[1].dataSource = res
        })
    },
    warehouseChange (text, vue) {
      this.modelData['warehouseName'] = vue
    },
    getAutocompletDataSourceByWarehouseId () {
      this.$post('/base/warehouse/findWarehouseCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[2].dataSource = res
        })
    },
    addGoodsInfo () {
      if (this.modelData['vendorId'] === '') {
        this.$errorMsg('请先选择供应商!')
        return false
      }
      this.vendorId = this.modelData['vendorId']
      this.dialogVisible = true
    },
    closeDialog (items) {
      this.dialogVisible = false
      this.gridData['total'] = items.length
      items.forEach(function (item) {
        item['unitPrice'] = item.normalPrice
        item['applyAmount'] = 0
        item['remark'] = ''
        item['id'] = null
        if (item['rate'] === undefined) {
          item['rate'] = 0
        }
      })
      this.gridData['data'] = items
    },
    deleteInfo (item) {
      if (this.$route.query.id !== undefined || this.op === 'update') {
        this.$delete('/crm/purchase/purchaseApplyPart/' + item.id + '/deleteById').then((res) => {
          if (res.status) {
            this.getModelDataInfo(this.$route.query.id)
          }
        })
      } else {
        let data = this.gridData['data']
        data = data.filter((info) => {
          return info.goodsId !== item.goodsId
        })
        this.gridData['data'] = data
      }
    },
    onDataBound () {
      if (document.getElementById('refresh') !== undefined && document.getElementById('refresh') !== null) {
        document.getElementById('refresh').remove()
      }
      const status = parseInt(this.modelData['status'])
      if (status >= 20) {
        document.getElementsByName('opDelete').forEach(function (item) {
          item.remove()
        })
      }
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
    this.getAutocompletDataSourceByVendorId()
    this.getAutocompletDataSourceByWarehouseId()
  }
}
</script>

<style scoped lang="stylus">
</style>
