import React, { useState, useCallback } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, notification, Button } from 'antd'
import styles from './Entry.module.less'
import StepsExam from '../../../components/steps/StepsExam'
import EntryExperiment from './EntryExperiment'
import { entryCompletionQuestions, entryChoiceQuestions } from '../../../config/Constant'
import Examination from '../../../components/examination/Examination'
import { requestFn } from '../../../utils/request'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import Knowledge from '../../../components/knowledge/Knowledge'
import { entryKnowledge } from '../../../config/entryKnowledge'
import { getUrlParam } from '../../../utils/util'
import { getStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

const EntryComponent = (props: RouteComponentProps) => {
  const [loading, setLoading] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || '1')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))

  /**
   * 成功提示
   */
  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      duration: 1.5,
      description
    })
  }

  /**
   * 错误提示
   */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
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
    updateHistory(`/experiment/entry?tab=${tabIndex}`)
    setActiveTabKey(tabIndex)
  }

  /**
   * 获取用户排序的索引
   */
  const getStepIndex = (steps: { name: string }[], cards: ExperimentCard[]) => {
    const newCards = cards.map(i => i)
    newCards.sort((pre, cur) => pre.correctIndex - cur.correctIndex)
    const stepIndex = []
    for (let i of newCards) {
      const index = steps.findIndex(j => j.name === i.name)
      // 接口排序的index从1开始
      stepIndex.push(index + 1)
    }
    return stepIndex
  }

  /**
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/entry?tab=3')
    setTabDisabled(false)
  }

  /**
   * 保存构建模型并前往下一步
   */
  const saveExperiment = async () => {
    setLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateRankingScore',
      method: 'post',
      data: {
        experimentId: 1,
        rankingResult: getStepIndex(state.steps, state.entryExperimentCards)
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('保存顺序成功', '')
      setTimeout(() => {
        setLoading(false)
        props.history.replace('/experiment/pretreatment')
      }, 1000)
    } else {
      setLoading(false)
      errorTips('保存顺序失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  const operations = (
    <Button
      hidden={buttonDisabled}
      onClick={() => {
        props.history.replace('/experiment/pretreatment')
      }}>
      下一步
    </Button>
  )

  const able = () => {
    if (getStore('zhuanjia')) {
      return false
    } else {
      return tabDisabled
    }
  }

  return (
    <div className={styles.Container}>
      <StepsExam />
      <div className={styles.Content}>
        <Tabs defaultActiveKey="1" activeKey={activeTabKey} onTabClick={tabClick} tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled}>
            <Knowledge knowledge={entryKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2" disabled={!tabDisabled}>
            <Examination
              completionQuestions={entryCompletionQuestions}
              choiceQuestions={entryChoiceQuestions}
              experimentId={1}
              goNextStep={goNextStep}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3" disabled={able()}>
            <EntryExperiment save={saveExperiment} loading={loading} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const Entry = withRouter(EntryComponent)

export default Entry
