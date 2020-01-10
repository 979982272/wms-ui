<template>
  <div>
    <h3 class="formTitle">—— 技术实践平台(WMS) ——</h3>
    <el-form class="loginForm" :model="modelData" :rules="rules" ref="modelData" :show-message="false">
      <el-form-item class="loginFormEl" prop="username" :required="true">
        <el-input class="loginFormItem" placeholder="请输入账号"
                  prefix-icon="iconfont icon-yonghu" v-model="modelData.username">
        </el-input>
      </el-form-item>
      <el-form-item class="loginFormEl" prop="password" :required="true">
        <el-input class="loginFormItem" placeholder="请输入密码"
                  prefix-icon="iconfont icon-yidongduanicon-" v-model="modelData.password" type="password"></el-input>
      </el-form-item>
      <el-row class="loginFormEl">
        <el-button type="primary" round class="loginFormItem" @click="submitLogin('modelData')">登录</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs'
import {mapMutations} from 'vuex'

export default {
  name: 'LoginForm',
  data () {
    return {
      modelData: {
        submit: 'Login',
        username: '0000',
        password: '123456'
      },
      rules: {
        username: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitLogin (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          var data = Qs.stringify(JSON.parse(JSON.stringify(this.modelData)))
          axios({
            method: 'post',
            url: '/login',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data
          }).then((res) => {
            loading.close()
            this.submitLoginResult(res)
          }).catch((error) => {
            loading.close()
            this.$notify.error({
              title: '登录失败',
              message: error,
              position: 'bottom-right'
            })
          })
        }
      })
    },
    submitLoginResult (res) {
      const result = res.data
      if (result.status) {
        this.changeUserName(result.other.userName)
        this.changeToken(result.other.token)
        this.$router.push('/index')
      } else {
        this.$notify.error({
          title: '登录失败',
          message: result.msg,
          position: 'bottom-right'
        })
      }
    },
    ...mapMutations(['changeUserName', 'changeToken'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .formTitle
    font-size 20px
    font-family "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif
    font-weight bold

  .loginForm
    width 100%
    padding-top 20px
    text-align center
    .loginFormEl
      padding-top 10px
      .loginFormItem
        width 18%
</style>
