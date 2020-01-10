import axios from 'axios'
import router from '@/router'
import state from '../../store/state'

axios.defaults.timeout = 5000
// 定义url前置
axios.defaults.baseURL = '/apis'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 如果token过期则跳回登录页面
    if (state.token === '') {
      router.push({
        path: '/login',
        querry: {redirect: router.currentRoute.fullPath}
      })
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// //http response 拦截器
axios.interceptors.response.use(
  response => {
    // 如果服务器重启则跳回登录页面
    if (response.headers['content-type'] === 'text/html;charset=UTF-8') {
      router.push({
        path: '/login',
        querry: {redirect: router.currentRoute.fullPath}
      })
    }
    // 后期后端前端服务作废由后端返回状态码，判断是否登陆
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data = {}, option = {}, isShowLoading) {
  // 拼接token参数
  if (url.indexOf('?') === -1) {
    url = url + '?token=' + this.$store.state.token
  } else {
    url = url + '&token=' + this.$store.state.token
  }
  let loading
  if (isShowLoading !== false) {
    // 加载遮罩层
    loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255,255,255,0.5)',
      target: document.querySelector('.router-view')
    })
  }

  // 发起请求
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: data,
      option
    }).then(response => {
      if (isShowLoading !== false) {
        loading.close()
      }
      resolve(response.data)
    }, err => {
      if (isShowLoading !== false) {
        loading.close()
      }
      this.$notify.error({
        title: '数据请求失败',
        message: err,
        position: 'bottom-right'
      })
      reject(err)
    })
  })
}

/**
 * 删除请求
 * @param url
 * @param data
 * @param option
 */
export function deleteInfo (url, data = {}, option = {}) {
  // 拼接token参数
  if (url.indexOf('?') === -1) {
    url = url + '?token=' + this.$store.state.token
  } else {
    url = url + '&token=' + this.$store.state.token
  }
  // 加载遮罩层
  const loading = this.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255,255,255,0.5)',
    target: document.querySelector('.router-view')
  })
  // 发起请求
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: data,
      option
    }).then(response => {
      loading.close()
      const res = response.data
      if (res.status) {
        this.$successMsg('删除成功')
      } else {
        this.$errorMsg(res.msg)
      }
      resolve(res)
    }, err => {
      loading.close()
      this.$notify.error({
        title: '数据请求失败',
        message: err,
        position: 'bottom-right'
      })
      reject(err)
    })
  })
}
