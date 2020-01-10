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
  name: 'editOrganization',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '组织机构编码', prop: 'organizationCode', required: true, type: 'input'},
        {label: '组织机构名称', prop: 'organizationName', required: true, type: 'input'},
        {label: '联系人名称', prop: 'linkMan', required: true, type: 'input'},
        {label: '联系人电话', prop: 'linkPhone', required: true, type: 'input'},
        {label: '地址', prop: 'address', type: 'input'},
        {label: '备注', prop: 'remaker', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/organization/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/organization/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
