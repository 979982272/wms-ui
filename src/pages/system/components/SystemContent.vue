<template>
  <div class="index-box">
    <system-tabs></system-tabs>
    <div class="router-view">
      <transition name="move" mode="out-in">
        <keep-alive :include="pathList">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import SystemTabs from './SystemTabs'
import {mapState} from 'vuex'

export default {
  components: {SystemTabs},
  name: 'system-content',
  data () {
    return {
      pathList: ['development']
    }
  },
  methods: {
    changePathList (paths) {
      // 暂停使用keep-alive功能
      this.pathList = []
      let pathName
      for (let path of paths) {
        // 路由名称和组件名称一致的才会被缓存
        pathName = path.name.replace('/', '')
        if (pathName.lastIndexOf('/') > -1) {
          pathName = pathName.substr(pathName.lastIndexOf('/') + 1, pathName.length)
        }
        this.pathList.push(pathName)
      }
    }
  },
  watch: {
    // 监听store中tabs的变化
    listenTabs: function (a, b) {
      this.changePathList(a)
    }
  },
  computed: {
    ...mapState(['tabs']),
    listenTabs () {
      return this.tabs
    }
  },
  mounted () {
    // 页面刷新初始化的时候把当前tabs放入keep-alive中
    this.changePathList(this.tabs)
  }
}
</script>

<style scoped lang="stylus">
  .index-box
    display: grid;
    grid-template-rows: 41.2px 1fr;
</style>
