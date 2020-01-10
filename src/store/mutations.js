export default {
  changeUserName (state, userName) {
    state.userName = userName
    try {
      localStorage.userName = userName
    } catch (e) {
    }
  },
  changeToken (state, token) {
    state.token = token
    try {
      localStorage.token = token
    } catch (e) {
    }
  },
  changeCollapse (state, collapse) {
    state.collapse = collapse
  },
  addTabs (state, tabs) {
    state.tabs.push(tabs)
  },
  changeTabs (state, tabs) {
    state.tabs = tabs
  }
}
