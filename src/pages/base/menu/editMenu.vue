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
  name: 'editMenu',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '文本', prop: 'text', required: true, type: 'input'},
        {label: '地址', prop: 'url', type: 'input'},
        {label: '图标', prop: 'icon', type: 'input'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/menu/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/menu/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    if (this.$route.query.parentId !== undefined) {
      this.modelData['parentId'] = this.$route.query.parentId
      this.modelData['level'] = this.$route.query.level
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
