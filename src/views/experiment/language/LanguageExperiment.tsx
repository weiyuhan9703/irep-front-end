import React, { useCallback, useState } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Icon, InputNumber, Select, notification, Input, Spin, Table } from 'antd'
import styles from './LanguageExperiment.module.less'
import Arrow from '../../../assets/experiment/vectorSpace/arrow.png'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { requestFn } from '../../../utils/request'
import { vectorSpaceQueryOptions } from '../../../config/Constant'
import { StandardResult } from '../../../modal/VectorSpace'
import {
  SearchResult,
  QueryDocTFResult,
  VectorSpacePreProcessQuery,
  QuerySimilarityResult
} from '../../../modal/Search'
import { getStore } from '../../../utils/util'

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

const { Option } = Select

const LanguageExperimentComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  // 保存顺序加载状态
  const [saveOrderLoading, setSaveOrderLoading] = useState(false)
  // 仿真我的搜索引擎，输入框中的值
  const [query, setQuery] = useState('')
  const [selectedQuery, setSelectedQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [modelName, setModelName] = useState('一元语言模型')
  const [smoothParam, setSmoothParam] = useState(0.5)
  const [calculationLoading, setCalculationLoading] = useState(false)
  // 仿真我的搜索引擎，每一步的请求loading状态
  const [stepLoading, setStepLoading] = useState(false)
  // 仿真我的搜索引擎步骤索引
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [lastStepIndex, setLastStepIndex] = useState(0)
  const [standardData, setStandardData] = useState<StandardResult[]>([])
  const [testData, setTestData] = useState<StandardResult[]>([])
  // 检索结果
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  // 求索引项结果
  const [searchPreProcessResult, setSearchPreProcessResult] = useState<VectorSpacePreProcessQuery>()
  // 求系数bij结果
  const [searchLMResult, setSearchLMResult] = useState<QueryDocTFResult>()
  // 求相似度及相似度降序排序的结果
  const [searchSimilarityResult, setSearchSimilarityResult] = useState<QuerySimilarityResult[]>([])
  const [nextLoading, setNextLoading] = useState(false)

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

  /**
   * 渲染相关度图标
   */
  const renderIsExisting = (isExisting: boolean) => {
    if (isExisting) {
      return <Icon type="check" />
    } else {
      return <Icon type="close" />
    }
  }

  /**
   * 选中卡片
   */
  const selectCard = (name: string, index: number, disabled: boolean) => {
    if (disabled) {
      return false
    }
    dispatch({
      type: 'handle_languageExperiment_card',
      payload: {
        name: name,
        type: 'selected',
        index
      }
    })
  }

  /**
   * 点击方框放入卡片
   */
  const addCard = (index: number) => {
    const currentIndex = state.languageExperimentCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_languageExperiment_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  /**
   * 更新语言实验，保存顺序按钮的状态
   */
  const updateSaveOrderBtnStatus = () => {
    dispatch({
      type: 'update_saveOrderBtnStatus',
      payload: {
        field: 'language'
      }
    })
  }

  /**
   * 判断是否能够移除卡片
   */
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
      type: 'handle_languageExperiment_card',
      payload: {
        name,
        type: 'remove',
        index
      }
    })
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
      url: '/score/updateRankingScore', // 接口还没完成，这里是个假的示例
      method: 'post',
      data: {
        experimentId: 7,
        rankingResult: getStepIndex(state.languageExperimentSteps, state.languageExperimentCards)
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('保存顺序成功', '')
      updateSaveOrderBtnStatus()
    } else {
      // 保存顺序失败
      errorTips('保存顺序失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setSaveOrderLoading(false)
  }

  /**
   * 渲染卡片列表
   */
  const renderCards = () => {
    return state.languageExperimentCards.map((i, index) => {
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
   * 渲染方框中的卡片
   */
  const renderCard = (name: string, index: number) => {
    if (name) {
      return (
        <div
          className={`${styles.Name}`}
          onClick={() => shouldRemoveCard(!state.saveOrderBtn.language.saved, name, index)}>
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

  /**
   * 渲染卡片排序区域
   */
  const renderCardSection = () => {
    return (
      <>
        <div className={styles.ExamBox}>
          <div className={styles.BoxWrapper}>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.language.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.languageExperimentSteps[0].name, 0)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.language.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.languageExperimentSteps[1].name, 1)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.language.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.languageExperimentSteps[2].name, 2)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div className={`${styles.BoxItem} ${state.saveOrderBtn.language.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.languageExperimentSteps[3].name, 3)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.BoxContainer}>{renderCards()}</div>
        <div className={styles.SaveOrder}>
          <Button
            type="primary"
            disabled={!state.saveOrderBtn.language.completed || state.saveOrderBtn.language.saved}
            loading={saveOrderLoading}
            onClick={saveOrder}>
            保存
          </Button>
        </div>
      </>
    )
  }

  /**
   * 渲染模型选择区域
   */
  const renderModelSection = () => {
    return (
      <div>
        <div className={styles.SelectWrapper}>
          <span className={styles.SelectLabel}>请选择语言模型类型：</span>
          <Select defaultValue={modelName} style={{ width: 150 }} onChange={handleModelChoose}>
            <Option value="一元语言模型">一元语言模型</Option>
            <Option value="二元语言模型y">二元语言模型</Option>
          </Select>
          <div className={styles.InputNumber}>
            <span>调整平滑系数a:</span>
            <InputNumber min={0} max={1} step={0.1} defaultValue={0.5} onChange={onInputNumberChange} />
          </div>
        </div>
      </div>
    )
  }

  /**
   * 模型选择
   */
  const handleModelChoose = (value: string) => {
    setModelName(value)
  }

  /**
   * 改变平滑系数
   */
  const onInputNumberChange = (value: number | undefined) => {
    setSmoothParam(value || 0.5)
  }

  /**
   * 更新仿真我的搜索引擎的检索条件
   */
  const updateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  /**
   * 更新模型调试时的查询语句
   */
  const updateSelectValue = (value: string) => {
    setSelectedQuery(value)
  }

  /**
   * 渲染语言模型下拉列表备选项
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
      url: '/IRforCN/Retrieval/languageModel/testRetriever',
      method: 'post',
      params: {
        query: selectedQuery,
        smoothParam
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
      url: '/IRforCN/Retrieval/languageModel/search',
      method: 'post',
      params: {
        query,
        smoothParam
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      const tips: Tips = {
        success: {
          title: '检索成功',
          description: '操作-"仿真语言模型"已保存'
        },
        error: {
          title: '检索失败',
          description: '操作-"仿真语言模型"保存失败'
        }
      }
      saveOperationStep('仿真语言模型', tips, res.data)
    } else {
      setSearchLoading(false)
      errorTips('检索失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 保存操作步骤
   */
  const saveOperationStep = async (
    operationName: string,
    tips: Tips,
    data: SearchResult[] | SearchResult[] | VectorSpacePreProcessQuery | QueryDocTFResult | QuerySimilarityResult[],
    index = 0
  ) => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 7,
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
    data: SearchResult[] | VectorSpacePreProcessQuery | QueryDocTFResult | QuerySimilarityResult[],
    index = 0
  ) => {
    if (operationName === '仿真语言模型') {
      setSearchResult(data as SearchResult[])
      setCurrentStepIndex(0)
      setSearchLoading(false)
    } else {
      setCurrentStepIndex(index + 1)
      handleStepSearchResult(index, data as VectorSpacePreProcessQuery | QueryDocTFResult | QuerySimilarityResult[])
      if (index === 3) {
        setLastStepIndex(index + 1)
      }
      setStepLoading(false)
    }
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
        ...(param.url.includes('tfsOfDoc') ? { docId: parseInt(getStore('docId')) } : {}),
        query,
        smoothParam
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
    result: VectorSpacePreProcessQuery | QueryDocTFResult | QuerySimilarityResult[]
  ) => {
    switch (index) {
      case 0:
        setSearchPreProcessResult(result as VectorSpacePreProcessQuery)
        break
      case 1:
        setSearchLMResult(result as QueryDocTFResult)
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
   * 处理当前步骤的按钮点击事件
   */
  const handleCurrentStep = (index: number) => {
    const requestParams = [
      {
        url: '/IRforCN/Retrieval/languageModel/ppq',
        operationName: '查询预处理'
      },
      {
        url: '/IRforCN/Retrieval/languageModel/tfsOfDoc',
        operationName: '计算各文档LM'
      },
      {
        url: '/IRforCN/Retrieval/languageModel/similarity',
        operationName: '计算各文档生成查询概率'
      },
      {
        url: '/IRforCN/Retrieval/languageModel/descendOrderSimilarity',
        operationName: '按生成概率排序'
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
    if (state.saveOrderBtn.language.saved) {
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
                  {renderStepButton('计算LM', stepLoading, 1)}
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
                  {renderStepButton('计算生成概率', stepLoading, 2)}
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
                  {renderStepButton('按生成概率降序排序', stepLoading, 3)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div className={styles.StepTips}>请先按顺序构建语言模型，并保存</div>
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
        return renderLMResult()
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
   * 渲染计算LM结果
   */
  const renderLMResult = () => {
    return (
      <>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档名</span>
          <span>{searchLMResult && searchLMResult.title}</span>
        </div>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档Id</span>
          <span>{searchLMResult && searchLMResult.docId}</span>
        </div>
        {searchLMResult &&
          searchLMResult.tfs.map((i, index) => {
            return (
              <div key={index} className={styles.QueryTFRow}>
                <p>
                  <span className={styles.QueryTFLabel}>词项</span>
                  <span>{i.term}</span>
                </p>
                <p>
                  <span className={styles.QueryTFLabel}>词频</span>
                  <span>{i.tf}</span>
                </p>
                <p>
                  <span className={styles.QueryTFLabel}>文档Id</span>
                  <span>{i.docId}</span>
                </p>
              </div>
            )
          })}
      </>
    )
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
      url: '/IRforCN/Retrieval/languageModel/quit',
      method: 'post',
      params: {
        query,
        smoothParam
      }
    })
    setNextLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      props.history.replace('/experiment/evaluation')
    } else {
      errorTips('保存实验操作失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>请按正确顺序构建语言模型:</div>
        {renderCardSection()}
        <div className={styles.SectionTitle}>请选择语言模型参数:</div>
        {renderModelSection()}
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

const LanguageExperiment = withRouter(LanguageExperimentComponent)

export default LanguageExperiment
