<template>
  <div>
    <system-head></system-head>
    <div class="content-box">
      <system-menu class="menu"></system-menu>
      <system-content class="content"></system-content>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SystemHead from './components/SystemHead'
import SystemMenu from './components/SystemMenu'
import SystemContent from './components/SystemContent'
import SystemFooter from './components/SystemFooter'

export default {
  components: {
    SystemFooter,
    SystemContent,
    SystemMenu,
    SystemHead
  },
  name: 'system',
  computed: {
    ...mapState({
      token: 'token'
    })
  }
}
</script>

<style scoped lang="stylus">
  .content-box
    display flex
    flex-direction row
    position absolute
    left 0
    top 60px
    bottom 0
    right 0
    overflow hidden
    .menu
      flex-grow 0
      height 100%
    .content
      flex-grow 1
      height 100%
</style>
