<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :check="check"
    :requestInfo="requestInfo"
    :command="command"
    :toolbar="toolbar"
    v-on:callGetInfo="callGetInfo"
    v-on:editInfo="editInfo"
    v-on:create="create"
    v-on:deleteInfo="deleteInfo"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'listGoods',
  data () {
    return {
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18,
        // 数据初始化完成后的回调
        'dataBound': 'onDataBound'
      },
      // 列信息
      gridColumns: [
        {name: 'id', title: '产品编码', width: 140},
        {
          name: 'goodsType',
          title: '产品类型',
          width: 140,
          format: {
            dataSource: [],
            valueField: 'text',
            textField: 'id'
          }
        },
        {
          name: 'goodsUnit',
          title: '产品单位',
          width: 140,
          format: {
            dataSource: [],
            valueField: 'text',
            textField: 'id'
          }
        },
        {
          name: 'goodsBrand',
          title: '品牌',
          width: 140,
          format: {
            dataSource: [],
            valueField: 'text',
            textField: 'id'
          }
        },
        {name: 'goodsName', title: '产品名称', width: 140},
        {name: 'goodsModel', title: '规格型号', width: 140},
        {name: 'goodsBarcode', title: '条形码', width: 140},
        {name: 'sapCode', title: 'sap物料编码', width: 140},
        {name: 'normalPrice', title: '标准价格', width: 140},
        {name: 'rate', title: '税率', width: 140},
        {name: 'purchasePrice', title: '采购参考价', width: 140},
        {name: 'createTime', title: '创建时间', width: 140},
        {name: 'createEmp', title: '创建人', width: 140},
        {name: 'modifyTime', title: '修改时间', width: 140},
        {name: 'modifyEmp', title: '修改人', width: 140}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'},
        {name: 'opDelete', text: '<span class="el-icon-close"></span>', tooltip: '删除', click: 'deleteInfo'}
      ],
      // 自定义事件回调方法
      callMethods: {'editInfo': 'editInfo'},
      // 是否显示复选框
      check: true,
      // 上方工具条
      toolbar: [
        {name: 'opCreate', text: '新建', click: 'create', type: 'primary'}
      ]
    }
  },
  methods: {
    callGetInfo (page, filter) {
      const param = {}
      if (page === undefined) {
        page = 1
      }
      param['page'] = page
      param['pageSize'] = this.requestInfo.pageSize
      param['filter'] = filter
      this.$post('/base/goods/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/base/goods/editGoods', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/base/goods/editGoods')
    },
    deleteInfo (item) {
      this.$delete('/base/goods/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    },
    getAutocompletDataSourceGoodsType () {
      this.$post('/base/goodsType/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.gridColumns[1].format.dataSource = res
        })
    },
    getAutocompletDataSourceByGoodsUnit () {
      this.$post('/base/goodsUnit/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.gridColumns[2].format.dataSource = res
        })
    },
    getAutocompletDataSourceByGoodsBrand () {
      this.$post('/base/goodsBrand/findCombo', {}, {headers: {'Content-Type': 'application/json'}}, false)
        .then((res) => {
          let data = res
          data.forEach(function (item) {
            item['value'] = item.text
          })
          this.gridColumns[3].format.dataSource = res
        })
    }
  },
  mounted () {
    this.callGetInfo(1)
    this.getAutocompletDataSourceGoodsType()
    this.getAutocompletDataSourceByGoodsUnit()
    this.getAutocompletDataSourceByGoodsBrand()
  }
}
</script>
<style scoped lang="stylus">

</style>
