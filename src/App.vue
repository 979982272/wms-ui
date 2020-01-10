<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  .loading {
    font-size: 50px;
  }

  // 全局表单css
  .data-form /deep/ .el-row
    padding-left 25px

  .data-form /deep/ .el-input__inner
    width 170px
    float left

  .edit-form
    display grid
    grid-template-rows 40px 1fr
    .tool-bar
      border-radius 2px
      box-shadow: 0px 1px 0px #000
      float left
      line-height 40px
      align-items center
      display: flex;
      padding-left 25px

  .table-box /deep/ input
    color red

  .table-box /deep/ .el-checkbox__inner
    border-color #409EFF
</style>
