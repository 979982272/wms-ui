<template>
  <edit-form
    :tool-bar="toolBar"
    :form-info="formInfo"
    :model-data="modelData"
    :columns="columns"
    v-on:saveEditInfo="saveEditInfo"
    ref="editform"
  >
  </edit-form>
</template>

<script>
import EditForm from '@/components/editForm'

export default {
  components: {EditForm},
  name: 'editEmp',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '编号', prop: 'id', required: true, type: 'input', disabled: true},
        {label: '姓名', prop: 'username', required: true, type: 'input'},
        {
          label: '性别',
          prop: 'sex',
          type: 'autocomplete',
          required: true,
          dataSource: [{value: '男', text: '1'}, {value: '女', text: '0'}],
          modelData: '',
          dataField: 'text'
        },
        {label: '所属机构', prop: 'department', type: 'input'},
        {label: '上司', prop: 'superior', type: 'input'},
        {label: '职务', prop: 'post', type: 'input'},
        {label: '职称', prop: 'title', type: 'input'},
        {label: '电话', prop: 'phone', type: 'input'},
        {label: '邮箱', prop: 'email', type: 'input'},
        {label: '出生日期', prop: 'birth', type: 'datePicker'},
        {label: '入职日期', prop: 'enrollment', type: 'datePicker'},
        {label: '离职日期', prop: 'resign', type: 'datePicker'},
        {label: '合同到期日期', prop: 'contract', type: 'datePicker'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/emp/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    getModelDataInit () {
      this.$post('/base/emp/getDefaultInfo').then((res) => {
        this.modelData = res.other.modelData
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/emp/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined) {
      this.getModelDataInfo(this.$route.query.id)
    } else {
      this.getModelDataInit()
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
