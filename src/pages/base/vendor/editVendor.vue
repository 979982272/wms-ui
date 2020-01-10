<template>
  <div>
    <edit-form
      :tool-bar="toolBar"
      :form-info="formInfo"
      :model-data="modelData"
      :columns="columns"
      @vendorEmpIdClick="vendorEmpIdClick"
      v-on:saveEditInfo="saveEditInfo"
      ref="editform"
    >
    </edit-form>
    <el-dialog title="选择负责人" :visible.sync="dialogVisible">
      <select-emp @closeDialog="closeDialog"></select-emp>
    </el-dialog>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import SelectEmp from '../emp/selectEmp'

export default {
  components: {SelectEmp, EditForm},
  name: 'editVendor',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '供应商编码', prop: 'id', required: true, type: 'inputNumber'},
        {label: '供应商名称', prop: 'vendorName', required: true, type: 'input'},
        {
          label: '负责人编号',
          prop: 'vendorEmpName',
          required: true,
          type: 'input',
          disabled: true,
          icon: 'el-icon-search',
          click: 'vendorEmpIdClick'
        },
        {label: '应收金额', prop: 'payableAmount', type: 'inputNumber'},
        {label: '国家', prop: 'country', type: 'input'},
        {label: '省份', prop: 'province', type: 'input'},
        {label: '城市', prop: 'city', type: 'input'},
        {label: '邮编', prop: 'postCode', type: 'input'},
        {label: '地址', prop: 'address', type: 'input'},
        {label: '联系人', prop: 'contactPerson', type: 'input'},
        {label: '联系电话', prop: 'contactPhone', type: 'input'},
        {label: '传真', prop: 'contactFax', type: 'input'},
        {label: '邮件', prop: 'contactEmail', type: 'input'},
        {label: '法人', prop: 'legalPerson', type: 'input'},
        {label: '营业执照', prop: 'businessLicense', type: 'input'},
        {label: '税务登记号', prop: 'taxationCode', type: 'input'},
        {label: '开户行', prop: 'openingBank', type: 'input'},
        {label: '开户账号', prop: 'openingBankAccount', type: 'input'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {'vendorEmpName': ''},
      op: 'create',
      dialogVisible: false
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/vendor/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        console.log(JSON.parse(JSON.stringify(this.modelData)))
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/vendor/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    vendorEmpIdClick () {
      this.dialogVisible = true
    },
    closeDialog (item) {
      this.dialogVisible = false
      this.modelData['vendorEmpId'] = item.id
      this.modelData['vendorEmpName'] = item.username
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
