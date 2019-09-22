import axios, { ResponseType, Method, AxiosPromise, AxiosResponse } from 'axios'
import { Dispatch } from 'redux'
import Qs from 'qs'
import { Modal } from 'antd'
import { Actions } from '../store/Actions'
import { API_URL, REQUEST_TIME_OUT } from '../config/Constant'
import { removeAllStore, removeAllLocalStore } from './util'

/** token过期错误提示次数(token过期时，一个页面可能会有多次请求，只显示第一次的错误提示) */
let expiredCount = 0

/** requestFn参数接口类型 */
export interface Params {
  url: string
  method?: Method
  params?: {}
  data?: {} | string
  responseType?: ResponseType
}

/** token过期处理 */
const tokenExpired = () => {
  if (!expiredCount) {
    expiredCount += 1
    Modal.error({
      title: '你的登录信息已过期',
      content: '因长时间未操作，你的登录信息已过期，点击确定重新登录。',
      okText: '确定',
      onOk: () => {
        removeAllStore()
        removeAllLocalStore()
        window.location.reload()
      }
    })
  }
}

/** 通用网络请求 */
export const requestFn = (dispatch: Dispatch<Actions>, params: Params): AxiosPromise => {
  return new Promise((resolve, reject) => {
    dispatch({
      type: 'fetch_begin',
      payload: {
        pageLoading: true
      }
    })
    axios.interceptors.response.use(
      response => {
        return response
      },
      error => {
        if (error.response && error.response.status === 401 && error.response.config.url.indexOf('/login') === -1) {
          tokenExpired()
          return reject(error)
        } else {
          if (error.message.includes('timeout')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result: AxiosResponse<any> = {
              data: { msg: '请求超时' },
              status: 408,
              statusText: '请求超时',
              headers: error.config.headers,
              config: error.config
            }
            return resolve(result)
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result: AxiosResponse<any> = {
              data: error.response && error.response.data ? error.response.data : null,
              status: error.response && error.response.status ? error.response.status : 500,
              statusText: error.message,
              headers: error.config.headers,
              config: error.config
            }
            return resolve(result)
          }
        }
      }
    )
    axios
      .request({
        url: params.url,
        method: params.method || 'get',
        baseURL: `/api/${API_URL}`,
        params: params.params || {},
        paramsSerializer: arg => {
          // https://github.com/ljharb/qs
          // https://blog.csdn.net/pifutan/article/details/86320705
          return Qs.stringify(arg, { arrayFormat: 'repeat' })
        },
        headers: {
          // 某些请求data直接是数组或字符串，这里需要改变Content-Type值
          ...(params.data && typeof params.data === 'string' ? { 'Content-Type': 'text/uri-list' } : {})
        },
        data:
          params.data && typeof params.data === 'string'
            ? params.data
            : {
                ...(params.data || {})
              },
        timeout: REQUEST_TIME_OUT,
        validateStatus: status => {
          // 除了401错误，所有响应码都接受，每个请求错误单独处理。
          return status !== 401
        },
        responseType: params.responseType || 'json',
        withCredentials: true
      })
      .then(res => {
        dispatch({
          type: 'fetch_success',
          payload: {
            res,
            pageLoading: false
          }
        })
        resolve(res)
      })
      .catch(err => {
        dispatch({
          type: 'fetch_failed',
          payload: {
            res: err,
            pageLoading: false
          }
        })
        reject(err)
      })
  })
}
