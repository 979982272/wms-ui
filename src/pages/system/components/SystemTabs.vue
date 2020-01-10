<template>
  <div>
    <el-tabs v-model="activeTabs" type="card" editable @edit="handleTabsEdit" @tab-click="tabClick" ref="tabs"
             @callContextmenuMethod="callContextmenuMethod">
      <el-tab-pane
        :key="item.name"
        :label="item.title"
        :name="item.name"
        v-for="(item) in tabs"
        call-contextmenu-method="callContextmenuMethod"
      >
      </el-tab-pane>
    </el-tabs>
    <vue-context-menu :contextMenuData="contextMenuData"
                      @closeOther="closeOther"
                      @closeAll="closeAll">
    </vue-context-menu>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'system-tabs',
  data () {
    return {
      activeTabs: '',
      notActiveTabs: ['/base/development/entityDevelopment', '/base/development/listDevelopment',
        '/base/development/formDevelopment', '/base/role/editRole', '/base/goods/editGoodsBrand',
        '/base/goodsUnit/editGoodsUnit', '/base/goodsType/editGoodsType', '/base/menu/editMenu',
        '/base/emp/selectEmp'],
      // contextmenu data (菜单数据)
      contextMenuData: {
        // the contextmenu name(@1.4.1 updated)
        menuName: 'demo',
        // The coordinates of the display(菜单显示的位置)
        axis: {
          x: null,
          y: null
        },
        // Menu options (菜单选项)
        menulists: [
          {
            fnHandler: 'closeOther', // Binding events(绑定事件)
            icoName: 'fa fa-home fa-fw', // icon (icon图标 )
            btnName: '关闭其他' // The name of the menu option (菜单名称)
          },
          {
            fnHandler: 'closeAll',
            icoName: 'fa fa-home fa-fw',
            btnName: '关闭所有'
          }
        ]
      },
      currentItem: ''
    }
  },
  methods: {
    handleTabsEdit (targetName, action) {
      if (action === 'remove') {
        let tabs = this.tabs
        let activeName = this.activeTabs
        if (activeName === targetName) {
          // 循环tabs获取出删除后的下一个激活标签
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        // 删除tabs中删除了的tab对象
        this.activeTabs = activeName
        tabs = tabs.filter(tab => tab.name !== targetName)
        this.changeTabs(tabs)
        if (tabs.length === 0) {
          this.$router.push('/index')
        } else {
          this.$router.push(this.activeTabs)
        }
      }
    },
    tabClick (tab) {
      // 点击tab的时候切换路由
      const path = tab.name
      this.$router.push(path)
    },
    // 关闭其他
    closeOther () {
      this.activeTabs = this.currentItem
      let tabs = this.tabs
      tabs = tabs.filter(tab => tab.name === this.currentItem)
      this.changeTabs(tabs)
    },
    // 关闭所有
    closeAll () {
      this.changeTabs([])
      this.$router.push('/index')
    },
    // tabs右键事件的回调
    callContextmenuMethod (currentItem) {
      event.preventDefault()
      const pane = event.path[0]
      var x = pane.getBoundingClientRect().x + (pane.clientWidth / 2)
      var y = pane.getBoundingClientRect().y + (pane.clientHeight / 2)
      this.contextMenuData.axis = {
        x, y
      }
      this.currentItem = currentItem
    },
    ...mapMutations(['addTabs', 'changeTabs'])
  },
  computed: {
    ...mapState(['tabs', 'collapse']),
    listenTabs () {
      return this.tabs
    }
  },
  watch: {
    // 监听路由的变化，从而新增tabs
    '$route' (currentRoutePath) {
      // 如果是在不激活tabs列表中的路径则忽略
      if (this.notActiveTabs.indexOf(currentRoutePath.path) !== -1) {
        return false
      }
      // 如果是已经打开的标签则只激活标签
      let flag = false
      for (let opt of this.tabs) {
        if (opt.name === currentRoutePath.path) {
          flag = true
          this.activeTabs = currentRoutePath.path
        }
      }
      // 如果是从未打开的标签则新增标签并且激活
      if (!flag) {
        let title = currentRoutePath.name
        if (currentRoutePath.params) {
          for (const key in currentRoutePath.params) {
            // title = title + ':' + key + '=' + currentRoutePath.params[key]
            title = title + ':' + currentRoutePath.params[key]
          }
        }
        this.addTabs({
          'title': title,
          'name': currentRoutePath.path
        })
        this.activeTabs = currentRoutePath.path
      }
    }
  },
  mounted () {
    // 刷新页面时取当前路由
    const currentRoutePath = this.$route
    this.addTabs({
      'title': currentRoutePath.name,
      'name': currentRoutePath.path
    })
    this.activeTabs = currentRoutePath.path
  }
}
</script>

<style scoped lang="stylus">

</style>
