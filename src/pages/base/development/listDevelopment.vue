<template>
  <div>
    <edit-form
      :columns="formColumns"
      :model-data="modelData"
      :form-info="formInfo"
      :tool-bar="toolBar"
      v-on:createInfo="createInfo"
      v-on:callMethods="changeMethod"
      ref="editform"
    >
    </edit-form>
    <grid
      :columns="gridColumns"
      :check="check"
      :requestInfo="requestInfo"
      :height="gridHeight"
      :data="gridData"
      ref="grid"
    ></grid>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import Grid from '@/components/grid'
import {mapState} from 'vuex'

export default {
  name: 'listDevelopment',
  components: {Grid, EditForm},
  data () {
    return {
      formColumns: [
        {
          label: '数据库表',
          prop: 'entity',
          type: 'autocomplete',
          dataSource: [],
          modelData: '',
          dataField: 'text',
          callMethods: 'callMethods'
        },
        {label: '访问路径', prop: 'src', required: true, type: 'input'},
        {label: '页面名称', prop: 'vueName', required: true, type: 'input'}
      ],
      modelData: {'entity': ''},
      formInfo: {formName: 'modelData'},
      toolBar: [
        {name: 'opCreate', text: '创建', click: 'createInfo', type: 'primary'}
      ],
      gridColumns: [
        // 名称，标题，是否使用tooltip，宽度
        {name: 'columnName', title: '列名', search: true},
        {name: 'columnComment', title: '列描述', template: {type: 'input', prop: 'columnComment'}, search: true},
        {name: 'dataType', title: '数据类型', search: true},
        {name: 'columnKey', title: '主键', search: true},
        {name: 'sort', title: '顺序', template: {type: 'input', prop: 'sort'}, search: true},
        {name: 'width', title: '宽度', template: {type: 'input', prop: 'width'}, search: true},
        {name: 'template', title: '模板', template: {type: 'input', prop: 'template'}, search: true},
        {name: 'toolTip', title: '是否显示提示', template: {type: 'checkbox', prop: 'toolTip'}, search: true}
      ],
      check: true,
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 9999
      },
      gridData: {}
    }
  },
  methods: {
    // 创建html页面
    createInfo (formName) {
      this.$refs.editform.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.filterDataByCheckedList(this.gridData.data, this.$refs.grid._data.checkedLists)
          if (data.length <= 0) {
            this.$errorMsg('请勾选需要生成的数据')
            return false
          }
          this.$post('/base/development/createGridVue?src=' + this.modelData.src + '&vueName=' + this.modelData.vueName, JSON.parse(JSON.stringify(data)),
            {headers: {'Content-Type': 'application/json'}, responseType: 'blob'})
            .then((res) => {
              const blob = new Blob([res])
              const fileName = 'list' + this.firstUpperCase(this.modelData.vueName) + '.vue'
              this.$downloadFile(fileName, blob)
            })
        }
      })
    },
    // 过滤勾选的数据
    filterDataByCheckedList (dataSourece, checkedList) {
      let data = []
      dataSourece.forEach((item) => {
        if (checkedList.indexOf(item.columnName) >= 0) {
          data.push(item)
        }
      })
      return data
    },
    // 获取数据库表下拉框数据源
    getAutocompletEentityDataSource () {
      this.$post('/base/development/findDataBaseCombo', {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.id
          })
          this.formColumns[0].dataSource = res
        })
    },
    // 下拉框选择事件的回调
    changeMethod (item) {
      this.$post('/base/development/findColumnInfoByTable?table=' + item, {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          res.data.forEach(function (item, index) {
            item['id'] = item.columnName
          })
          this.gridData = res
        })
    },
    firstUpperCase (str) {
      return str.substring(0, 1).toUpperCase() + str.substring(1)
    }
  },
  computed: {
    gridHeight: function () {
      return 500
    },
    ...mapState({
      token: 'token'
    })
  },
  mounted () {
    this.getAutocompletEentityDataSource()
  }
}
</script>

<style scoped>

</style>
