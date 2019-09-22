import React, { useState, useEffect } from 'react'
import { Dispatch } from 'redux'
import { notification } from 'antd'
import { Actions } from '../../store/Actions'
import styles from './LoginStatus.module.less'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'

const defaultUserCount = 500

/** 登录页的登录人数统计组件 */
const LoginStatus = () => {
  const [numberStrs, setNumberStrs] = useState([''])
  const dispatch: Dispatch<Actions> = useDispatch()
  const [onlineUserNum, setOnlineUserNum] = useState(0)

  useEffect(() => {
    /** 更新在线人数 */
    const onlineUserNumReuqest = async () => {
      const res = await requestFn(dispatch, {
        url: '/user/queryOnline',
        method: 'get'
      })
      if (res && res.status === 200 && res.data && res.data.code === 0) {
        setOnlineUserNum(res.data.data)
      } else {
        errorTips('更新当前在线人数失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
    }

    onlineUserNumReuqest()
  }, [dispatch])

  /** 错误提示 */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  useEffect(() => {
    /** 获取用户总数 */
    const getLoginUserCounts = (count: number) => {
      const userNumberStrs = count.toString().split('')
      setNumberStrs(userNumberStrs)
    }

    getLoginUserCounts(defaultUserCount)
  }, [])

  /** 渲染登录过的用户数量 */
  const renderUserCount = () => {
    return numberStrs.map((i, index: number) => {
      return (
        <div key={index} className={styles.NumberBox}>
          {i}
        </div>
      )
    })
  }

  return (
    <div className={styles.Container}>
      <div className={styles.NumberRow}>{renderUserCount()}</div>
      <div className={styles.Tips}>您是第{defaultUserCount}位使用该系统的用户</div>
      <div className={styles.OnlineCount}>
        <span>当前在线人数</span>
        <span className={styles.OnlineNumber}>{onlineUserNum}</span>
        <span>人，</span>
        <span>排队</span>
        <span className={styles.OnlineNumber}>0</span>
        <span>人</span>
      </div>
      <div className={styles.Help}>实验中有任何问题请联系武汉大学杨老师解决&nbsp;联系电话: 18109300560</div>
    </div>
  )
}

export default LoginStatus
