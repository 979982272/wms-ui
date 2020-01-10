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
  name: 'editGoodsType',
  data () {
    return {
      toolBar: [
        {name: 'opSave', text: '保存', click: 'saveEditInfo', type: 'primary'}
      ],
      columns: [
        {label: '产品类型', prop: 'name', required: true, type: 'input'},
        {label: '类型编码', prop: 'id', required: true, type: 'input'},
        {label: '描述', prop: 'des', type: 'input'},
        {label: '备注', prop: 'remark', type: 'input'}
      ],
      formInfo: {formName: 'modelData'},
      modelData: {},
      op: 'create'
    }
  },
  methods: {
    getModelDataInfo (id) {
      this.$post('/base/goodsType/' + id + '/getDataInfoById').then((res) => {
        this.modelData = res.other.modelData
        this.op = 'update'
      })
    },
    saveEditInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.modelData))
          this.$post('/base/goodsType/' + this.op, data, {headers: {'Content-Type': 'application/json'}})
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
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
