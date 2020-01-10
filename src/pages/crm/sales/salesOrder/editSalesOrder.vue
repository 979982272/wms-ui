<template>
  <div>
    <edit-form
      :tool-bar="toolBar"
      :form-info="formInfo"
      :model-data="modelData"
      :columns="columns"
      v-on:saveEditInfo="saveEditInfo"
      v-on:customerChange='customerChange'
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
      <multiple-select-goods-by-stock
        :warehouseId.sync="warehouseId" @closeDialog="closeDialog">
      </multiple-select-goods-by-stock>
    </el-dialog>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import Grid from '@/components/grid'
import MultipleSelectGoods from '@/pages/base/goods/multipleSelectGoods'
import MultipleSelectGoodsByStock from '../../../base/goods/multipleSelectGoodsByStock'

export default {
  components: {MultipleSelectGoodsByStock, MultipleSelectGoods, Grid, EditForm},
  name: 'editSalesOrder',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '销售订单主键', prop: 'id', required: true, type: 'input'},
        {
          label: '客户编码',
          prop: 'customerId',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'customerChange'
        },
        {
          label: '发货仓库编码',
          prop: 'warehouseId',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'warehouseChange'
        },
        {label: '订单日期', prop: 'orderDate', required: true, type: 'datePicker'},
        {label: '申请发货日期', prop: 'deliveryDate', required: true, type: 'datePicker'},
        {label: '发票号', prop: 'receipt', type: 'input'},
        {label: '备注', prop: 'remark', type: 'input'},
        {label: '收货地址', prop: 'address', type: 'input'},
        {label: '联系人', prop: 'person', type: 'input'},
        {label: '联系电话', prop: 'phone', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {customerId: '', warehouseId: '', id: '', deliveryDate: ''},
      op: 'create',
      gridColumns: [
        {name: 'goodsId', title: '产品编码', search: true},
        {name: 'goodsName', title: '产品名称', search: true},
        {name: 'goodsUnitName', title: '单位名称', search: true},
        {name: 'goodsModel', title: '规格型号', search: true},
        {name: 'salesAmount', title: '销售数量', search: true, template: {type: 'inputNumber', prop: 'salesAmount'}},
        {name: 'unitPrice', title: '标准零售价', search: true, template: {type: 'inputNumber', prop: 'unitPrice'}},
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
      gridHeight: 660,
      gridToolbar: [
        {name: 'opCreate', text: '添加产品', click: 'addGoodsInfo', type: 'success', disabled: false}
      ],
      dialogVisible: false,
      warehouseId: '',
      command: [
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'}
      ]
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/crm/sales/salesOrder/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
        this.gridData['data'] = res.other.modelData.salesOrderParts
        this.setDisableByStatus()
      })
    },
    setDisableByStatus () {
      const status = parseInt(this.modelData['status'])
      if (status >= 20) {
        this.gridToolbar[0]['disabled'] = true
        this.toolBar[0]['disabled'] = true
      }
    },
    getDefaultModelDataInfo () {
      this.$post('/crm/sales/salesOrder/getDefaultInfo').then((res) => {
        this.modelData = res.other.modelData
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          this.modelData['salesOrderParts'] = this.gridData.data
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/crm/sales/salesOrder/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
            .then((res) => {
              if (res.status) {
                this.$successMsg(res.msg)
                this.modelData = res.other.entity
                this.gridData['data'] = res.other.entity.salesOrderParts
                this.op = 'update'
              } else {
                this.$errorMsg(res.msg)
              }
            })
        }
      })
    },
    customerChange (text, vue) {
      this.modelData['customerName'] = vue
    },
    getAutocompletDataSourceByCustomerId () {
      this.$post('/base/customer/findCustomerCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
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
    closeDialog (items) {
      this.dialogVisible = false
      this.gridData['total'] = items.length
      items.forEach(function (item) {
        item['goodsId'] = item.goodsId
        item['salesAmount'] = item.stockAmount
        item['unitPrice'] = item.goods.normalPrice
        item['remark'] = ''
        item['id'] = null
        item['rate'] = item.goods.rate
      })
      this.gridData['data'] = items
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
    },
    addGoodsInfo () {
      if (this.modelData['warehouseId'] === '' || this.modelData['warehouseId'] === null) {
        this.$errorMsg('请先选择仓库!')
        return false
      }
      this.warehouseId = ''
      this.warehouseId = this.modelData['warehouseId']
      this.dialogVisible = true
    },
    deleteInfo (item) {
      if (this.$route.query.id !== undefined || this.op === 'update') {
        this.$delete('/crm/sales/salesOrderPart/' + item.id + '/deleteById').then((res) => {
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
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    } else {
      this.getDefaultModelDataInfo()
    }
    this.getAutocompletDataSourceByCustomerId()
    this.getAutocompletDataSourceByWarehouseId()
  }
}
</script>

<style scoped lang="stylus">
</style>
