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
    v-on:onDataBound="onDataBound"
  >
  </grid>
</template>

<script>
import {mapState} from 'vuex'
import Grid from '../components/grid'

export default {
  components: {Grid},
  name: 'index',
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
        // 名称，标题，是否使用tooltip，宽度
        {name: 'organizationCode', title: '组织机构编码'},
        {name: 'organizationName', title: '组织机构名称'},
        {name: 'linkMan', title: '名称', tooltip: true},
        {name: 'linkPhone', title: '联系电话'},
        {name: 'address', title: '地址'},
        {name: 'remaker', title: '备注'}
      ],
      // 列数据
      gridData: {},
      // 列按钮信息
      command: [
        {name: 'opEdit', text: '<span class="el-icon-edit"></span>', tooltip: '编辑', click: 'editInfo'}
      ],
      // 自定义事件回调方法
      callMethods: {'callGetInfo': 'callGetInfo', 'editInfo': 'editInfo'},
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
      this.$post('/base/organization/loadData', param, {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          this.gridData = res
        })
    },
    editInfo (item) {
      this.$router.push({path: '/edit', query: {id: item.id}})
    },
    create (checkedInfo) {
      console.log(checkedInfo)
      this.$router.push('/edit')
    },
    onDataBound () {
      console.log('onDataBound')
    }
  },
  computed: {
    ...mapState({
      token: 'token'
    })
  },
  mounted () {
    this.callGetInfo(1)
  }
}
</script>
<style scoped lang="stylus">

</style>
