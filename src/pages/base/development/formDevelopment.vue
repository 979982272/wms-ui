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
      :data="gridData"
      :requestInfo="requestInfo"
      :height="gridHeight"
      ref="grid"
    >
    </grid>
  </div>
</template>

<script>
import EditForm from '@/components/editForm'
import Grid from '@/components/grid'

export default {
  components: {Grid, EditForm},
  name: 'formDevelopment',
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
        {name: 'columnName', title: '列名', search: true},
        {name: 'columnComment', title: '列描述', search: true, template: {type: 'input', prop: 'columnComment'}},
        {
          name: 'sort',
          title: '顺序',
          search: true,
          template: {type: 'input', prop: 'sort'}
        },
        {
          name: 'dataType',
          title: '数据类型',
          search: true,
          template: {
            type: 'autocomplete',
            dataSource: [],
            modelData: '',
            dataField: 'value',
            prop: 'dataType'
          }
        },
        {name: 'dataSource', title: '数据源', search: true, template: {type: 'input', prop: 'dataSource'}},
        {name: 'changeEvent', title: '选择事件', search: true, template: {type: 'input', prop: 'changeEvent'}},
        {name: 'required', title: '是否必填', search: true, template: {type: 'checkbox', prop: 'required'}},
        {name: 'readOnly', title: '只读', search: true, template: {type: 'checkbox', prop: 'readOnly'}}
      ],
      check: true,
      gridData: {},
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 9999,
        // 数据初始化完成后的回调
        'dataBound': 'onDataBound'
      }
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
          this.$post('/base/development/createFormVue?src=' + this.modelData.src + '&vueName=' + this.modelData.vueName, JSON.parse(JSON.stringify(data)),
            {headers: {'Content-Type': 'application/json'}, responseType: 'blob'})
            .then((res) => {
              const blob = new Blob([res])
              const fileName = 'edit' + this.firstUpperCase(this.modelData.vueName) + '.vue'
              this.$downloadFile(fileName, blob)
            })
        }
      })
    },
    // 下拉框选择事件的回调
    changeMethod (item) {
      this.$post('/base/development/findColumnInfoByTable?table=' + item, {}, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          res.data.forEach(function (item, index) {
            item['id'] = item.columnName
            item['dataType'] = ''
          })
          this.gridData = res
        })
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
    getAutocompletDataTypeDataSource () {
      this.gridColumns[3].template.dataSource = [{value: 'text'}, {value: 'autocomplete'}, {value: 'checkbox'}, {value: 'inputNumber'}, {value: 'datePicker'}]
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
    firstUpperCase (str) {
      return str.substring(0, 1).toUpperCase() + str.substring(1)
    }
  },
  computed: {
    gridHeight: function () {
      return 500
    }
  },
  mounted () {
    this.getAutocompletEentityDataSource()
    this.getAutocompletDataTypeDataSource()
  }
}
</script>

<style scoped lang="stylus">
  tbody /deep/ .el-input__suffix
    right 0px
    left 41px
    top 6px
    cursor pointer
</style>
