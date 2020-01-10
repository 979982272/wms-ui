<template>
  <edit-form
    :tool-bar="toolBar"
    :form-info="formInfo"
    :model-data="modelData"
    :columns="columns"
    @warehouseTypeChange="warehouseTypeChange"
    v-on:saveEditInfo="saveEditInfo"
    ref="editform"
  >
  </edit-form>
</template>

<script>
import EditForm from '@/components/editForm'

export default {
  components: {EditForm},
  name: 'editWarehouse',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '仓库编码', prop: 'id', required: true, type: 'input'},
        {label: '仓库名称', prop: 'warehouseName', required: true, type: 'input'},
        {
          label: '仓库类型编码',
          prop: 'warehouseType',
          required: true,
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'id',
          callMethods: 'warehouseTypeChange'
        },
        {label: '所属机构', prop: 'department', type: 'input'},
        {label: '所属区域', prop: 'area', type: 'input'},
        {label: '国家', prop: 'country', type: 'input'},
        {label: '省份', prop: 'province', type: 'input'},
        {label: '城市', prop: 'city', type: 'input'},
        {label: '邮编', prop: 'postCode', type: 'input'},
        {label: '地址', prop: 'address', type: 'input'},
        {label: '联系人', prop: 'contactPerson', type: 'input'},
        {label: '联系电话', prop: 'contactPhone', type: 'input'},
        {label: '传真', prop: 'contactFax', type: 'input'},
        {label: '邮件', prop: 'contactEmail', type: 'input'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {warehouseType: ''},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/warehouse/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          console.log(data)
          this.$post('/base/warehouse/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    warehouseTypeChange (text, vue) {
      this.modelData['warehouseTypeName'] = vue
    },
    getAutocompletDataSourceByWarehouseType () {
      this.$post('/base/common/getComboModelDataSource?key=enum_extra.enums.warehouse.warheouseTypeEnum', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.columns[2].dataSource = res
        })
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
    this.getAutocompletDataSourceByWarehouseType()
  }
}
</script>

<style scoped lang="stylus">
</style>
