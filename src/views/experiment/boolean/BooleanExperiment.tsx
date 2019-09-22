import React, { useCallback, useState } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Icon, notification, Input, Spin, Select, Form } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import styles from './BooleanExperiment.module.less'
import Arrow from '../../../assets/experiment/vectorSpace/arrow.png'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { requestFn } from '../../../utils/request'

const { Option } = Select

type Operator = 'or' | 'and' | 'not' | 'OR' | 'AND' | 'NOT'

interface BooleanExperimentProps extends FormComponentProps, RouteComponentProps {}

/** 查询预处理结果接口 */
interface PreProcessQuery {
  query: string
  result: string
}

/** 计算布尔向量结果接口 */
interface BoolVector {
  docIds: number[]
  term: string
}

/** 运行布尔运算结果接口 */
interface BooleanOperation {
  leftSet: number[]
  leftTerm: string
  operator: Operator
  resultSet: number[]
  rightSet: number[]
  rightTerm: string
}

/** 召回目标文档结果接口 */
interface CallBackResult {
  docId: number
  similarity: number
  title: string
}

/** 仿真我的搜索引擎的检索结果接口 */
interface SearchResult {
  content: string
  docId: number
  title: string
  url: string
}

/** 保存操作步骤结果提示接口 */
interface Tips {
  success: { title: string; description: string }
  error: { title: string; description: string }
}

/** 默认的检索关键词 */
const defaultSearchTerms = ['', '', '']

/** 默认的检索条件逻辑关系符 */
const defaultOperators: Operator[] = ['or', 'or']

/** 默认的查询预处理结果 */
const defaultPreProcessQuery: PreProcessQuery = {
  query: '',
  result: ''
}

const BooleanExperimentComponent = (props: BooleanExperimentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  // 保存顺序加载状态
  const [saveOrderLoading, setSaveOrderLoading] = useState(false)
  // 仿真我的搜索引擎，输入框中的值
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  // 仿真我的搜索引擎步骤索引
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [lastStepIndex, setLastStepIndex] = useState(0)
  // 仿真我的搜索引擎，每一步的请求loading状态
  const [stepLoading, setStepLoading] = useState(false)
  const [searchTerms, setSearchTerms] = useState(defaultSearchTerms)
  const [searchOperators, setSearchOperators] = useState<Operator[]>(defaultOperators)
  // 查询预处理结果
  const [preProcessQueryResult, setPreProcessQueryResult] = useState<PreProcessQuery>(defaultPreProcessQuery)
  // 计算布尔向量结果
  const [boolVectorResult, setBoolVectorResult] = useState<BoolVector[]>([])
  // 运行布尔运算结果
  const [booleanOperationResult, setBooleanOperationResult] = useState<BooleanOperation[]>([])
  // 召回目标文档结果
  const [callBackResult, setCallBackResult] = useState<CallBackResult[]>([])
  // 检索结果
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  const [nextLoading, setNextLoading] = useState(false)

  const { getFieldDecorator, validateFields, getFieldsValue } = props.form

  /** 保存用户选择的构建顺序 */
  const saveOrder = async () => {
    setSaveOrderLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateRankingScore',
      method: 'post',
      data: {
        experimentId: 4,
        rankingResult: getStepIndex(state.booleanExperimentSteps, state.booleanExperimentCards)
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('保存顺序成功', '')
      updateSaveOrderBtnStatus()
    } else {
      errorTips('保存顺序失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setSaveOrderLoading(false)
  }

  /** 成功提示 */
  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      duration: 1.5,
      description
    })
  }

  /** 错误提示 */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  /** 获取用户排序的索引 */
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

  const shouldRemoveCard = (bool: boolean, name: string, index: number) => {
    if (!bool) {
      return false
    } else {
      removeCard(name, index)
    }
  }

  /** 点击方框移除已放入的卡片 */
  const removeCard = (name: string, index: number) => {
    dispatch({
      type: 'handle_booleanExperiment_card',
      payload: {
        name,
        type: 'remove',
        index
      }
    })
  }

  /** 点击方框放入卡片 */
  const addCard = (index: number) => {
    const currentIndex = state.booleanExperimentCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_booleanExperiment_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  /** 更新布尔模型实验，保存顺序按钮的状态 */
  const updateSaveOrderBtnStatus = () => {
    dispatch({
      type: 'update_saveOrderBtnStatus',
      payload: {
        field: 'bool'
      }
    })
  }

  /** 渲染方框中的卡片 */
  const renderCard = (name: string, index: number) => {
    if (name) {
      return (
        <div className={`${styles.Name}`} onClick={() => shouldRemoveCard(!state.saveOrderBtn.bool.saved, name, index)}>
          <span>{`${index + 1}.${name}`}</span>
          <div className={styles.IconWrapper}>
            <Icon type="close-circle" className={styles.Icon} />
          </div>
        </div>
      )
    } else {
      return (
        <span className={styles.Index} onClick={() => addCard(index)}>
          {index + 1}
        </span>
      )
    }
  }

  /** 选中卡片 */
  const selectCard = (name: string, index: number, disabled: boolean) => {
    if (disabled) {
      return false
    }
    dispatch({
      type: 'handle_booleanExperiment_card',
      payload: {
        name,
        type: 'selected',
        index
      }
    })
  }

  /** 渲染卡片排序区域 */
  const renderCardSection = () => {
    return (
      <>
        <div className={styles.ExamBox}>
          <div className={styles.BoxWrapper}>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.bool.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.booleanExperimentSteps[0].name, 0)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.bool.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.booleanExperimentSteps[1].name, 1)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.bool.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.booleanExperimentSteps[2].name, 2)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.bool.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.booleanExperimentSteps[3].name, 3)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.BoxContainer}>{renderCards()}</div>
        <div className={styles.SaveOrder}>
          <Button
            type="primary"
            disabled={!state.saveOrderBtn.bool.completed || state.saveOrderBtn.bool.saved}
            loading={saveOrderLoading}
            onClick={saveOrder}>
            保存
          </Button>
        </div>
      </>
    )
  }

  /** 渲染卡片列表 */
  const renderCards = () => {
    return state.booleanExperimentCards.map((i, index) => {
      return (
        <div
          key={index}
          className={`${styles.Card} ${i.disabled ? styles.CardDisabled : i.current ? styles.CurrentCard : ''}`}
          onClick={() => selectCard(i.name, index, i.disabled)}>
          {i.name}
        </div>
      )
    })
  }

  /** 仿真我的搜索引擎，点击检索按钮 */
  const beforeSearch = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFields((err: any) => {
      if (!err) {
        const fieldValue = getFieldsValue()
        const queryString = handleSearchQuery(fieldValue)
        setQuery(queryString)
        searchQuery(queryString)
      }
    })
  }

  /** 处理仿真我的搜索引擎表单参数 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchQuery = (fieldValue: any) => {
    let str = ''
    for (let i = 0; i < searchTerms.length; i++) {
      if (i === searchTerms.length - 1) {
        str += fieldValue[`terms_${i}`]
        continue
      }
      str += fieldValue[`terms_${i}`] + ' ' + fieldValue[`operator_${i}`] + ' '
    }
    return str
  }

  /** 检索请求 */
  const searchQuery = async (query: string) => {
    setSearchLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/boolModel/search',
      method: 'post',
      data: {
        query
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      const tips: Tips = {
        success: {
          title: '检索成功',
          description: '操作-"仿真布尔模型"已保存'
        },
        error: {
          title: '检索失败',
          description: '操作-"仿真布尔模型"保存失败'
        }
      }
      saveOperationStep('仿真倒排索引表', tips, res.data)
    } else {
      setSearchLoading(false)
      errorTips('检索失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /** 保存操作步骤 */
  const saveOperationStep = async (
    operationName: string,
    tips: Tips,
    data: SearchResult[] | PreProcessQuery | BoolVector[] | BooleanOperation[] | CallBackResult[],
    index = 0
  ) => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 4,
        operationName
      }
    })
    if (res && res.status === 200 && res.data) {
      handleAfterSaveOperationStep(operationName, data, index)
      successTips(tips.success.title, tips.success.description)
    } else {
      setSearchLoading(false)
      setStepLoading(false)
      errorTips(tips.error.title, res && res.data && res.data.msg ? res.data.msg : tips.error.description)
    }
  }

  /** 保存操作步骤与之后需要做的操作 */
  const handleAfterSaveOperationStep = (
    operationName: string,
    data: SearchResult[] | PreProcessQuery | BoolVector[] | BooleanOperation[] | CallBackResult[],
    index = 0
  ) => {
    if (operationName === '仿真倒排索引表') {
      setSearchResult(data as SearchResult[])
      setCurrentStepIndex(0)
      setSearchLoading(false)
    } else {
      setCurrentStepIndex(index + 1)
      handleStepSearchResult(index, data as PreProcessQuery | BoolVector[] | BooleanOperation[] | CallBackResult[])
      if (index === 3) {
        setLastStepIndex(index + 1)
      }
      setStepLoading(false)
    }
  }

  /** 仿真搜索引擎添加表单项 */
  const addSearchFormItem = () => {
    setSearchTerms([...searchTerms, ''])
    setSearchOperators([...searchOperators, 'or'])
  }

  /** 仿真搜索引擎移除一个表单项 */
  const removeSearchFormItem = (index: number) => {
    const newTerms = searchTerms.filter((_, idx) => idx !== index)
    const newOperators = searchOperators.filter((_, idx) => idx !== index)
    setSearchTerms(newTerms)
    setSearchOperators(newOperators)
  }

  /** 渲染仿真我的搜索引擎单个表单项 */
  const renderSearchFormItem = () => {
    return searchTerms.map((i, index) => {
      return (
        <div key={index} className={styles.SearchRow}>
          {renderSearchFormAddBtn(index)}
          {renderSelectItem(index)}
          <Form.Item className={`${styles.FormItem}`}>
            {getFieldDecorator(`terms_${index}`, {
              rules: [{ required: true, message: '请输入检索关键词' }]
            })(<Input autoComplete="off" size="large" />)}
          </Form.Item>
          {renderSearchBtn(index === searchTerms.length - 1)}
        </div>
      )
    })
  }

  /** 渲染仿真我的搜索引擎表单项的新增和删除按钮 */
  const renderSearchFormAddBtn = (index: number) => {
    if (index === 0) {
      return (
        <Button className={styles.Button} type="primary" onClick={addSearchFormItem}>
          <Icon type="plus" />
        </Button>
      )
    } else {
      return (
        <Button className={styles.Button} type="primary" onClick={() => removeSearchFormItem(index)}>
          <Icon type="minus" />
        </Button>
      )
    }
  }

  /** 渲染仿真我的搜索引擎表单中的下拉选择框 */
  const renderSelectItem = (index: number) => {
    if (index === 0) {
      return <span className={styles.SearchLabel}>基础条件:</span>
    } else {
      return (
        <Form.Item className={`${styles.FormItem}`}>
          {getFieldDecorator(`operator_${index - 1}`, {
            initialValue: 'OR'
          })(
            <Select className={styles.SearchSelect} size="large">
              <Option value="AND">and</Option>
              <Option value="OR">or</Option>
              <Option value="NOT">not</Option>
            </Select>
          )}
        </Form.Item>
      )
    }
  }

  /** 渲染仿真我的搜索引擎表单中的检索按钮 */
  const renderSearchBtn = (showBtn: boolean) => {
    if (showBtn) {
      return (
        <Button
          type="primary"
          size="large"
          disabled={!state.saveOrderBtn.bool.saved}
          loading={searchLoading}
          className={styles.SearchFormBtn}
          onClick={beforeSearch}>
          检索
        </Button>
      )
    }
  }

  /** 仿真我的搜索引擎 */
  const getMonitorResult = async (param: { url: string; operationName: string }, index: number) => {
    setStepLoading(true)
    const res = await requestFn(dispatch, {
      url: param.url,
      method: 'post',
      data: {
        query
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      const tips: Tips = {
        success: {
          title: '检索成功',
          description: `操作-"${param.operationName}"已保存`
        },
        error: {
          title: '检索失败',
          description: `操作-"${param.operationName}"保存失败`
        }
      }
      saveOperationStep(param.operationName, tips, res.data, index)
    } else {
      setStepLoading(false)
      errorTips('检索失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /** 处理每一步检索的结果 */
  const handleStepSearchResult = (
    index: number,
    result: PreProcessQuery | BoolVector[] | BooleanOperation[] | CallBackResult[]
  ) => {
    switch (index) {
      case 0:
        setPreProcessQueryResult(result as PreProcessQuery)
        break
      case 1:
        setBoolVectorResult(result as BoolVector[])
        break
      case 2:
        setBooleanOperationResult(result as BooleanOperation[])
        break
      case 3:
        setCallBackResult(result as CallBackResult[])
        break
      default:
        setPreProcessQueryResult(result as PreProcessQuery)
        break
    }
  }

  /** 处理当前步骤的按钮点击事件 */
  const handleCurrentStep = (index: number) => {
    const requestParams = [
      {
        url: '/IRforCN/Retrieval/boolModel/ppq',
        operationName: '布尔模型查询预处理'
      },
      {
        url: '/IRforCN/Retrieval/boolModel/boolVector',
        operationName: '计算布尔向量'
      },
      {
        url: '/IRforCN/Retrieval/boolModel/booleanOperation',
        operationName: '运行布尔运算'
      },
      {
        url: '/IRforCN/Retrieval/boolModel/callbackResult',
        operationName: '召回目标文档'
      }
    ]
    getMonitorResult(requestParams[index], index)
  }

  /** 渲染仿真我的搜索引擎模块，每个步骤按钮的点击状态 */
  const renderStepButton = (name: string, loading: boolean, setpIndex: number) => {
    if (currentStepIndex >= setpIndex) {
      return (
        <Button
          loading={currentStepIndex === setpIndex && loading}
          type="link"
          className={styles.LinkButton}
          onClick={() => handleCurrentStep(setpIndex)}>
          {name}
        </Button>
      )
    } else {
      return <span>{name}</span>
    }
  }

  /** 渲染检索步骤 */
  const renderSearchSteps = () => {
    if (state.saveOrderBtn.bool.saved) {
      return (
        <div>
          <div className={styles.ExamBox}>
            <div className={styles.BoxWrapper}>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 0 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('查询预处理', stepLoading, 0)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 1 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('计算布尔向量', stepLoading, 1)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 2 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('进行布尔运算', stepLoading, 2)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 3 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('召回目标文档', stepLoading, 3)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div className={styles.StepTips}>请先按顺序构建布尔模型，并保存</div>
    }
  }

  /** 渲染搜索结果 */
  const renderSearchResult = (index: number) => {
    switch (index) {
      case 0:
        return renderCommonSearchResult()
      case 1:
        return renderPreProcessQueryResult()
      case 2:
        return renderBoolVectorResult()
      case 3:
        return renderBooleanOperationResult()
      case 4:
        return renderCallBackResult()
      default:
        return renderCommonSearchResult()
    }
  }

  /** 渲染点击检索按钮后的结果 */
  const renderCommonSearchResult = () => {
    return <div className={styles.CommonResult}>{renderSearchResultList()}</div>
  }

  /** 渲染检索结果列表
   *
   * 仅适用于直接点击检索按钮时
   */
  const renderSearchResultList = () => {
    return searchResult.map((i, index) => {
      return (
        <div key={index} className={styles.CommonRow}>
          <a href={i.url} target="_blank" rel="noopener noreferrer" className={styles.CommonLink}>
            {i.title}
          </a>
          <div className={styles.ItemContent}>{i.content}</div>
        </div>
      )
    })
  }

  /** 渲染查询预处理的结果 */
  const renderPreProcessQueryResult = () => {
    return (
      <div className={styles.Result}>
        <p className={styles.PreProcessResultRow}>
          <span className={styles.Label}>处理前的检索条件:</span>
          <span>{preProcessQueryResult.query}</span>
        </p>
        <p className={styles.PreProcessResultRow}>
          <span className={styles.Label}>处理后的检索条件:</span>
          <span>{preProcessQueryResult.result}</span>
        </p>
      </div>
    )
  }

  /** 渲染计算布尔向量结果 */
  const renderBoolVectorResult = () => {
    return (
      <div className={styles.BoolVectorResult}>
        {boolVectorResult.map((i, index) => {
          return (
            <div key={index} className={styles.BoolVectorRow}>
              <p>
                <span className={styles.BoolVectorLabel}>词项:</span>
                <span>{i.term}</span>
              </p>
              <p>
                <span className={styles.BoolVectorLabel}>存在于文档:</span>
                <span>{i.docIds.join(', ')}</span>
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  /** 渲染运行布尔运算结果 */
  const renderBooleanOperationResult = () => {
    return (
      <div className={styles.BooleanOperationResult}>
        {booleanOperationResult.map((i, index) => {
          return (
            <div key={index} className={styles.BooleanOperationRow}>
              <p>
                <span className={styles.BooleanOperationLabel}>左侧词项</span>
                <span>{i.leftTerm}</span>
              </p>
              <p>
                <span className={styles.BooleanOperationLabel}>左侧集合</span>
                <span>{i.leftSet.join(', ')}</span>
              </p>
              <p>
                <span className={styles.BooleanOperationLabel}>分割符</span>
                <span>{i.operator}</span>
              </p>
              <p>
                <span className={styles.BooleanOperationLabel}>右侧词项</span>
                <span>{i.rightTerm}</span>
              </p>
              <p>
                <span className={styles.BooleanOperationLabel}>右侧集合</span>
                <span>{i.rightSet.join(', ')}</span>
              </p>
              <p>
                <span className={styles.BooleanOperationLabel}>结果集合</span>
                <span>{i.resultSet.join(', ')}</span>
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  /** 渲染召回目标文档结果 */
  const renderCallBackResult = () => {
    return (
      <div className={styles.CallBackResult}>
        {callBackResult.map((i, index) => {
          return (
            <div key={index} className={styles.CallBackRow}>
              <p>
                <span className={styles.CallBackLabel}>文档Id</span>
                <span>{i.docId}</span>
              </p>
              <p>
                <span className={styles.CallBackLabel}>文档标题</span>
                <span>{i.title}</span>
              </p>
              <p>
                <span className={styles.CallBackLabel}>相似度</span>
                <span>{i.similarity}</span>
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  /** 页面底部，点击前往下一步 */
  const goNextExperiment = async () => {
    setNextLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/boolModel/quit',
      method: 'post',
      data: {
        query
      }
    })
    setNextLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      props.history.replace('/experiment/vectorSpace')
    } else {
      errorTips('保存实验操作失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>请按正确顺序构建布尔模型：</div>
        {renderCardSection()}
        <div className={styles.SectionTitle}>仿真我的搜索引擎：</div>
        <div className={styles.SearchWrapper}>{renderSearchFormItem()}</div>
        <Spin spinning={searchLoading}>{renderSearchSteps()}</Spin>
        <p className={styles.SearchResultTitle}>检索结果:</p>
        <Spin spinning={stepLoading}>
          <div className={styles.SearchResult}>{renderSearchResult(currentStepIndex)}</div>
        </Spin>
      </div>
      <Button
        type="primary"
        loading={nextLoading}
        disabled={lastStepIndex !== 4}
        onClick={goNextExperiment}
        className={styles.NextBtn}>
        下一步
      </Button>
    </div>
  )
}

const BooleanExperimentWithoutRouter = Form.create<BooleanExperimentProps>({ name: 'BooleanExperimentComponent' })(
  BooleanExperimentComponent
)

/** 布尔模型实验 */
const BooleanExperiment = withRouter(BooleanExperimentWithoutRouter)

export default BooleanExperiment
