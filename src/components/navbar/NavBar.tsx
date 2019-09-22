import React from 'react'
import { Dropdown, Button, Icon, Menu, message } from 'antd'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './NavBar.module.less'
import userAvatar from '../../assets/navbar/user.png'
import { removeAllStore, getStore } from '../../utils/util'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'

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
    name: '我的实验',
    path: '/experiment'
  },
  {
    name: '考核说明',
    path: '/description'
  },
  {
    name: '实验报告',
    path: '/report'
  },
  {
    name: '交流讨论',
    path: '/discussion'
  }
]

const NavBarComponet = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()

  const logOut = async () => {
    const res = await requestFn(dispatch, {
      url: '/user/out',
      method: 'post'
    })
    if (res && res.status === 200 && res.data) {
      removeAllStore()
      window.location.href = window.location.origin
    }
  }

  const menu = (
    <Menu onClick={logOut}>
      <Menu.Item key="1">注销</Menu.Item>
    </Menu>
  )

  const handleActive = (path: string) => {
    return window.location.pathname.includes(path)
  }

  /** 点击导航栏菜单项 */
  const goRoute = (path: string) => {
    const currentPath = window.location.pathname
    if (currentPath.includes('experiment') && path === '/experiment') {
      return false
    } else if (
      currentPath !== '/experiment/index' &&
      currentPath.includes('experiment') &&
      !getStore('finishedAllExperiments')
    ) {
      message.warning('你还有实验没有完成,请先完成实验', 1.5)
    } else {
      props.history.replace(path)
    }
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
      <div className={styles.Logo}></div>
      <div className={styles.Nav}>
        <ul className={styles.NavItems}>{renderNavs()}</ul>
      </div>
      <Dropdown overlay={menu} className={styles.Dropdown}>
        <div>
          <img src={userAvatar} alt="用户图标" />
          <Button ghost className={styles.DropdownBtn}>
            <span className={styles.UserName}>{getStore('user') ? getStore('user').username : '张三'}</span>
            <Icon type="caret-down" />
          </Button>
        </div>
      </Dropdown>
    </div>
  )
}

const NavBar = withRouter(NavBarComponet)

export default NavBar
