<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-button v-for="item in toolBar" size="mini" :type="item.type" :key="item.name"
                 @click="itemMethod(item.click,formInfo.formName)" v-if="toolBar" style="float: left"
                 :disabled="item.disabled" :id="item.name">
        {{item.text}}
      </el-button>
    </div>
    <el-form :model="modelData" :rules="rules" ref="modelData" :show-message="true" class="data-form">
      <el-row>
        <el-col :span="6" v-for="item in columns" :key="item.prop">
          <el-form-item :label="item.label" :prop="item.prop" :required="item.required">
            <el-input size="mini" v-model="modelData[item.prop]" v-if="item.type==='input'"
                      :disabled="item.disabled">
              <el-button slot="append" :icon="item.icon" v-if="item.icon" @click="itemMethod(item.click)"></el-button>
            </el-input>
            <!--dataSource 中需要一个value -->
            <el-autocomplete
              size="mini"
              class="inline-input el-input"
              :value="getAutocompleteVal(item.dataSource,modelData[item.prop],item.dataField)"
              placeholder="请输入内容"
              v-if="item.type==='autocomplete'"
              :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,item.dataSource)})"
              @select="((selectVal)=>{modelData[item.prop]=selectVal[item.dataField];handleSelect(selectVal,item.dataField,item.callMethods)})"
              :disabled="item.disabled"
            >
              <i
                class="el-icon-error"
                slot="suffix"
                @click="((res)=>{modelData[item.prop]=''; modelData[item.prop+'text']=''})">
              </i>
            </el-autocomplete>
            <el-date-picker
              size="mini"
              class="inline-input el-input"
              :editable="false"
              v-model="modelData[item.prop]"
              type="date"
              placeholder="选择日期" v-if="item.type==='datePicker'"
              :disabled="item.disabled">
            </el-date-picker>
            <el-input-number v-model="modelData[item.prop]" :precision="2" :step="0.1"
                             v-if="item.type==='inputNumber'" size="mini" controls-position="right"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'editForm',
  props: {
    columns: Array,
    toolBar: Array,
    formInfo: Object,
    modelData: Object,
    dataBound: String
  },
  data () {
    return {}
  },
  methods: {
    // 点击事件的调用
    itemMethod (callMethod, item) {
      // 需要在gird中定义v-on:callMethod="你的方法"
      this.$emit(callMethod, item)
    },
    // autocomplete选中事件过滤事件
    querySearch (queryString, cb, dataSource) {
      var restaurants = dataSource
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    // autocomplete选中事件
    handleSelect (selectVal, dataField, callMethods) {
      if (callMethods !== undefined) {
        this.$emit(callMethods, selectVal[dataField], selectVal.value)
      }
    },
    getAutocompleteVal: function (dataSource, modelData, dataField) {
      let result = ''
      let item
      if (dataSource !== undefined) {
        dataSource.forEach(function (val) {
          if (val[dataField] === modelData) {
            item = val
          }
        })
      }
      if (item !== undefined) {
        result = item.value
      }
      return result
    }
  },
  computed: {
    rules: function () {
      let rules = {}
      let ruleInfo = {}
      const data = this.columns
      data.forEach(function (item) {
        if (item.required) {
          ruleInfo = {}
          ruleInfo['required'] = item.required
          ruleInfo['trigger'] = 'blur'
          ruleInfo['message'] = '请输入' + item.label
          rules[item.prop] = ruleInfo
        }
      })
      return rules
    }
  },
  mounted () {
    if (this.dataBound !== undefined) {
      this.$emit(this.dataBound)
    }
  }
}
</script>

<style scoped lang='stylus'>
  form /deep/ .el-input__suffix
    right 0px
    left -100px
    top -5px
    cursor pointer

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  form /deep/ .el-date-editor, .el-input-number
    width 100%

  form /deep/ .el-input-number__decrease
    display none

  form /deep/ .el-input-number__increase
    display none

  form /deep/ .el-input-group__append
    position absolute
    left 128px
    top 5px
    border 0px
</style>
