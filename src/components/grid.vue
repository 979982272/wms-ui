<template>
  <div class="table-box"
  >
    <div class="toolbar">
      <el-button v-for="item in toolbar" size="mini" :type="item.type" :key="item.name"
                 @click="itemMethod(item.click,checkedLists)" v-if="toolbar" :disabled="item.disabled">
        {{item.text}}
      </el-button>
      <el-button type="success" size="mini" @click="refresh" id="refresh"> 刷新</el-button>
    </div>
    <div style="overflow-x: scroll" v-bind:style="{width:tableBoxWidth+'px'}">
      <table class="thead-table">
        <thead>
        <tr>
          <th v-if="check" width="5px">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                         @change="handleCheckAllChange"></el-checkbox>
          </th>
          <th v-if="command" :width="commandWidth!==undefined?commandWidth:80">
            操作
          </th>
          <th v-for="column in columns"
              @click="sortBy(column.name)"
              :class="{ active: sortKey == column.name }"
              :key="column.name" :width="column.width">
            {{ column.title}}
            <span class="arrow" :class="sortOrders[column.name] > 0 ? 'asc' : 'dsc'">
          </span>
          </th>
        </tr>
        <tr>
          <td v-if="check"></td>
          <td v-if="command" :width="commandWidth!==undefined?commandWidth:80"></td>
          <td v-for="column in columns" :key="column.name">
            <el-input class="searchInput"
                      @keyup.enter.native="enterSerachInput"
                      :name="column.name" v-if="!column.search"></el-input>
          </td>
        </tr>
        </thead>
        <tbody v-bind:style="{height:tableBodyHeight+'px'}">
        <tr v-for="entry in filteredData" v-if="filteredData.length >0"
            :key="entry.name">
          <td v-if="check" style="width: 5px">
            <el-checkbox-group v-model="checkedLists" @change="handleCheckedChange">
              <el-checkbox :key="entry.id" :label="entry.id"></el-checkbox>
            </el-checkbox-group>
          </td>
          <td v-if="command" :width="commandWidth!==undefined?commandWidth:80">
            <el-tooltip class="item" effect="dark"
                        :content='com.tooltip' placement="bottom"
                        :disabled="!com.tooltip" v-for="com in command" :key="com.name">
              <a style="cursor: pointer;padding-left: 5px" v-html="com.text" :name="com.name"
                 @click="itemMethod(com.click,entry)"
                 :id="com.name+entry.id">
              </a>
            </el-tooltip>
          </td>
          <td v-for="column in columns" :key="column.name" :width="column.width">
            <el-tooltip class="item" effect="dark"
                        :content='String(entry[column.name])' placement="right-start"
                        :disabled="(!column.tooltip)" v-if="!column.template">
              <span v-if="!column.format">{{formatFiledData(entry,column.name)}}</span>
              <span v-if="column.format">{{formatData(column.format,entry[column.name])}}</span>
            </el-tooltip>
            <div v-else>
              <el-input v-if="column.template.type == 'input'" v-model="entry[column.template.prop]"></el-input>
              <el-input-number v-model="entry[column.template.prop]" :precision="2" :step="0.1"
                               v-if="column.template.type =='inputNumber'" size="mini"
                               controls-position="right"></el-input-number>
              <el-checkbox v-if="column.template.type == 'checkbox'" v-model="entry[column.template.prop]">备选项
              </el-checkbox>
              <el-autocomplete
                size="mini"
                class="inline-input el-input"
                v-model="entry[column.template.prop]"
                placeholder="请输入内容"
                v-if="column.template.type==='autocomplete'"
                :fetch-suggestions="((queryString,cb)=>{querySearch(queryString,cb,column.template.dataSource)})"
                @select="((selectVal)=>{handleSelect(selectVal,column.template.dataField,entry[column.template.prop],column.template.callMethods)})"
              >
                <i
                  class="el-icon-error"
                  slot="suffix"
                  @click="((res)=>{entry[column.template.prop]=''})">
                </i>
              </el-autocomplete>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <el-pagination
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      @current-change="pageChange"
      ref="pagination"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
const checkBoxOptions = []
export default {
  name: 'grid',
  props: {
    data: Object,
    columns: Array,
    check: Boolean,
    requestInfo: Object,
    command: Array,
    toolbar: Array,
    height: Number,
    commandWidth: Number,
    width: Number
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key.name] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      searchValus: new Map(),
      isIndeterminate: false,
      checkAll: false,
      checkedLists: [],
      filter: {},
      filters: {},
      tableBodyHeight: 0,
      windowHeight: 0
    }
  },
  computed: {
    // 数据
    filteredData: function () {
      if (this.data === undefined) {
        return []
      }
      var sortKey = this.sortKey
      var order = this.sortOrders[sortKey] || 1
      var data = this.data.data
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    // 总页数
    totalCount: function () {
      var total = 0
      if (this.data !== undefined && undefined !== this.data.total) {
        total = this.data.total
      }
      return total
    },
    // 页数
    pageSize: function () {
      let pageSize = 18
      if (this.requestInfo !== undefined && undefined !== this.requestInfo.pageSize) {
        pageSize = this.requestInfo.pageSize
      }
      return pageSize
    },
    tableBoxWidth: function () {
      let reduceWidth = 205
      if (this.width !== undefined) {
        reduceWidth = this.width
      }
      let boxWidth = window.innerWidth - reduceWidth
      return boxWidth
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    // 搜索框失去焦点的时候
    serachInputBlur (event) {
      const obj = event.path[0]
      const oldVal = this.searchValus.get(obj.name)
      // 如果数据已经修改则发起请求
      if (oldVal !== obj.value) {
        if (obj.value !== '') {
          const filterContent = {}
          filterContent['operator'] = 'contains'
          filterContent['value'] = obj.value
          filterContent['field'] = obj.name
          this.filters[obj.name] = filterContent
        } else {
          delete this.filters[obj.name]
        }
        const filters = []
        for (var key in this.filters) {
          filters.push(this.filters[key])
        }
        this.filter['logic'] = 'and'
        this.filter['filters'] = filters
        this.$emit(this.requestInfo.callMethod, 1, this.filter)
      }
    },
    // 搜索框获取焦点的时候
    serachInputFocu (event) {
      const obj = event.path[0]
      this.searchValus.set(obj.name, obj.value)
    },
    // 在搜索框着输入确认键的事件
    enterSerachInput (e) {
      var keyCode = window.event ? e.keyCode : e.which
      if (keyCode === 13) {
        this.serachInputBlur(window.event)
        this.serachInputFocu(window.event)
      }
    },
    // 页面更新事件
    pageChange (page) {
      // 需要在gird中定义v-on:this.requestInfo.callMethod="你的方法"
      this.$emit(this.requestInfo.callMethod, page, this.filter)
    },
    // 全选复选框事件
    handleCheckAllChange (val) {
      this.checkedLists = val ? checkBoxOptions : []
      this.isIndeterminate = false
    },
    // 单选事件
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === checkBoxOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < checkBoxOptions.length
    },
    // 点击事件的调用
    itemMethod (callMethod, item) {
      // 需要在gird中定义v-on:callMethod="你的方法"
      this.$emit(callMethod, item)
    },
    // 刷新
    refresh () {
      this.$emit(this.requestInfo.callMethod, this.$refs.pagination._data.internalCurrentPage, this.filter)
    },
    // autocomplete选中事件过滤事件
    querySearch (queryString, cb, dataSource) {
      var restaurants = dataSource
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect (selectVal, dataField, modelData, callMethods) {
      modelData = selectVal[dataField]
      if (callMethods !== undefined) {
        this.$emit(callMethods, selectVal[dataField])
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    // 初始化表格高度
    initTableHeight () {
      let tableBodyHeight = 0
      if (this.height !== undefined) {
        tableBodyHeight = (window.innerHeight) - this.height
      } else {
        tableBodyHeight = (window.innerHeight) - 280
      }
      this.tableBodyHeight = tableBodyHeight
    },
    // 字段格式化
    formatData (formate, item) {
      let result = item
      const dataSource = formate.dataSource
      if (dataSource !== undefined && Object.keys(dataSource).length > 0) {
        dataSource.forEach(function (item) {
          let text = item[formate.textField]
          let value = result
          if (!isNaN(text)) {
            text = parseInt(text)
          }
          if (!isNaN(value)) {
            value = parseInt(value)
          }
          if (text === value) {
            result = item[formate.valueField]
          }
        })
      }
      return result
    },
    formatFiledData (data, filed) {
      let result = data[filed]
      if (filed.indexOf('.') > 0) {
        let first = filed.substr(0, filed.indexOf('.'))
        let last = filed.substr(filed.indexOf('.') + 1, filed.length)
        let obj = data[first]
        result = obj[last]
      }
      return result
    }
  },
  watch: {
    // 监听数据的变化，改变复选框的数据
    filteredData (a, b) {
      a.forEach(function (info) {
        checkBoxOptions.push(info.id)
      })
    },
    // 监听窗口高度的变化
    windowHeight (val) {
      let otherHeight = 0
      if (this.height !== undefined) {
        otherHeight = this.height
      } else {
        otherHeight = 260
      }
      this.tableBodyHeight = val - otherHeight
    }
  },
  mounted () {
    // 初始化表格高度
    this.initTableHeight()
    // 监听窗口
    window.onresize = () => {
      return (() => {
        this.windowHeight = window.innerHeight
      })()
    }
  },
  updated () {
    // 延迟1秒后再回调dataBound方法，让dom有初始化时间
    const time = setInterval(() => {
      // 如果有配置初始化回调的话回调父级指定方法
      if (this.requestInfo && this.requestInfo.dataBound) {
        this.$emit(this.requestInfo.dataBound)
      }
      clearInterval(time)
    }, 1000)
  }
}
</script>

<style scoped lang="stylus">
  body {
    font-family: Helvetica Neue, Arial, sans-serif;
    font-size: 14px;
    color: #444;
  }

  .table-box {
    //display: grid;
    //grid-template-rows: 35px 1fr 50px;
  }

  .thead-table {
    width: 100%;
    border-radius: 3px;
  }

  .tbody-table {
    border-bottom: 2px solid #e2efef;
    border-radius: 3px;
    background-color: #fff;
    width: 100%;
  }

  th {
    background-color: #e2efef;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color black
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  th, td {
    padding: 10px 7px;
  }

  td /deep/ .el-checkbox__label {
    position absolute
    top -9999px
    left -9999px
  }

  th.active .arrow {
    opacity: 1;
  }

  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.66;
  }

  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid black;
  }

  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid black;
  }

  .searchInput /deep/ .el-input__inner {
    height 27px
  }

  tbody /deep/ .el-input__inner {
    height 27px
    width 150px
  }

  .toolbar {
    float left
    padding-left 10px
    padding-top 10px
    padding-bottom 10px
    background #f9f9f9
    line-height 25px
    display: flex;
    align-items: Center;
  }

  tbody /deep/ .el-input__suffix
    right 0px
    left 85px
    top 8px
    cursor pointer

  // 设置tbody滚动,需要在tbody设置高度
  table tbody {
    display: block;
    overflow-y: scroll;
  }

  table thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  table thead {
    width: calc(100% - 1em)
  }

  .thead-table /deep/ .el-input-number__decrease
    display none

  .thead-table /deep/ .el-input-number__increase
    display none
</style>
