<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="menu-tabs">
      <el-tab-pane label="实体类开发" name="/base/development/entityDevelopment"></el-tab-pane>
      <el-tab-pane label="表格开发" name="/base/development/listDevelopment"></el-tab-pane>
      <el-tab-pane label="表单开发" name="/base/development/formDevelopment"></el-tab-pane>
    </el-tabs>
    <transition name="move" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'development',
  data () {
    return {
      activeName: '/base/development/entityDevelopment'
    }
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
      this.$router.push(tab.name)
    }
  },
  mounted () {
    this.$router.push(this.activeName)
  }
}
</script>

<style scoped lang="stylus">
  .menu-tabs /deep/ .el-tabs__nav-scroll
    padding-left 10px

  .menu-tabs
    height 40px
</style>
