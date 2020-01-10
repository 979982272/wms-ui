<template>
  <div>
    <login-head></login-head>
    <login-form></login-form>
  </div>
</template>

<script>
import LoginHead from './components/LoginHead'
import LoginForm from './components/LoginForm'

export default {
  name: 'Login',
  components: {
    LoginHead,
    LoginForm
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
