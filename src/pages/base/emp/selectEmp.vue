<template>
  <grid
    :data="gridData"
    :columns="gridColumns"
    :requestInfo="requestInfo"
    :command="command"
    :width="width"
    :height="height"
    v-on:callGetInfo="callGetInfo"
    v-on:chooseInfo="chooseInfo"
    ref="grid"
  >
  </grid>
</template>

<script>

import Grid from '@/components/grid'

export default {
  components: {Grid},
  name: 'selectEmp',
  data () {
    return {
      // 请求信息
      requestInfo: {
        // 刷新页面的回调方法
        'callMethod': 'callGetInfo',
        // 每页大小
        'pageSize': 18
      },
      // 列信息
      gridColumns: [
        {name: 'id', title: '编号'},
        {name: 'username', title: '姓名'},
        {
          name: 'sex',
          title: '性别',
          format: {
            dataSource: [{value: '男', text: '1'}, {value: '女', text: '0'}],
            valueField: 'value',
            textField: 'text'
          }
        },
        {name: 'post', title: '职务'},
        {name: 'title', title: '职称', tooltip: true}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-check"></span>', tooltip: '选择', click: 'chooseInfo'}
      ],
      width: 1000,
      height: 500
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
      this.$post('/base/emp/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    chooseInfo (item) {
      this.$emit('closeDialog', item)
    }
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
