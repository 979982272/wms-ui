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
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
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
        {label: '申请日期', prop: 'applyDate', required: true, type: 'datePicker'},
        {label: '到货日期', prop: 'arrivalDate', required: true, type: 'datePicker'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {vendorId: '', warehouseId: '', id: ''},
      op: 'create',
      gridColumns: [
        {name: 'goodsId', title: '产品编码', search: true},
        {name: 'goodsName', title: '产品名称', search: true},
        {name: 'goodsUnitName', title: '单位名称', search: true},
        {name: 'goodsModel', title: '规格型号', search: true},
        {name: 'applyAmount', title: '申请数量', search: true, template: {type: 'inputNumber', prop: 'applyAmount'}},
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
      gridHeight: 560,
      gridToolbar: [
        {name: 'opCreate', text: '添加产品', click: 'addGoodsInfo', type: 'success', disabled: false}
      ],
      dialogVisible: false,
      vendorId: '',
      command: [
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'}
      ]
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/crm/purchase/purchaseApply/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
        this.gridData['data'] = res.other.modelData.purchaseApplyParts
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
      this.$post('/crm/purchase/purchaseApply/getDefaultInfo').then((res) => {
        this.modelData['id'] = res.other.modelData.id
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          this.modelData['purchaseApplyParts'] = this.gridData.data
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/crm/purchase/purchaseApply/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
            .then((res) => {
              if (res.status) {
                this.$successMsg(res.msg)
                this.modelData = res.other.entity
                this.gridData['data'] = res.other.entity.purchaseApplyParts
                this.op = 'update'
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
    } else {
      this.getDefaultModelDataInfo()
    }
    this.getAutocompletDataSourceByVendorId()
    this.getAutocompletDataSourceByWarehouseId()
  }
}
</script>

<style scoped lang="stylus">
</style>
