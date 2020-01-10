<template>
  <div class="head">
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">技术实践平台(WMS)</div>
    <div class="head-right">
      <a style="color: white;padding-right: 10px;cursor: pointer" href="http://ui.czcxy.cn">切换版本</a>
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
          <i class="el-icon-rank"></i>
        </el-tooltip>
      </div>
      <div class="head-right-pic-box">
        <img src="static/imgs/headPic.jpg" class="head-right-pic"/>
      </div>
      <div>
        <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        {{this.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>修改密码</el-dropdown-item>
            <router-link to="/">
              <el-dropdown-item>退出登录</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'system-head',
  data () {
    return {
      collapse: Object,
      fullscreen: false
    }
  },
  methods: {
    collapseChage () {
      // 展开/闭合菜单栏
      this.collapse = this.$store.state.collapse
      this.collapse = !this.collapse
      this.changeCollapse(this.collapse)
    },
    handleFullScreen () {
      // 全屏事件
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    ...mapMutations(['changeCollapse'])
  },
  computed: {
    ...mapState({
      userName: 'userName'
    })
  }
}
</script>

<style scoped lang="stylus">
  .head
    font-size 25px
    width 100%
    height 60px
    background #409EFF
    .collapse-btn
      float left
      line-height 60px
      cursor pointer
      display block
      padding-left 20px
    .logo
      float left
      line-height 60px
      padding-left 20px
      color white
    .head-right
      display flex
      flex-direction row
      float right
      line-height 58px
      font-size 19px
      padding-right 40px
      .el-dropdown-link
        cursor pointer
        color white
      .head-right-pic-box
        padding-left 10px
        padding-right 10px
        .head-right-pic
          width 40px
          height 40px
          border-radius 50%
      .btn-fullscreen
        transform: rotate(45deg)
        margin-right: 5px
        font-size: 29px
        color white
        cursor pointer
</style>
