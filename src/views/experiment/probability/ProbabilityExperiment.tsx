import React, { useCallback, useEffect, useState } from 'react'
import { Button, Icon, InputNumber, Select, notification, Input, Spin, Table } from 'antd'
import { Dispatch } from 'redux'
import { debounce } from 'lodash'
import { withRouter, RouteComponentProps } from 'react-router'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import styles from './ProbabilityExperiment.module.less'
import { requestFn } from '../../../utils/request'
import Arrow from '../../../assets/experiment/vectorSpace/arrow.png'
import { vectorSpaceQueryOptions } from '../../../config/Constant'
import { StandardResult } from '../../../modal/VectorSpace'
import { SearchResult, VectorSpacePreProcessQuery, QueryBIJResult, QuerySimilarityResult } from '../../../modal/Search'

/**
 * 列对齐方式类型(与ant-design保持一致)
 */
type columnAlignType = 'center' | 'left' | 'right' | undefined

/**
 * 保存操作步骤结果提示接口
 */
interface Tips {
  success: { title: string; description: string }
  error: { title: string; description: string }
}

/**
 * 概率检索模型--公式代码
 */
const formulas = [
  `<math>
    <mi> Sim </mi>
    <mfenced>
        <mrow>
            <msub>
                <mrow>
                    <mi> D </mi>
                </mrow>
                <mrow>
                    <mi> j </mi>
                </mrow>
            </msub>
            <mo> , </mo>
            <mi> q </mi>
        </mrow>
    </mfenced>
    <mo> = </mo>
    <munder>
        <mrow>
            <mo> &#x2211; <!-- n-ary summation --> </mo>
        </mrow>
        <mrow>
            <msub>
                <mrow>
                    <mi> t </mi>
                </mrow>
                <mrow>
                    <mi> i </mi>
                </mrow>
            </msub>
            <mo> &#x2208; <!-- element of --> </mo>
            <mi> q </mi>
        </mrow>
    </munder>
    <mfrac>
        <mrow>
            <mfenced>
                <mrow>
                    <mi> k </mi>
                    <mo> + </mo>
                    <mn> 1 </mn>
                </mrow>
            </mfenced>
            <msub>
                <mrow>
                    <mi> f </mi>
                </mrow>
                <mrow>
                    <mi> i </mi>
                    <mo> , </mo>
                    <mi> j </mi>
                </mrow>
            </msub>
        </mrow>
        <mrow>
            <mi> k </mi>
            <mfenced open="[" close="]">
                <mrow>
                    <mfenced>
                        <mrow>
                            <mn> 1 </mn>
                            <mo> - </mo>
                            <mi> b </mi>
                        </mrow>
                    </mfenced>
                    <mo> + </mo>
                    <mi> b </mi>
                        <mrow>
                            <mfrac>
                                <mrow>
                                    <mi> len </mi>
                                    <mfenced>
                                        <mrow>
                                            <msub>
                                                <mrow>
                                                    <mi> D </mi>
                                                </mrow>
                                                <mrow>
                                                    <mi> i </mi>
                                                </mrow>
                                            </msub>
                                        </mrow>
                                    </mfenced>
                                </mrow>
                                <mrow>
                                    <mi> avg_length </mi>
                                </mrow>
                            </mfrac>
                        </mrow>
                </mrow>
            </mfenced>
            <mo> + </mo>
            <msub>
                <mrow>
                    <mi> f </mi>
                </mrow>
                <mrow>
                    <mi> i </mi>
                    <mo> , </mo>
                    <mi> j </mi>
                </mrow>
            </msub>
        </mrow>
    </mfrac>
    <mo>&#215</mo>
    <mi> log </mi>
    <mfrac>
        <mrow>
            <mi> N </mi>
            <mo> - </mo>
            <msub>
                <mrow>
                    <mi> n </mi>
                </mrow>
                <mrow>
                    <mi> j </mi>
                </mrow>
            </msub>
            <mo> + </mo>
            <mn> 0.5 </mn>
        </mrow>
        <mrow>
            <msub>
                <mrow>
                    <mi> n </mi>
                </mrow>
                <mrow>
                    <mi> j </mi>
                </mrow>
            </msub>
            <mo> + </mo>
            <mn> 0.5 </mn>
        </mrow>
    </mfrac>
  </math>
`
]

const { Option } = Select

const ProbabilityExperimentComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  // 保存顺序加载状态
  const [saveOrderLoading, setSaveOrderLoading] = useState(false)
  //仿真我的搜索引擎输入框中的值
  const [query, setQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [k, setK] = useState(1)
  const [b, setB] = useState(0.5)
  const [calculationLoading, setCalculationLoading] = useState(false)
  // 仿真我的搜索引擎，每一步的请求loading状态
  const [stepLoading, setStepLoading] = useState(false)
  // 仿真我的搜索引擎步骤索引
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [lastStepIndex, setLastStepIndex] = useState(0)
  const [selectedQuery, setSelectedQuery] = useState('')
  const [standardData, setStandardData] = useState<StandardResult[]>([])
  const [testData, setTestData] = useState<StandardResult[]>([])
  // 检索结果
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  // 求索引项结果
  const [searchPreProcessResult, setSearchPreProcessResult] = useState<VectorSpacePreProcessQuery>()
  // 求系数bij结果
  const [searchBIJResult, setSearchBIJResult] = useState<QueryBIJResult[]>([])
  // 求相似度及相似度降序排序的结果
  const [searchSimilarityResult, setSearchSimilarityResult] = useState<QuerySimilarityResult[]>([])
  const [nextLoading, setNextLoading] = useState(false)
  const [savedK, setSavedK] = useState(false)
  const [saveKLoading, setSaveKLoading] = useState(false)
  const [savedB, setSavedB] = useState(false)
  const [saveBLoading, setSaveBLoading] = useState(false)

  /**
   * 定义列的对齐方式，居中
   */
  const columnAlignCenter: columnAlignType = 'center'

  const standardColumns = [
    {
      title: '序号',
      dataIndex: 'docRank',
      key: 'docRank',
      width: 50,
      align: columnAlignCenter
    },
    {
      title: 'ID',
      dataIndex: 'docId',
      key: 'docId',
      width: 50,
      align: columnAlignCenter
    },
    {
      title: '文档名',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <div className="GlobalVectorSpaceTdEllipsis">{text}</div>
    },
    {
      title: '相关度',
      dataIndex: 'score',
      key: 'score',
      width: 60,
      align: columnAlignCenter
    }
  ]

  const testColumns = [
    {
      title: '序号',
      dataIndex: 'docRank',
      key: 'docRank',
      width: 50,
      align: columnAlignCenter
    },
    {
      title: 'ID',
      dataIndex: 'docId',
      key: 'docId',
      width: 50,
      align: columnAlignCenter
    },
    {
      title: '文档名',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div className={`GlobalVectorSpaceTdEllipsis ${text.length > 16 ? '' : 'GlobalVectorSapceTd'}`}>{text}</div>
      )
    },
    {
      title: '是否相关',
      dataIndex: 'isExisting',
      key: 'isExisting',
      width: 80,
      align: columnAlignCenter,
      render: (isExisting: boolean) => renderIsExisting(isExisting)
    }
  ]

  useEffect(() => {
    // @ts-ignore
    if (window.MathJax && window.MathJax.Hub) {
      // 如果，不传入第三个参数，则渲染整个document
      // @ts-ignore
      // eslint-disable-next-line no-undef
      window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('vectorSpaceMathJaxContent')])
    }
  }, [])

  useEffect(() => {
    /**
     * 保存操作步骤
     */
    const saveOperationStepK = async (operationName: string) => {
      setSaveKLoading(true)
      const res = await requestFn(dispatch, {
        url: '/score/createOperationRecord',
        method: 'post',
        data: {
          experimentId: 6,
          operationName
        }
      })
      if (res && res.status === 200 && res.data && res.data.code === 0) {
        successTips('更新成功', `操作-"${operationName}"保存成功`)
      } else {
        errorTips(
          `更新操作-${operationName}`,
          res && res.data && res.data.msg ? res.data.msg : `操作-"${operationName}"保存失败`
        )
      }
      // 不论成功与失败，只有一次保存的机会。除非单独增加一个保存操作的按钮
      setSavedK(true)
      setSaveKLoading(false)
    }

    if (!savedK && !saveKLoading) {
      saveOperationStepK('调整参数k')
    }
  }, [dispatch, savedK, k, saveKLoading])

  useEffect(() => {
    /**
     * 保存操作步骤
     */
    const saveOperationStepB = async (operationName: string) => {
      setSaveBLoading(true)
      const res = await requestFn(dispatch, {
        url: '/score/createOperationRecord',
        method: 'post',
        data: {
          experimentId: 6,
          operationName
        }
      })
      if (res && res.status === 200 && res.data && res.data.code === 0) {
        successTips('更新成功', `操作-"${operationName}"保存成功`)
      } else {
        errorTips(
          `更新操作-${operationName}`,
          res && res.data && res.data.msg ? res.data.msg : `操作-"${operationName}"保存失败`
        )
      }
      setSavedB(true)
      setSaveBLoading(false)
    }

    if (!savedB && !saveBLoading) {
      saveOperationStepB('调整参数b')
    }
  }, [dispatch, savedB, b, saveBLoading])

  /**
   * 渲染相关度icon图标
   */
  const renderIsExisting = (isExisting: boolean) => {
    if (isExisting) {
      return <Icon type="check" />
    } else {
      return <Icon type="close" />
    }
  }

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
   * 渲染用户排序卡片
   */
  const renderEmptyCards = () => {
    return (
      <div className={styles.BoxWrapper}>
        <div className={styles.BoxGroup}>
          <div className={`${styles.BoxItem} ${state.saveOrderBtn.probability.saved ? styles.BoxItemDisabled : ''}`}>
            {renderCard(state.probabilityExperimentSteps[0].name, 0)}
          </div>
        </div>
        <div className={styles.ArrowGroup}>
          <div className={styles.ArrowBox}>
            <img className={styles.Arrow} src={Arrow} alt="箭头" />
          </div>
        </div>
        <div className={styles.BoxGroup}>
          <div className={`${styles.BoxItem} ${state.saveOrderBtn.probability.saved ? styles.BoxItemDisabled : ''}`}>
            {renderCard(state.probabilityExperimentSteps[1].name, 1)}
          </div>
        </div>
        <div className={styles.ArrowGroup}>
          <div className={styles.ArrowBox}>
            <img className={styles.Arrow} src={Arrow} alt="箭头" />
          </div>
        </div>
        <div className={styles.BoxGroup}>
          <div className={`${styles.BoxItem} ${state.saveOrderBtn.probability.saved ? styles.BoxItemDisabled : ''}`}>
            {renderCard(state.probabilityExperimentSteps[2].name, 2)}
          </div>
        </div>
        <div className={styles.ArrowGroup}>
          <div className={styles.ArrowBox}>
            <img className={styles.Arrow} src={Arrow} alt="箭头" />
          </div>
        </div>
        <div className={styles.BoxGroup}>
          <div className={`${styles.BoxItem} ${state.saveOrderBtn.probability.saved ? styles.BoxItemDisabled : ''}`}>
            {renderCard(state.probabilityExperimentSteps[3].name, 3)}
          </div>
        </div>
      </div>
    )
  }

  /**
   * 渲染方框中的卡片
   */
  const renderCard = (name: string, index: number) => {
    if (name) {
      return (
        <div
          className={`${styles.Name}`}
          onClick={() => shouldRemoveCard(!state.saveOrderBtn.probability.saved, name, index)}>
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

  const shouldRemoveCard = (bool: boolean, name: string, index: number) => {
    if (!bool) {
      return false
    } else {
      removeCard(name, index)
    }
  }

  /**
   * 点击方框移除已放入的卡片
   */
  const removeCard = (name: string, index: number) => {
    dispatch({
      type: 'handle_probabilityExperiment_card',
      payload: {
        name,
        type: 'remove',
        index
      }
    })
  }

  /**
   * 点击方框放入卡片
   */
  const addCard = (index: number) => {
    const currentIndex = state.probabilityExperimentCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_probabilityExperiment_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  /**
   * 更新概率模型实验，保存顺序按钮的状态
   */
  const updateSaveOrderBtnStatus = () => {
    dispatch({
      type: 'update_saveOrderBtnStatus',
      payload: {
        field: 'probability'
      }
    })
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
   * 保存用户选择的构建顺序
   */
  const saveOrder = async () => {
    setSaveOrderLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateRankingScore',
      method: 'post',
      data: {
        experimentId: 6,
        rankingResult: getStepIndex(state.probabilityExperimentSteps, state.probabilityExperimentCards)
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

  /**
   * 渲染卡片列表
   */
  const renderCards = () => {
    return state.probabilityExperimentCards.map((i, index) => {
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

  /**
   * 选中卡片
   */
  const selectCard = (name: string, index: number, disabled: boolean) => {
    if (disabled) {
      return false
    }
    dispatch({
      type: 'handle_probabilityExperiment_card',
      payload: {
        name,
        type: 'selected',
        index
      }
    })
  }

  /**
   * 渲染卡片排序区域
   */
  const renderCardSection = () => {
    return (
      <>
        <div className={styles.ExamBox}>{renderEmptyCards()}</div>
        <div className={styles.BoxContainer}>{renderCards()}</div>
        <div className={styles.SaveOrder}>
          <Button
            type="primary"
            disabled={!state.saveOrderBtn.probability.completed || state.saveOrderBtn.probability.saved}
            loading={saveOrderLoading}
            onClick={saveOrder}>
            保存
          </Button>
        </div>
      </>
    )
  }

  /**
   * 渲染公式
   */
  const renderParamSection = () => {
    return (
      <div className={styles.FormulaWrapper}>
        <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[0] }}></span>
        <div className={styles.Param}>
          <div className={styles.InputNumber}>
            <span>调整系数k:</span>
            <InputNumber min={0} max={10} step={0.1} defaultValue={1.0} onChange={onParamKChange} />
          </div>
          <div className={styles.InputNumber}>
            <span>调整系数b:</span>
            <InputNumber min={0} max={1} step={0.1} defaultValue={0.5} onChange={onParamBChange} />
          </div>
        </div>
      </div>
    )
  }

  /**
   * 改变系数k
   */
  const onParamKChange = debounce((value: number | undefined) => {
    setK(value || 1)
  }, 500)

  /**
   * 改变系数k
   */
  const onParamBChange = debounce((value: number | undefined) => {
    setB(value || 0.5)
  }, 500)

  /**
   * 更新模型调试时的查询语句
   */
  const updateSelectValue = (value: string) => {
    setSelectedQuery(value)
  }

  /**
   * 模型调试区域
   */
  const renderSelectSection = () => {
    return (
      <div className={styles.SelectWrapper}>
        <span className={styles.SelectLabel}>请选择标准查询:</span>
        <Select className={`GlobalSelect ${styles.Select}`} size="large" onChange={updateSelectValue}>
          {renderSelectOptions()}
        </Select>
        <Button
          type="primary"
          size="large"
          loading={calculationLoading}
          disabled={selectedQuery === ''}
          onClick={testRetriever}>
          计算
        </Button>
      </div>
    )
  }

  /**
   * 渲染向量空间模型下拉列表备选项
   */
  const renderSelectOptions = () => {
    return vectorSpaceQueryOptions.map((i, index) => {
      return (
        <Option key={index} value={i.value}>
          {i.label}
        </Option>
      )
    })
  }

  /**
   * 渲染模型调试表格
   */
  const renderTables = () => {
    return (
      <div className={styles.TableGroup}>
        <Table
          rowKey="docId"
          loading={calculationLoading}
          dataSource={standardData}
          columns={standardColumns}
          size="small"
          pagination={false}
          bordered
          className={`GlobalVectorSpaceTable ${styles.Table} ${styles.TableLeft}`}
        />
        <Table
          rowKey="docId"
          loading={calculationLoading}
          dataSource={testData}
          columns={testColumns}
          size="small"
          pagination={false}
          bordered
          className={`GlobalVectorSpaceTable ${styles.Table}`}
        />
      </div>
    )
  }

  /**
   * 计算所选公式查询结果与标准查询结果的相似度
   */
  const testRetriever = async () => {
    setCalculationLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/probabilityModel/testRetriever',
      method: 'post',
      params: {
        query: selectedQuery,
        k,
        b
      }
    })
    if (res && res.status === 200 && res.data && res.data.standardResults && res.data.testResults) {
      setStandardData(handleTestRetrieverResult(res.data.standardResults))
      setTestData(handleTestRetrieverResult(res.data.testResults))
    } else {
      errorTips('计算相似度失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setCalculationLoading(false)
  }

  /**
   * 截取相似度计算结果前5条记录
   */
  const handleTestRetrieverResult = (data: StandardResult[]) => {
    return data.filter((_, index) => index < 5)
  }

  /**
   * 检索请求
   */
  const searchQuery = async () => {
    setSearchLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/probabilityModel/search',
      method: 'post',
      params: {
        query,
        k,
        b
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      const tips: Tips = {
        success: {
          title: '检索成功',
          description: '操作-"仿真概率检索模型"已保存'
        },
        error: {
          title: '检索失败',
          description: '操作-"仿真概率检索模型"保存失败'
        }
      }
      saveOperationStep('仿真概率检索模型', tips, res.data)
    } else {
      setSearchLoading(false)
      errorTips('检索失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 保存操作步骤
   */
  const saveOperationStep = async (operationName: string, tips: Tips, data: SearchResult[], index = 0) => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 6,
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

  /**
   * 保存操作步骤与之后需要做的操作
   */
  const handleAfterSaveOperationStep = (
    operationName: string,
    data: SearchResult[] | VectorSpacePreProcessQuery | QueryBIJResult[] | QuerySimilarityResult[],
    index = 0
  ) => {
    if (operationName === '仿真概率检索模型') {
      setSearchResult(data as SearchResult[])
      setCurrentStepIndex(0)
      setSearchLoading(false)
    } else {
      setCurrentStepIndex(index + 1)
      handleStepSearchResult(index, data as VectorSpacePreProcessQuery | QueryBIJResult[] | QuerySimilarityResult[])
      if (index === 3) {
        setLastStepIndex(index + 1)
      }
      setStepLoading(false)
    }
  }

  /**
   * 更新仿真我的搜索引擎的检索条件
   */
  const updateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  /**
   * 渲染仿真我的搜索引擎区域的表单
   */
  const renderSearchForm = () => {
    return (
      <div className={styles.SearchWrapper}>
        <span className={styles.SearchLabel}>请输入查询语句:</span>
        <Input autoComplete="off" size="large" value={query} onChange={updateQuery} />
        <Button type="primary" size="large" disabled={query === ''} loading={searchLoading} onClick={searchQuery}>
          检索
        </Button>
      </div>
    )
  }

  /**
   * 仿真我的搜索引擎
   */
  const getMonitorResult = async (param: { url: string; operationName: string }, index: number) => {
    setStepLoading(true)
    const res = await requestFn(dispatch, {
      url: param.url,
      method: 'post',
      params: {
        query,
        k,
        b
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

  /**
   * 处理每一步检索的结果
   */
  const handleStepSearchResult = (
    index: number,
    result: VectorSpacePreProcessQuery | QueryBIJResult[] | QuerySimilarityResult[]
  ) => {
    switch (index) {
      case 0:
        setSearchPreProcessResult(result as VectorSpacePreProcessQuery)
        break
      case 1:
        setSearchBIJResult(result as QueryBIJResult[])
        break
      case 2:
        setSearchSimilarityResult(result as QuerySimilarityResult[])
        break
      case 3:
        setSearchSimilarityResult(result as QuerySimilarityResult[])
        break
      default:
        setSearchPreProcessResult(result as VectorSpacePreProcessQuery)
        break
    }
  }

  /**
   * 处理当前步骤的按钮点击事件
   */
  const handleCurrentStep = (index: number) => {
    const requestParams = [
      {
        url: '/IRforCN/Retrieval/probabilityModel/ppq',
        operationName: '求索引项'
      },
      {
        url: '/IRforCN/Retrieval/probabilityModel/bij',
        operationName: '求系数Bij'
      },
      {
        url: '/IRforCN/Retrieval/probabilityModel/similarity',
        operationName: '计算相似度'
      },
      {
        url: '/IRforCN/Retrieval/probabilityModel/descendOrderSimilarity',
        operationName: '按相似度降序排序'
      }
    ]
    getMonitorResult(requestParams[index], index)
  }

  /**
   * 渲染仿真我的搜索引擎模块，每个步骤按钮的点击状态
   */
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

  /**
   * 渲染检索步骤
   */
  const renderSearchSteps = () => {
    if (state.saveOrderBtn.probability.saved) {
      return (
        <div>
          <div className={styles.ExamBox}>
            <div className={styles.BoxWrapper}>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 0 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求索引项', stepLoading, 0)}
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
                  {renderStepButton('求系数Bij', stepLoading, 1)}
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
                  {renderStepButton('求相似度', stepLoading, 2)}
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
                  {renderStepButton('求相似度降序排序', stepLoading, 3)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div className={styles.StepTips}>请先按顺序构建空间向量模型，并保存</div>
    }
  }

  /**
   * 渲染搜索结果
   */
  const renderSearchResult = (index: number) => {
    switch (index) {
      case 0:
        return renderCommonSearchResult()
      case 1:
        return renderPreProecssResult()
      case 2:
        return renderSearchBIJResult()
      case 3:
        return renderQuerySimilarityResult()
      case 4:
        return renderQuerySimilarityResult()
      default:
        return renderCommonSearchResult()
    }
  }

  /**
   * 渲染点击检索按钮后的结果
   */
  const renderCommonSearchResult = () => {
    return <div className={styles.CommonResult}>{renderSearchResultList()}</div>
  }

  /**
   * 渲染检索结果列表
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

  /**
   * 渲染查询预处理的结果
   */
  const renderPreProecssResult = () => {
    return (
      <div className={styles.PreProcessResult}>
        <p>
          <span className={styles.PreProcessLabel}>检索字符串</span>
          <span>{searchPreProcessResult && searchPreProcessResult.query}</span>
        </p>
        <p>
          <span className={styles.PreProcessLabel}>预处理结果</span>
          <span>{searchPreProcessResult && searchPreProcessResult.result.join(', ')}</span>
        </p>
      </div>
    )
  }

  /**
   * 渲染求系数bij的结果
   */
  const renderSearchBIJResult = () => {
    return searchBIJResult.map((i, index) => {
      return (
        <div key={index} className={styles.QueryTFRow}>
          <p>
            <span className={styles.QueryTFLabel}>词项</span>
            <span>{i.term}</span>
          </p>
          <p>
            <span className={styles.QueryTFLabel}>系数bij</span>
            <span>{i.bij}</span>
          </p>
          <p>
            <span className={styles.QueryTFLabel}>文档Id</span>
            <span>{i.docId}</span>
          </p>
        </div>
      )
    })
  }

  /**
   * 渲染文档相似度及相似度降序结果
   */
  const renderQuerySimilarityResult = () => {
    return searchSimilarityResult.map((i, index) => {
      return (
        <div key={index} className={styles.QueryTFRow}>
          <p>
            <span className={styles.QueryTFLabel}>文档名</span>
            <span>{i.title}</span>
          </p>
          <p>
            <span className={styles.QueryTFLabel}>相似度</span>
            <span>{i.similarity}</span>
          </p>
          <p>
            <span className={styles.QueryTFLabel}>文档Id</span>
            <span>{i.docId}</span>
          </p>
        </div>
      )
    })
  }

  /**
   * 页面底部，点击前往下一步
   */
  const goNextExperiment = async () => {
    setNextLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/probabilityModel/quit',
      method: 'post',
      params: {
        query,
        k,
        b
      }
    })
    setNextLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      props.history.replace('/experiment/language')
    } else {
      errorTips('保存实验操作失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>请按正确顺序构建概率检索模型：</div>
        {renderCardSection()}
        <div className={styles.SectionTitle}>请调整BM25模型参数：</div>
        {renderParamSection()}
        <div className={styles.SectionTitle}>请对模型进行调试:</div>
        {renderSelectSection()}
        {renderTables()}
        <div className={styles.SectionTitle}>仿真我的搜索引擎:</div>
        {renderSearchForm()}
        <Spin spinning={searchLoading}>{renderSearchSteps()}</Spin>
        <p className={styles.SearchResultTitle}>检索结果:</p>
        <Spin spinning={stepLoading}>
          <div className={styles.SearchResult}>{renderSearchResult(currentStepIndex)}</div>
        </Spin>
        <Button
          type="primary"
          loading={nextLoading}
          disabled={lastStepIndex !== 4}
          onClick={goNextExperiment}
          className={styles.NextBtn}>
          下一步
        </Button>
      </div>
    </div>
  )
}

/**
 * 概率模型实验
 */
const ProbabilityExperiment = withRouter(ProbabilityExperimentComponent)

export default ProbabilityExperiment
