import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Icon } from 'antd'
import styles from './Experiment.module.less'
import { setStore } from '../../utils/util'

/** 实验入口页 */
const ExperimentComponent = (props: RouteComponentProps) => {
  const handleClick = () => {
    setStore('startDate', new Date().getTime())
    props.history.replace('/experiment/entry')
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <h1 className={styles.heading}>网络大数据搜索引擎虚拟仿真实验</h1>
        <div className={styles.line}></div>
        <h2 className={styles.subHeading}>准确理解搜索引擎</h2>
        <h2 className={styles.subHeading}>让信息检索技术触手可及</h2>
        <Button className={styles.button} type="default" onClick={handleClick}>
          <span>
            开启你的搜索引擎
            <br />
            设计之旅
          </span>
          <Icon className={styles.icon} type="search" />
        </Button>
      </div>
    </div>
  )
}

/** 实验入口页 */
const Experiment = withRouter(ExperimentComponent)

export default Experiment
