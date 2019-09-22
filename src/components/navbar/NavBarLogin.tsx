import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './NavBarLogin.module.less'

const navs = [
  {
    name: '实验简介',
    path: '/introduction'
  },
  {
    name: '实验指导',
    path: '/guide'
  },
  {
    name: '系统公告',
    path: '/notice'
  },
  {
    name: '考核说明',
    path: '/description'
  },
  {
    name: '联系我们',
    path: '/contactus'
  }
]

const NavBarComponet = (props: RouteComponentProps) => {
  const handleActive = (path: string) => {
    return window.location.pathname.includes(path)
  }

  const goRoute = (path: string) => {
    props.history.push(path)
  }

  const renderNavs = () => {
    return navs.map(i => {
      return (
        <li key={i.name} className={styles.Item} onClick={() => goRoute(i.path)}>
          <span className={`${styles.NavText} ${handleActive(i.path) ? styles.Active : ''}`}>{i.name}</span>
        </li>
      )
    })
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Logo} onClick={() => goRoute('/')}></div>
      <ul className={styles.NavItems}>{renderNavs()}</ul>
      <div className={styles.ButtonGroup}>
        <Button type="primary" className={styles.LoginBtn} onClick={() => goRoute('/login')}>
          登录
        </Button>
        <Button type="primary" ghost onClick={() => goRoute('/register')}>
          注册
        </Button>
      </div>
    </div>
  )
}

const NavBarLogin = withRouter(NavBarComponet)

export default NavBarLogin
