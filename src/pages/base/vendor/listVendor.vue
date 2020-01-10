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
  name: 'listVendor',
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
        {name: 'id', title: '供应商编码', tooltip: true, width: 140},
        {name: 'vendorName', title: '供应商名称', tooltip: true, width: 140},
        {name: 'vendorEmpId', title: '负责人编号', tooltip: true, width: 140},
        {name: 'vendorEmpName', title: '负责人 名称', tooltip: true, width: 140},
        {name: 'payableAmount', title: '应收金额', tooltip: true, width: 140},
        {name: 'country', title: '国家', tooltip: true, width: 140},
        {name: 'province', title: '省份', tooltip: true, width: 140},
        {name: 'city', title: '城市', tooltip: true, width: 140},
        {name: 'postCode', title: '邮编', tooltip: true, width: 140},
        {name: 'address', title: '地址', tooltip: true, width: 140},
        {name: 'contactPerson', title: '联系人', tooltip: true, width: 140},
        {name: 'contactPhone', title: '联系电话', tooltip: true, width: 140},
        {name: 'contactFax', title: '传真', tooltip: true, width: 140},
        {name: 'contactEmail', title: '邮件', tooltip: true, width: 140},
        {name: 'legalPerson', title: '法人', tooltip: true, width: 140},
        {name: 'businessLicense', title: '营业执照', tooltip: true, width: 140},
        {name: 'taxationCode', title: '税务登记号', tooltip: true, width: 140},
        {name: 'openingBank', title: '开户行', tooltip: true, width: 140},
        {name: 'openingBankAccount', title: '开户账号', tooltip: true, width: 140},
        {name: 'remark', title: '备注', tooltip: true, width: 140},
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
      this.$post('/base/vendor/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/base/vendor/editVendor', query: {id: item.id}})
    },
    create (checkedInfo) {
      this.$router.push('/base/vendor/editVendor')
    },
    deleteInfo (item) {
      this.$delete('/base/vendor/' + item.id + '/deleteById').then((res) => {
        if (res.status) {
          this.callGetInfo(this.$refs.grid.$refs.pagination._data.internalCurrentPage, this.$refs.grid._data.filter)
        }
      })
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
