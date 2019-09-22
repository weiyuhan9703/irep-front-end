import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, Button } from 'antd'
import styles from './Pretreatment.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { pretreatmentCompletionQuestions, pretreatmentChoiceQuestions } from '../../../config/Constant'
import { pretreatmentKnowledge } from '../../../config/pretreatmentKnowledge'
import PretreatmentExperiment from './PretreatmentExperiment'
import { getUrlParam } from '../../../utils/util'
import { getStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/**
 * 预处理实验
 */
const PretreatmentComponet = (props: RouteComponentProps) => {
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || '1')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))

  // const handleClick = () => {
  //   props.history.replace('/experiment/invertedIndex')
  // }

  /**
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/pretreatment?tab=3')
    setTabDisabled(false)
  }

  /**
   * 更新浏览器历史记录
   *
   * 方便刷新页面时保持tab状态
   */
  const updateHistory = (url: string, name = '') => {
    window.history.replaceState(null, name, url)
  }

  /**
   * 点击tab
   */
  const tabClick = (tabIndex: string) => {
    updateHistory(`/experiment/pretreatment?tab=${tabIndex}`)
    setActiveTabKey(tabIndex)
  }

  // 专家进入的可切换前后步骤
  const able = () => {
    if (getStore('zhuanjia')) {
      return false
    } else {
      return tabDisabled
    }
  }

  // 上一步
  const lastStep = () => {
    props.history.replace('/experiment/entry')
  }

  // 下一步
  // const nextStep = () => {
  //   props.history.replace('/experiment/invertedIndex')
  // }

  const operations = (
    <Button className={styles.controlButton} hidden={buttonDisabled} onClick={lastStep}>
      上一步
    </Button>
  )

  return (
    <div className={styles.Container}>
      <Steps current="构建预处理器" finishedItems={1} />
      <div className={styles.Content}>
        <Tabs defaultActiveKey="1" activeKey={activeTabKey} onTabClick={tabClick} tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled}>
            <Knowledge knowledge={pretreatmentKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2" disabled={!tabDisabled}>
            <Examination
              completionQuestions={pretreatmentCompletionQuestions}
              choiceQuestions={pretreatmentChoiceQuestions}
              experimentId={2}
              goNextStep={goNextStep}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3" disabled={able()}>
            <PretreatmentExperiment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const Pretreatment = withRouter(PretreatmentComponet)

export default Pretreatment
