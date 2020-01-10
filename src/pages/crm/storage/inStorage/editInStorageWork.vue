<template>
  <div>
    <edit-form
      :tool-bar="toolBar"
      :form-info="formInfo"
      :model-data="modelData"
      :columns="columns"
      v-on:saveEditInfo="saveEditInfo"
      ref="editform"
    >
    </edit-form>
    <grid
      :columns="gridColumns"
      :data="gridData"
      :requestInfo="requestInfo"
      :height="gridHeight"
      :command="command"
      @onDataBound="onDataBound"
      @inStorage="inStorage"
      ref="grid"
    ></grid>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import Grid from '@/components/grid'

export default {
  components: {Grid, EditForm},
  name: 'editInStorageWork',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '出库单号', prop: 'id', type: 'input', disabled: true},
        {
          label: '订单类型',
          prop: 'orderType',
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          disabled: true
        },
        {label: '订单日期', prop: 'orderDate', type: 'datePicker', disabled: true},
        {label: '供应商名称', prop: 'vendorName', type: 'input', disabled: true},
        {label: '仓库名称', prop: 'warehouseName', type: 'input', disabled: true},
        {label: '备注', prop: 'remark', type: 'input', disabled: true}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {orderType: ''},
      op: 'create',
      gridColumns: [
        {name: 'goodsId', title: '产品编码', search: true},
        {name: 'goodsName', title: '产品名称', search: true},
        {name: 'goodsUnitName', title: '单位名称', search: true},
        {name: 'goodsModel', title: '规格型号', search: true},
        {name: 'planAmount', title: '计划数量', search: true},
        {name: 'receivingAmount', title: '入库数量', search: true},
        {
          name: 'waitReceivingAmount',
          title: '待入库数量',
          search: true,
          template: {type: 'inputNumber', prop: 'waitReceivingAmount'}
        },
        {name: 'remark', title: '备注', search: true}
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
      gridHeight: 510,
      command: [
        {name: 'opInStorage', text: '<span class="el-icon-download"></span>', tooltip: '入库', click: 'inStorage'}
      ]
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/crm/inStorage/inStorageWork/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.gridData['data'] = res.other.modelData.inStorageWorkParts
        this.gridData['data'].forEach(function (item) {
          item.waitReceivingAmount = item.planAmount - item.receivingAmount
        })
        this.op = 'update'
      })
    },
    getAutocompletDataSourceByOrderType () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.OrderTypeEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[1].dataSource = res
        })
    },
    onDataBound () {
      if (Object.keys(this.gridData).length > 0) {
        this.gridData.data.forEach(function (item) {
          let opInStorage = document.getElementById('opInStorage' + item.id)
          if (parseInt(item.receivingAmount) === parseInt(item.planAmount)) {
            if (opInStorage !== null) {
              opInStorage.remove()
            }
          }
        })
      }
    },
    inStorage (item) {
      this.$post('/crm/inStorage/inStorageWorkPart/inStorageByPart?id=' + item.id + '&receivingAmount=' + item.waitReceivingAmount, {}, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
        .then((res) => {
          if (res.status) {
            this.getModelDataInfo(this.$route.query.id)
            this.$successMsg(res.msg)
          } else {
            this.$errorMsg(res.msg)
          }
        })
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
    this.getAutocompletDataSourceByOrderType()
    let opSave = document.getElementById('opSave')
    if (opSave !== null) {
      opSave.remove()
    }
    let refresh = document.getElementById('refresh')
    if (refresh !== null) {
      refresh.remove()
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
