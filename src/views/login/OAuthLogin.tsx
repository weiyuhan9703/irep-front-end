import React, { useState, useEffect } from 'react'
import { Dispatch } from 'redux'
import { Spin, Result } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'
import { setStore, getUrlParam } from '../../utils/util'
import styles from './OAuthLogin.module.less'

interface Params {
  userName: string
  password: string
}

const OAuthLoginWithoutRouter = (props: RouteComponentProps) => {
  const [loading, setLoading] = useState(true)
  const [successed, setSuccessed] = useState(false)
  const dispatch: Dispatch<Actions> = useDispatch()

  useEffect(() => {
    /** 解析token */
    const parseToken = async (token: string) => {
      const res = await requestFn(dispatch, {
        url: '/platform/decode',
        params: {
          token: encodeURI(token)
        }
      })
      if (res && res.status === 200 && res.data && res.data.code === 101) {
        setStore('user', { username: res.data.data.u1, id: res.data.data.username })
        setSuccessed(true)
        setLoading(false)
        setStore("source",'1')
        setTimeout(() => {
          // 使用原生跳转，以更新权限
          window.location.href = '/experiment/index'
        }, 1500)
      } else {
        setLoading(false)
        setSuccessed(false)
        setTimeout(() => {
          props.history.replace('/login')
        }, 1500)
      }
    }

    if (getUrlParam('token')) {
      const token = getUrlParam('token') + ''
      parseToken(token)
    }
  }, [dispatch, props.history])

  const renderLoginStatus = () => {
    if (loading) {
      return <Spin spinning={loading} size="large" tip="正在登录" className={styles.Loading}></Spin>
    } else if (successed) {
      return <Result status="success" title="授权登录成功" subTitle="即将跳转实验页面" />
    } else {
      return <Result status="error" title="授权登录失败" subTitle="即将跳转登录页面" />
    }
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Logo}></div>
      {renderLoginStatus()}
    </div>
  )
}

const OAuthLogin = withRouter(OAuthLoginWithoutRouter)

export default OAuthLogin
