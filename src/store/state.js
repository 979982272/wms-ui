let userName = ''
let token = ''
let collapse = false
let tabs = Object
try {
  if (localStorage.userName) {
    userName = localStorage.userName
  }
  if (localStorage.token) {
    token = localStorage.token
  }
  if (localStorage.collapse) {
    collapse = localStorage.collapse
  }
  tabs = []
} catch (ex) {
}

export default {
  userName: userName,
  token: token,
  collapse: collapse,
  tabs: tabs
}
