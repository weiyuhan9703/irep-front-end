/** 存储sessionStorage */
export const setStore = (name: string, content: string | {} | []) => {
  if (!name) {
    return false
  }
  let param = ''
  if (typeof content !== 'string') {
    param = JSON.stringify(content)
  } else {
    param = content
  }
  window.sessionStorage.setItem(name, param)
}

/** 获取sessionStorage */
export const getStore = (name: string) => {
  if (!name) {
    return false
  }
  try {
    const json = window.sessionStorage.getItem(name) || ''
    return JSON.parse(json)
  } catch (error) {
    return window.sessionStorage.getItem(name)
  }
}

/** 删除sessionStorage */
export const removeStore = (name: string) => {
  if (!name) {
    return false
  }
  window.sessionStorage.removeItem(name)
}

/** 删除所有的sessionStorage */
export const removeAllStore = () => {
  window.sessionStorage.clear()
}

/** 存储localStorage */
export const setLocalStore = (name: string, content: string | {} | []) => {
  if (!name) {
    return false
  }
  let param = ''
  if (typeof content !== 'string') {
    param = JSON.stringify(content)
  } else {
    param = content
  }
  window.localStorage.setItem(name, param)
}

/** 获取localStorage */
export const getLocalStore = (name: string) => {
  if (!name) {
    return false
  }
  try {
    const json = window.localStorage.getItem(name) || ''
    return JSON.parse(json)
  } catch (error) {
    return window.localStorage.getItem(name)
  }
}

/** 删除localStorage */
export const removeLocalStore = (name: string) => {
  if (!name) {
    return false
  }
  window.localStorage.removeItem(name)
}

/** 删除所有的localStorage */
export const removeAllLocalStore = () => {
  window.localStorage.clear()
}

/** 获取url中的参数 */
export const getUrlParam = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const param = window.location.search.substr(1).match(reg)
  if (param) {
    return decodeURIComponent(param[2])
  } else {
    return null
  }
}
