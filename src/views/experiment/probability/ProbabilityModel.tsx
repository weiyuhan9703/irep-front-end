import React, { useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, Button } from 'antd'
import styles from './ProbabilityModal.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { probabilityCompletionQuestions, probabilityChoiceQuestions } from '../../../config/Constant'
import { probabilityKnowledge } from '../../../config/probabilityKnowledge'
import ProbabilityExperiment from './ProbabilityExperiment'
import { getUrlParam, getStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/**
 * 概率检索模型实验
 */
const ProbabilityModalComponet = (props: RouteComponentProps) => {
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || '1')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))

  /**
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/probability?tab=3')
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
    updateHistory(`/experiment/probability?tab=${tabIndex}`)
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
    props.history.replace('/experiment/vectorSpace')
  }

  // 下一步
  const nextStep = () => {
    props.history.replace('/experiment/language')
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
      <Steps current="构建概率检索模型" finishedItems={6} />
      <div className={styles.Content}>
        <Tabs defaultActiveKey="1" activeKey={activeTabKey} onTabClick={tabClick} tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled}>
            <Knowledge knowledge={probabilityKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2" disabled={!tabDisabled}>
            <Examination
              completionQuestions={probabilityCompletionQuestions}
              choiceQuestions={probabilityChoiceQuestions}
              experimentId={6}
              goNextStep={goNextStep}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3" disabled={able()}>
            <ProbabilityExperiment />
          </TabPane>
        </Tabs>
        <div className={styles.stepButton}>
          <Button hidden={buttonDisabled} onClick={lastStep}>
            上一步
          </Button>
          <Button hidden={buttonDisabled} onClick={nextStep}>
            下一步
          </Button>
        </div>
      </div>
    </div>
  )
}

const ProbabilityModal = withRouter(ProbabilityModalComponet)

export default ProbabilityModal
