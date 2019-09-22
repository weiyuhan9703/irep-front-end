import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, Button } from 'antd'
import styles from './BooleanModal.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { booleanCompletionQuestions, booleanChoiceQuestions } from '../../../config/Constant'
import BooleanExperiment from './BooleanExperiment'
import { booleanKnowledge } from '../../../config/booleanKnowledge'
import { getUrlParam, getStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/**
 * 布尔模型实验
 */
const BooleanModalComponet = (props: RouteComponentProps) => {
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || '1')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))

  const handleClick = () => {
    props.history.replace('/experiment/vectorSpace')
  }

  /**
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/boolean?tab=3')
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
    updateHistory(`/experiment/boolean?tab=${tabIndex}`)
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
    props.history.replace('/experiment/invertedIndex')
  }

  // 下一步
  const nextStep = () => {
    props.history.replace('/experiment/vectorSpace')
  }

  const operations = (
    <div>
      <Button className={styles.controlButton} hidden={buttonDisabled} onClick={lastStep}>
        上一步
      </Button>
      <Button className={styles.controlButton} hidden={buttonDisabled} onClick={nextStep}>
        下一步
      </Button>
    </div>
  )

  return (
    <div className={styles.Container}>
      <Steps current="构建布尔模型" finishedItems={4} />
      <div className={styles.Content}>
        <Tabs defaultActiveKey="1" activeKey={activeTabKey} onTabClick={tabClick} tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled}>
            <Knowledge knowledge={booleanKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2" disabled={!tabDisabled}>
            <Examination
              completionQuestions={booleanCompletionQuestions}
              choiceQuestions={booleanChoiceQuestions}
              experimentId={4}
              goNextStep={goNextStep}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3" disabled={able()}>
            <BooleanExperiment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const BooleanModal = withRouter(BooleanModalComponet)

export default BooleanModal
