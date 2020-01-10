// 公共js文件
// 调用方法this.$方法名

// 成功提示
export function successMsg (msg) {
  this.$notify.success({
    title: '操作结果',
    message: msg,
    position: 'bottom-right'
  })
}

// 失败提示
export function errorMsg (msg) {
  this.$notify.error({
    title: '操作结果',
    message: msg,
    position: 'bottom-right'
  })
}

export function downloadFile (fileName, blob) {
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}
