<template>
  <grid
    :columns="gridColumns"
    :data="gridData"
    :requestInfo="requestInfo"
    :check="check"
    :command="command"
    :height="gridHeight"
    :toolbar="toolbar"
    v-on:callGetInfo="callGetInfo"
    v-on:createInfo="createInfo"
  ></grid>
</template>

<script>
import Grid from '@/components/grid'

export default {
  name: 'entityDevelopment',
  components: {Grid},
  data () {
    return {
      gridColumns: [
        {name: 'tableName', title: '表名'},
        {name: 'tableComment', title: '表描述'},
        {name: 'src', title: '生成路径', template: {type: 'input', prop: 'srcVal'}, search: true}
      ],
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 999
      },
      // 列数据
      gridData: {},
      check: true,
      // 列按钮信息
      command: [
        {name: 'opCreate', text: '<span class="el-icon-download"></span>', tooltip: '创建', click: 'createInfo'}
      ],
      gridHeight: 320,
      toolbar: [
        {name: 'opCreate', text: '创建', click: 'create', type: 'primary', disabled: true}
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
      this.$post('/base/dataBase/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          res.data.forEach(function (item, index) {
            item['id'] = item.tableName
          })
          this.gridData = res
        })
    },
    createInfo (item) {
      this.$errorMsg('创建java代码功能在vue版本中暂不提供')
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>

<style scoped>

</style>
