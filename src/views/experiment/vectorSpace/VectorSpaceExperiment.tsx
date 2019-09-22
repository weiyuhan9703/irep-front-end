import React, { useCallback, useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Icon, Radio, InputNumber, Select, notification, Input, Spin, Table } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio/interface'
import styles from './VectorSpaceExperiment.module.less'
import Arrow from '../../../assets/experiment/vectorSpace/arrow.png'
import { useDispatch, useMappedState, State, ExperimentCard } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { requestFn } from '../../../utils/request'
import { vectorSpaceQueryOptions } from '../../../config/Constant'
import { StandardResult } from '../../../modal/VectorSpace'
import { getStore } from '../../../utils/util'
import {
  SearchResult,
  IdfResult,
  VectorSpacePreProcessQuery,
  QueryTFResult,
  QueryVectorResult,
  QueryDocTFResult,
  QueryDocVectorResult,
  QuerySimilarityResult
} from '../../../modal/Search'

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
 * 向量空间模型--公式代码
 */
const formulas = [
  `<math>
    <msub>
      <mi>tf</mi>
      <mi>t,d</mi>
    </msub>
  </math>`,
  `<math>
    <mrow>
      <mn>1</mn>
      <mo>+</mo>
      <mi>log(</mi>
      <msub>
          <mi>tf</mi>
          <mi>t,d</mi>
      </msub>
      <mo>)</mo>
    </mrow>
  </math>`,
  `<math>
    <mi>a</mi>
    <mo>+</mo>
    <mrow>
      <mfrac>
        <mrow>
          <mi>a</mi>
          <mo>&#215</mo>
          <msub>
            <mrow>
              <mi> t </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                  <mo> , </mo>
                  <mi> d </mi>
                </mrow>
              </msub>
            </mrow>
          </msub>
        </mrow>
        <mrow>
          <msub>
            <mi>max</mi>
            <mi>t</mi>
          </msub>
          <mfenced>
            <mrow>
              <mi> t </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                  <mo> , </mo>
                  <mi> d </mi>
                </mrow>
              </msub>
            </mrow>
          </mfenced>
        </mrow>
      </mfrac>
    </mrow>
</math>`,
  `<math>
    <mrow>
      <msub>
        <mi>tf</mi>
        <mi>t,d</mi>
      </msub>
      <mo>&#62</mo>
      <mn>0</mn>
      <mo>?</mo>
      <mn>1</mn>
      <mo>:</mo>
      <mn>0</mn>
    </mrow>
  </math>`,
  `<math>
    <mrow>
      <mfrac>
        <mrow>
          <mn> 1 </mn>
          <mo> + </mo>
          <mi> log </mi>
          <mfenced>
            <mrow>
              <mi> t </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                  <mo> , </mo>
                  <mi> d </mi>
                </mrow>
              </msub>
            </mrow>
          </mfenced>
        </mrow>
        <mrow>
          <mn>1</mn>
          <mo>+</mo>
          <mi>log</mi>
          <mfenced>
            <mrow>
              <msub>
                <mi>ave</mi>
                <mi>t &#8712d</mi>
              </msub>
            </mrow>
            <mfenced>
              <mrow>
                <mi> t </mi>
                <msub>
                  <mrow>
                    <mi> f </mi>
                  </mrow>
                  <mrow>
                    <mi> t </mi>
                    <mo> , </mo>
                    <mi> d </mi>
                  </mrow>
                </msub>
              </mrow>
            </mfenced>
          </mfenced>
        </mrow>
      </mfrac>
    </mrow>
  </math>`
]

const { Option } = Select

const VectorSpaceExperimentComponent = (props: RouteComponentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))
  // 保存顺序加载状态
  const [saveOrderLoading, setSaveOrderLoading] = useState(false)
  // 仿真我的搜索引擎，输入框中的值
  const [query, setQuery] = useState('')
  const [selectedQuery, setSelectedQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [formulaId, setFormulaId] = useState(1)
  const [smoothParam, setSmoothParam] = useState(0.5)
  // 仿真我的搜索引擎，每一步的请求loading状态
  const [stepLoading, setStepLoading] = useState(false)
  // 仿真我的搜索引擎步骤索引
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [lastStepIndex, setLastStepIndex] = useState(0)
  const [standardData, setStandardData] = useState<StandardResult[]>([])
  const [testData, setTestData] = useState<StandardResult[]>([])
  // 检索结果
  const [searchResult, setSearchResult] = useState<SearchResult[]>([])
  // 求文档IDF结果
  const [searchIDFResult, setSearchIDFResult] = useState<IdfResult[]>([])
  // 查询预处理结果
  const [searchPreProcessResult, setSearchPreProcessResult] = useState<VectorSpacePreProcessQuery>()
  // 查询TF结果
  const [searchQueryTFResult, setSearchQueryTFResult] = useState<QueryTFResult[]>([])
  // 查询向量结果
  const [searchQueryVectorResult, setSearchQueryVectorResult] = useState<QueryVectorResult[]>([])
  // 求各文档TF结果
  const [searchQueryDocTFResult, setSearchQueryDocTFResult] = useState<QueryDocTFResult>()
  // 求文档向量结果
  const [searchQueryDocVectorResult, setSearchQueryDocVectorResult] = useState<QueryDocVectorResult>()
  // 求相似度及相似度降序排序的结果
  const [searchQuerySimilarityResult, setSearchQuerySimilarityResult] = useState<QuerySimilarityResult[]>([])
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

  const renderIsExisting = (isExisting: boolean) => {
    if (isExisting) {
      return <Icon type="check" />
    } else {
      return <Icon type="close" />
    }
  }

  useEffect(() => {
    // @ts-ignore
    if (window.MathJax && window.MathJax.Hub) {
      // 如果，不传入第三个参数，则渲染整个document
      // @ts-ignore
      // eslint-disable-next-line no-undef
      window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('vectorSpaceMathJaxContent')])
    }
  }, [])

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
      type: 'handle_vectorSpace_card',
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
    const currentIndex = state.vectorSpaceCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_vectorSpace_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  /**
   * 更新向量空间实验，保存顺序按钮的状态
   */
  const updateSaveOrderBtnStatus = () => {
    dispatch({
      type: 'update_saveOrderBtnStatus',
      payload: {
        field: 'vectorSpace'
      }
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
      type: 'handle_vectorSpace_card',
      payload: {
        name,
        type: 'selected',
        index
      }
    })
  }

  /**
   * 页面底部，点击前往下一步
   */
  const goNextExperiment = async () => {
    setNextLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/vectorSpaceModel/quit',
      method: 'post',
      params: {
        query: selectedQuery,
        formulaId,
        smoothParam
      }
    })
    setNextLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      props.history.replace('/experiment/probability')
    } else {
      errorTips('保存实验操作失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 改变平滑系数
   */
  const onInputNumberChange = (value: number | undefined) => {
    setSmoothParam(value || 0.5)
  }

  /**
   * 选择TF模型对应的公式id
   */
  const selectFormulaId = (e: RadioChangeEvent) => {
    setFormulaId(e.target.value)
  }

  /**
   * 计算所选公式查询结果与标准查询结果的相似度
   */
  const testRetriever = async () => {
    setCalculationLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Retrieval/vectorSpaceModel/testRetriever',
      method: 'post',
      params: {
        query: selectedQuery,
        formulaId,
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
      url: '/IRforCN/Retrieval/vectorSpaceModel/search',
      method: 'post',
      params: {
        query,
        formulaId,
        smoothParam
      }
    })
    if (res && res.status === 200 && res.data && !res.data.msg) {
      const tips: Tips = {
        success: {
          title: '检索成功',
          description: '操作-"仿真空间向量模型"已保存'
        },
        error: {
          title: '检索失败',
          description: '操作-"仿真空间向量模型"保存失败'
        }
      }
      saveOperationStep('仿真空间向量模型', tips, res.data)
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
    data:
      | SearchResult[]
      | IdfResult[]
      | VectorSpacePreProcessQuery
      | QueryTFResult[]
      | QueryVectorResult[]
      | QueryDocTFResult
      | QueryDocVectorResult
      | QuerySimilarityResult[],
    index = 0
  ) => {
    const res = await requestFn(dispatch, {
      url: '/score/createOperationRecord',
      method: 'post',
      data: {
        experimentId: 5,
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
    data:
      | SearchResult[]
      | IdfResult[]
      | VectorSpacePreProcessQuery
      | QueryTFResult[]
      | QueryVectorResult[]
      | QueryDocTFResult
      | QueryDocVectorResult
      | QuerySimilarityResult[],
    index = 0
  ) => {
    if (operationName === '仿真空间向量模型') {
      setSearchResult(data as SearchResult[])
      setCurrentStepIndex(0)
      setSearchLoading(false)
    } else {
      setCurrentStepIndex(index + 1)
      handleStepSearchResult(index, data as
        | IdfResult[]
        | VectorSpacePreProcessQuery
        | QueryTFResult[]
        | QueryVectorResult[]
        | QueryDocTFResult
        | QueryDocVectorResult
        | QuerySimilarityResult[])
      if (index === 7) {
        setLastStepIndex(index + 1)
      }
      setStepLoading(false)
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
        experimentId: 5,
        rankingResult: getStepIndex(state.vectorSteps, state.vectorSpaceCards)
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
   * 仿真我的搜索引擎
   */
  const getMonitorResult = async (param: { url: string; operationName: string }, index: number) => {
    setStepLoading(true)
    const res = await requestFn(dispatch, {
      url: param.url,
      method: 'post',
      params: {
        ...(param.url.includes('tfsOfDoc') || param.url.includes('vectorOfDoc')
          ? { docId: parseInt(getStore('docId')) }
          : {}),
        query,
        formulaId,
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
    result:
      | IdfResult[]
      | VectorSpacePreProcessQuery
      | QueryTFResult[]
      | QueryVectorResult[]
      | QueryDocTFResult
      | QueryDocVectorResult
      | QuerySimilarityResult[]
  ) => {
    switch (index) {
      case 0:
        setSearchIDFResult(result as IdfResult[])
        break
      case 1:
        setSearchPreProcessResult(result as VectorSpacePreProcessQuery)
        break
      case 2:
        setSearchQueryTFResult(result as QueryTFResult[])
        break
      case 3:
        setSearchQueryVectorResult(result as QueryVectorResult[])
        break
      case 4:
        setSearchQueryDocTFResult(result as QueryDocTFResult)
        break
      case 5:
        setSearchQueryDocVectorResult(result as QueryDocVectorResult)
        break
      case 6:
        setSearchQuerySimilarityResult(result as QuerySimilarityResult[])
        break
      case 7:
        setSearchQuerySimilarityResult(result as QuerySimilarityResult[])
        break
      default:
        setSearchIDFResult(result as IdfResult[])
        break
    }
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
   * 渲染卡片列表
   */
  const renderCards = () => {
    return state.vectorSpaceCards.map((i, index) => {
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
          onClick={() => shouldRemoveCard(!state.saveOrderBtn.vectorSpace.saved, name, index)}>
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
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[3].name, 3)}
              </div>
              <img className={`${styles.Arrow} ${styles.Down}`} src={Arrow} alt="箭头" />
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[4].name, 4)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[2].name, 2)}
              </div>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[5].name, 5)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[1].name, 1)}
              </div>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[6].name, 6)}
              </div>
            </div>
            <div className={styles.ArrowGroup}>
              <div className={styles.ArrowBox}>
                <img className={styles.Arrow} src={Arrow} alt="箭头" />
              </div>
              <div className={styles.ArrowBox}>
                <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
              </div>
            </div>
            <div className={styles.BoxGroup}>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[0].name, 0)}
              </div>
              <div
                className={`${styles.BoxItem} ${state.saveOrderBtn.vectorSpace.saved ? styles.BoxItemDisabled : ''}`}>
                {renderCard(state.vectorSteps[7].name, 7)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.BoxContainer}>{renderCards()}</div>
        <div className={styles.SaveOrder}>
          <Button
            type="primary"
            disabled={!state.saveOrderBtn.vectorSpace.completed || state.saveOrderBtn.vectorSpace.saved}
            loading={saveOrderLoading}
            onClick={saveOrder}>
            保存
          </Button>
        </div>
      </>
    )
  }

  /**
   * 渲染TF模型选择区域
   */
  const renderFormulaSection = () => {
    return (
      <div className={styles.FormulaWrapper} id="vectorSpaceMathJaxContent">
        <Radio.Group name="formula" defaultValue={1} onChange={selectFormulaId}>
          <Radio value={1} className={styles.Radio}>
            <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[0] }}></span>
          </Radio>
          <Radio value={2} className={styles.Radio}>
            <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[1] }}></span>
          </Radio>
          <Radio value={3} className={styles.Radio}>
            <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[2] }}></span>
          </Radio>
          <Radio value={4} className={`${styles.Radio} ${styles.BottomRadio}`}>
            <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[3] }}></span>
          </Radio>
          <Radio value={5} className={`${styles.Radio} ${styles.BottomRadio}`}>
            <span className={styles.Formula} dangerouslySetInnerHTML={{ __html: formulas[4] }}></span>
          </Radio>
        </Radio.Group>
        <div className={styles.InputNumber}>
          <span>调整平滑系数a:</span>
          <InputNumber min={0} max={1} step={0.1} defaultValue={0.5} onChange={onInputNumberChange} />
        </div>
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
        url: '/IRforCN/Retrieval/vectorSpaceModel/idf',
        operationName: '求文档IDF'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/ppq',
        operationName: '查询预处理'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/tfOfQuery',
        operationName: '求查询的TF'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/vectorOfQuery',
        operationName: '求查询向量'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/tfsOfDoc',
        operationName: '求各文档TF'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/vectorOfDoc',
        operationName: '求文档向量'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/similarity',
        operationName: '求相似度'
      },
      {
        url: '/IRforCN/Retrieval/vectorSpaceModel/descendOrderSimilarity',
        operationName: '求相似度'
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
    if (state.saveOrderBtn.vectorSpace.saved) {
      return (
        <div>
          <div className={styles.ExamBox}>
            <div className={styles.BoxWrapper}>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 3 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求查询向量', stepLoading, 3)}
                </div>
                <img className={`${styles.Arrow} ${styles.Down}`} src={Arrow} alt="箭头" />
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 4 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求各文档TF', stepLoading, 4)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={styles.Arrow} src={Arrow} alt="箭头" />
                </div>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 2 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求查询的TF', stepLoading, 2)}
                </div>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 5 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求文档向量', stepLoading, 5)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={styles.Arrow} src={Arrow} alt="箭头" />
                </div>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 1 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('查询预处理', stepLoading, 1)}
                </div>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 6 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求相似度', stepLoading, 6)}
                </div>
              </div>
              <div className={styles.ArrowGroup}>
                <div className={styles.ArrowBox}>
                  <img className={styles.Arrow} src={Arrow} alt="箭头" />
                </div>
                <div className={styles.ArrowBox}>
                  <img className={`${styles.Arrow} ${styles.Right}`} src={Arrow} alt="箭头" />
                </div>
              </div>
              <div className={styles.BoxGroup}>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 0 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求文档IDF', stepLoading, 0)}
                </div>
                <div
                  className={`${styles.BoxItem} ${styles.StepItem} ${currentStepIndex < 7 ? styles.DisabledBox : ''}`}>
                  {renderStepButton('求相似度降序排序', stepLoading, 7)}
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
   * 渲染搜索结果
   */
  const renderSearchResult = (index: number) => {
    switch (index) {
      case 0:
        return renderCommonSearchResult()
      case 1:
        return renderIDFSearchResult()
      case 2:
        return renderPreProecssResult()
      case 3:
        return renderSearchQueryTFResult()
      case 4:
        return renderQueryVectorResult()
      case 5:
        return renderQueryDocTFResult()
      case 6:
        return renderQueryDocVecotrResult()
      case 7:
        return renderQuerySimilarityResult()
      case 8:
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
   * 渲染文档IDF结果
   */
  const renderIDFSearchResult = () => {
    return searchIDFResult.map((i, index) => {
      return (
        <div key={index} className={styles.IDFRow}>
          <p>
            <span className={styles.IDFRowLabel}>词项</span>
            <span>{i.term}</span>
          </p>
          <p>
            <span className={styles.IDFRowLabel}>反文档频率</span>
            <span>{i.idf}</span>
          </p>
          <p>
            <span className={styles.IDFRowLabel}>出现次数</span>
            <span>{i.num}</span>
          </p>
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
   * 渲染查询TF的结果
   */
  const renderSearchQueryTFResult = () => {
    return searchQueryTFResult.map((i, index) => {
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
    })
  }

  /**
   * 渲染查询向量结果
   */
  const renderQueryVectorResult = () => {
    return searchQueryVectorResult.map((i, index) => {
      return (
        <div key={index} className={styles.VectorResultRow}>
          <p>
            <span className={styles.VectorLabel}>词项</span>
            <span>{i.term}</span>
          </p>
          <p>
            <span className={styles.VectorLabel}>出现次数</span>
            <span>{i.num}</span>
          </p>
          <p>
            <span className={styles.VectorLabel}>向量值</span>
            <span>{i.value}</span>
          </p>
        </div>
      )
    })
  }

  /**
   * 渲染求各文档TF结果
   */
  const renderQueryDocTFResult = () => {
    return (
      <>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档名</span>
          <span>{searchQueryDocTFResult && searchQueryDocTFResult.title}</span>
        </div>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档Id</span>
          <span>{searchQueryDocTFResult && searchQueryDocTFResult.docId}</span>
        </div>
        {searchQueryDocTFResult &&
          searchQueryDocTFResult.tfs.map((i, index) => {
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
   * 渲染文档向量结果
   */
  const renderQueryDocVecotrResult = () => {
    return (
      <>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档名</span>
          <span>{searchQueryDocVectorResult && searchQueryDocVectorResult.title}</span>
        </div>
        <div className={styles.DocTFTitle}>
          <span className={styles.DocTFTitleLabel}>文档Id</span>
          <span>{searchQueryDocVectorResult && searchQueryDocVectorResult.docId}</span>
        </div>
        {searchQueryDocVectorResult &&
          searchQueryDocVectorResult.vector.map((i, index) => {
            return (
              <div key={index} className={styles.QueryTFRow}>
                <p>
                  <span className={styles.QueryTFLabel}>词项</span>
                  <span>{i.term}</span>
                </p>
                <p>
                  <span className={styles.QueryTFLabel}>出现次数</span>
                  <span>{i.num}</span>
                </p>
                <p>
                  <span className={styles.QueryTFLabel}>向量值</span>
                  <span>{i.value}</span>
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
    return searchQuerySimilarityResult.map((i, index) => {
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

  return (
    <div>
      <div className={styles.Section}>
        <div className={styles.SectionTitle}>请按正确顺序构建向量空间模型:</div>
        {renderCardSection()}
        <div className={styles.SectionTitle}>请选择我的TF模型:</div>
        {renderFormulaSection()}
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
        disabled={lastStepIndex !== 8}
        onClick={goNextExperiment}
        className={styles.NextBtn}>
        下一步
      </Button>
    </div>
  )
}

const VectorSpaceExperiment = withRouter(VectorSpaceExperimentComponent)

export default VectorSpaceExperiment
