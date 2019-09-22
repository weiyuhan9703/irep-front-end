import React, { useState, useCallback, useEffect } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Tabs, notification, Button } from 'antd'
import styles from './InvertedIndex.module.less'
import Steps from '../../../components/steps/Steps'
import Knowledge from '../../../components/knowledge/Knowledge'
import Examination from '../../../components/examination/Examination'
import { invertedIndexCompletionQuestions, invertedIndexChoiceQuestions } from '../../../config/Constant'
import { requestFn } from '../../../utils/request'
import { useDispatch, useMappedState, State } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { invertedIndexKnowledge } from '../../../config/invertedIndexKnowledge'
import InvertedIndexExperiment from './InvertedIndexExperiment'
import { getUrlParam } from '../../../utils/util'
import { getStore } from '../../../utils/util'

const { TabPane } = Tabs

const defaultTab = getUrlParam('tab')

/**
 * 倒排索引
 */
const InvertedIndexComponent = (props: RouteComponentProps) => {
  const [activeTabKey, setActiveTabKey] = useState(defaultTab || '1')
  const [tabDisabled, setTabDisabled] = useState(defaultTab !== '3')
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  const [buttonDisabled, setbuttonDisabled] = useState(!getStore('zhuanjia'))

  useEffect(() => {
    /**
     * 更新加载索引的请求状态和成功状态
     */
    const updateLoadindexStatus = (loading: boolean, success?: boolean) => {
      dispatch({
        type: 'update_loadindex',
        payload: {
          loadindexLoading: loading,
          ...(success !== undefined ? { loadindexSuccess: success } : {})
        }
      })
    }

    /**
     * 加载索引
     */
    const loadIndex = async () => {
      const res = await requestFn(dispatch, {
        url: '/IRforCN/invertedIndex/loadIndex',
        method: 'post'
      })
      if (res && res.status === 200 && parseInt(res.data.code) === 1) {
        updateLoadindexStatus(false, true)
      } else {
        updateLoadindexStatus(false, false)
        errorTips('加载索引失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
    }

    /**
     * 根据loading状态判断是否需要加载索引
     */
    const initLoadIndex = (loading: boolean) => {
      if (loading) {
        loadIndex()
      }
    }

    /**
     * state.loadindexLoading发生变换时，触发此钩子中的函数
     */
    initLoadIndex(state.loadindexLoading)
  }, [dispatch, state.loadindexLoading])

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
   * 知识自查，完成后前往构建模型tab页
   */
  const goNextStep = () => {
    setActiveTabKey('3')
    updateHistory('/experiment/invertedIndex?tab=3')
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
    updateHistory(`/experiment/invertedIndex?tab=${tabIndex}`)
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
    props.history.replace('/experiment/pretreatment')
  }

  // 下一步
  const nextStep = () => {
    props.history.replace('/experiment/boolean')
  }

  const operations = (
    <Button hidden={buttonDisabled} onClick={lastStep}>
      上一步
    </Button>
  )

  return (
    <div className={styles.Container}>
      <Steps current="构建倒排索引表" finishedItems={2} />
      <div className={styles.Content}>
        <Tabs defaultActiveKey="1" activeKey={activeTabKey} onTabClick={tabClick} tabBarExtraContent={operations}>
          <TabPane tab="温故知新" key="1" disabled={!tabDisabled}>
            <Knowledge knowledge={invertedIndexKnowledge} />
          </TabPane>
          <TabPane tab="知识自查" key="2" disabled={!tabDisabled}>
            <Examination
              completionQuestions={invertedIndexCompletionQuestions}
              choiceQuestions={invertedIndexChoiceQuestions}
              experimentId={3}
              goNextStep={goNextStep}
            />
          </TabPane>
          <TabPane tab="构建模型页" key="3" disabled={able()}>
            <InvertedIndexExperiment />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

const InvertedIndex = withRouter(InvertedIndexComponent)

export default InvertedIndex
