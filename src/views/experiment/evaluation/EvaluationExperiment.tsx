import React, { useState, useEffect } from 'react'
import { Dispatch } from 'redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Button, Select, notification, Radio, Table, Icon, Spin, Input, Form } from 'antd'
import echarts from 'echarts'
import { FormComponentProps } from 'antd/lib/form'
import { RadioChangeEvent } from 'antd/lib/radio'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import styles from './EvaluationExperiment.module.less'
import { vectorSpaceQueryOptions, defaultChartColors } from '../../../config/Constant'
import { requestFn } from '../../../utils/request'
import { useDispatch } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import { StandardResult } from '../../../modal/VectorSpace'
import {
  IndividualPerformanceOrigin,
  RadarSelected,
  AveragePerformance,
  IndividualPerformance,
  PerformaceKeys,
  ValueKeys
} from '../../../modal/Performance'

/**
 * 列对齐方式类型(与ant-design保持一致)
 */
type columnAlignType = 'center' | 'left' | 'right' | undefined

const defaultModels = [
  {
    name: '布尔模型',
    value: 'boolModel'
  },
  {
    name: '向量空间模型',
    value: 'vsm'
  },
  {
    name: '概率模型',
    value: 'probabilityModel'
  },
  {
    name: '语言模型',
    value: 'languageModel'
  }
]

const { Option } = Select
const { TextArea } = Input

/**
 * 模型对比纵轴假数据
 */
const yAxisData = [
  'f1',
  'map',
  'ndcg20',
  'ndcg10',
  'ndcg5',
  'ndcg',
  'r20',
  'r10',
  'r5',
  'recall',
  'p20',
  'p10',
  'p5',
  'precision'
]

/**
 * 模型对比假数据
 */
const seriesData = [18.9, 22.2, 24.6, 32.45, 38.67, 41.35, 43.96, 49.92, 52, 58.56, 64.32, 75.54, 84.23, 93.76]

/**
 * roc曲线假数据
 */
const rocSeriesData = [
  [0.005, 0.1806],
  [0.01, 0.2464],
  [0.02, 0.3309],
  [0.03, 0.3898],
  [0.04, 0.436],
  [0.05, 0.4742],
  [0.06, 0.507],
  [0.06, 0.507],
  [0.08, 0.5612],
  [0.09, 0.5842],
  [0.1, 0.6051],
  [0.11, 0.6243],
  [0.12, 0.642],
  [0.13, 0.6584],
  [0.14, 0.6737],
  [0.15, 0.688],
  [0.2, 0.7479],
  [0.25, 0.794],
  [0.3, 0.8308],
  [0.4, 0.8858],
  [0.5, 0.9243],
  [0.6, 0.9521],
  [0.7, 0.9721],
  [0.8, 0.9862],
  [0.9, 0.9954],
  [0.95, 0.9983]
]

/**
 * 正确率-召回曲线假数据
 */
const prSeriesData = [[0, 1], [0.2, 0.95], [0.4, 0.93], [0.57, 0.9], [0.8, 0.8], [0.9, 0.6], [1, 0]]

/**
 * 综合性能雷达图提示框配置
 */
const radarIndicator = [
  { name: 'f1', max: 1 },
  { name: 'map', max: 1 },
  { name: 'ndcg', max: 1 },
  { name: 'ndcg5', max: 1 },
  { name: 'ndcg10', max: 1 },
  { name: 'ndcg20', max: 1 },
  { name: 'p5', max: 1 },
  { name: 'p10', max: 1 },
  { name: 'p20', max: 1 },
  { name: 'precision', max: 1 },
  { name: 'r5', max: 1 },
  { name: 'r10', max: 1 },
  { name: 'r20', max: 1 },
  { name: 'recall', max: 1 }
]

/**
 * 综合性能雷达图，每个维度数据项
 */
const radarLegend = ['布尔模型', '向量空间模型', '概率检索模型', '语言模型']

/**
 * 综合性能雷达图假数据
 */
const radarSeriesData: { name: PerformaceKeys; value: number[] }[] = [
  {
    value: [18.9, 22.2, 24.6, 32.45],
    name: 'boolModelPerformance'
  },
  {
    value: [28.9, 24.6, 34.6, 12.45],
    name: 'vsmPerformance'
  },
  {
    value: [38.9, 28.9, 44.6, 28.45],
    name: 'probabilityModelPerformance'
  },
  {
    value: [48.9, 18, 41.6, 17.45],
    name: 'languageModelPerformance'
  }
]

/**
 * 综合性能雷达图默认要展示的列
 */
const radarSelected: RadarSelected = {
  boolModelPerformance: true,
  vsmPerformance: false,
  probabilityModelPerformance: false,
  languageModelPerformance: false
}

interface EvaluationExperimentProps extends RouteComponentProps, FormComponentProps {}

const EvaluationExperimentForm = (props: EvaluationExperimentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [performanceLoading, setPerformanceLoading] = useState(false)
  // 性能对比图配置
  const [performanceOption, setPerformanceOption] = useState()
  // roc曲线图配置
  const [rocOption, setRocOption] = useState()
  // 正确率-召回率曲线图配置
  const [prOption, setPrOption] = useState()
  // 性能对比雷达图对比
  const [radarOption, setRadarOption] = useState()
  // 综合分析
  const [analysisText, setAnalysisText] = useState('')
  const [saveAnalysLoading, setSaveAnalysLoading] = useState(false)
  // 需要仿真的模型
  const [modelType, setModelType] = useState('boolModel')
  const [selectedQuery, setSelectedQuery] = useState('')
  const [modelName, setModelName] = useState('boolModel')
  const [standardData, setStandardData] = useState<StandardResult[]>([])
  const [testData, setTestData] = useState<StandardResult[]>([])
  const [calculationDisabled, setCalculationDisabled] = useState(true)
  const [selectModelLoading, setSelecteModelLoading] = useState(false)
  const { getFieldDecorator, getFieldsValue } = props.form

  /**
   * 定义列的对齐方式，居中
   */
  const columnAlignCenter: columnAlignType = 'center'

  /**
   * 参考排名列
   */
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

  /**
   * 我的检索排名列
   */
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
    /**
     * 计算所选公式查询结果与标准查询结果的相似度
     */
    const testRetriever = async () => {
      setCalculationLoading(true)
      const res = await requestFn(dispatch, {
        url: '/IRforCN/performance/testRetriever',
        method: 'post',
        params: {
          query: selectedQuery,
          modelName
        }
      })
      if (res && res.status === 200 && res.data && res.data.standardResults && res.data.testResults) {
        const operationObj = defaultModels.find(i => i.value === modelName)
        if (operationObj) {
          saveOperationStep(operationObj.name, res.data.standardResults, res.data.testResults)
        }
      } else {
        setCalculationLoading(false)
        errorTips('计算相似度失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      }
    }

    /**
     * 保存操作步骤
     */
    const saveOperationStep = async (
      operationName: string,
      standardResults: StandardResult[],
      testResults: StandardResult[]
    ) => {
      const res = await requestFn(dispatch, {
        url: '/score/createOperationRecord',
        method: 'post',
        data: {
          experimentId: 8,
          operationName
        }
      })
      setCalculationLoading(false)
      if (res && res.status === 200 && res.data) {
        setStandardData(handleTestRetrieverResult(standardResults))
        setTestData(handleTestRetrieverResult(testResults))
        successTips('计算相似度成功', `操作-"分析${operationName}"已保存`)
      } else {
        errorTips(
          '计算相似度失败',
          res && res.data && res.data.msg ? res.data.msg : `操作-"分析${operationName}"保存失败`
        )
      }
    }

    if (selectedQuery) {
      testRetriever()
    }
  }, [dispatch, selectedQuery, modelName])

  /**
   * 渲染相关度列
   */
  const renderIsExisting = (isExisting: boolean) => {
    if (isExisting) {
      return <Icon type="check" />
    } else {
      return <Icon type="close" />
    }
  }

  /**
   * 获取模型性能对比图配置
   */
  const getChartBarOption = (yAxisData: string[], seriesData: number[]) => {
    const option = {
      title: {
        text: '检索模型性能对比',
        show: false
      },
      color: defaultChartColors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b0}: {c0}%'
      },
      grid: { containLabel: true },
      xAxis: { name: '性能' },
      yAxis: {
        name: '参数',
        type: 'category',
        data: yAxisData
      },
      series: [
        {
          type: 'bar',
          data: seriesData
        }
      ]
    }
    return option
  }

  /**
   * 获取ROC曲线和正确率-召回率曲线图配置
   */
  const getCurveOption = (series: number[][], xAxisName: string, yAxisName: string) => {
    const option = {
      color: defaultChartColors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (param: any) => {
          const arr = [`${xAxisName}: ${param[0].value[1]}`, `${yAxisName}: ${param[0].value[0]}`]
          return arr.join('<br>')
        }
      },
      xAxis: {
        min: 0,
        max: 1,
        name: xAxisName,
        type: 'value'
      },
      yAxis: {
        min: 0,
        max: 1,
        name: yAxisName,
        type: 'value'
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: series
        }
      ]
    }
    return option
  }

  /**
   * 点击下一步
   *
   * 先选择仿真模型
   */
  const goNextStep = async () => {
    setSelecteModelLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/Simulation/selectModel',
      method: 'post',
      params: {
        modelName: modelType
      }
    })
    setSelecteModelLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === '1') {
      props.history.replace('/experiment/simulation')
    } else {
      errorTips('选择仿真模型失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /**
   * 点击检索模型性能对比按钮
   */
  const getPerformance = async () => {
    setPerformanceLoading(true)
    const res = await requestFn(dispatch, {
      url: '/IRforCN/performance/individualPerformance',
      method: 'post',
      params: {
        query: selectedQuery,
        modelName
      }
    })
    if (res && res.status === 200 && res.data) {
      const { yAxisData, seriesData } = handlePerformanceResult(res.data)
      const option = getChartBarOption(yAxisData, seriesData)
      setPerformanceOption(option)
      const tmpPrOption = getCurveOption(prSeriesData, '正确率', '召回率')
      const tmpRocOption = getCurveOption(rocSeriesData, '正样本比例', '负样本比例')
      setRocOption(tmpRocOption)
      setPrOption(tmpPrOption)
      getRadarPerformance()
    } else {
      errorTips('获取模型性能对比失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
      const option = getChartBarOption(yAxisData, seriesData)
      setPerformanceOption(option)
      const tmpPrOption = getCurveOption(prSeriesData, '正确率', '召回率')
      const tmpRocOption = getCurveOption(rocSeriesData, '正样本比例', '负样本比例')
      const tmpRadarOption = getRadarOption(radarIndicator, radarSeriesData, radarLegend, radarSelected)
      setRocOption(tmpRocOption)
      setPrOption(tmpPrOption)
      setRadarOption(tmpRadarOption)
      setPerformanceLoading(false)
    }
  }

  /**
   * 处理检索模型性能对比接口返回的数据
   *
   * 各项性能对比图
   */
  const handlePerformanceResult = (res: IndividualPerformanceOrigin) => {
    const { query, retrieverId, id, ...data } = res
    const yAxisData = Object.keys(data)
    const seriesData: number[] = Object.values(data)
    return { yAxisData, seriesData }
  }

  /**
   * 分析检索模型性能下拉列表备选项
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
   * 截取相似度计算结果前5条记录
   */
  const handleTestRetrieverResult = (data: StandardResult[]) => {
    return data.filter((_, index) => index < 5)
  }

  /**
   * 实时更新用户输入的综合分析文本
   */
  const udpateAnalysisText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnalysisText(event.target.value)
  }

  /**
   * 保存用户填写的综合分析
   */
  const saveText = async () => {
    setSaveAnalysLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateAnalyticalContent',
      method: 'post',
      data: {
        experimentId: 8,
        analyticalContent: analysisText
      }
    })
    if (res && res.status && res.data && res.data.code === 0) {
      successTips('保存成功')
    } else {
      errorTips('保存分析失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setSaveAnalysLoading(false)
  }

  /**
   * 更新模型调试时的查询语句
   */
  const updateSelectValue = (value: string) => {
    if (value) {
      setCalculationDisabled(false)
    }
  }

  /**
   * 更新计算相关度时的所选模型名称
   */
  const updateModelName = (e: RadioChangeEvent) => {
    setModelName(e.target.value)
  }

  /**
   * 计算相似度
   */
  const calculate = () => {
    const fieldValue = getFieldsValue(['selectedQuery'])
    setSelectedQuery(fieldValue.selectedQuery)
  }

  /**
   * 选中需要仿真的模型
   */
  const updateModelType = (type: string) => {
    setModelType(type)
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
   * 渲染模型新能对比图
   */
  const renderPerformanceChart = () => {
    if (!performanceLoading && performanceOption) {
      return (
        <div className={styles.PerformanceWrapper}>
          <ReactEchartsCore
            echarts={echarts}
            option={performanceOption}
            notMerge={true}
            lazyUpdate={true}
            className={styles.PerformanceChart}
            theme={'theme_name'}
          />
        </div>
      )
    } else {
      return <div className={styles.PerformanceWrapper}></div>
    }
  }

  /**
   * 渲染ROC曲线图
   */
  const renderROCChart = () => {
    if (!performanceLoading && rocOption) {
      return (
        <ReactEchartsCore
          echarts={echarts}
          option={rocOption}
          notMerge={true}
          lazyUpdate={true}
          className={styles.GroupChart}
          theme={'theme_name'}
        />
      )
    } else {
      return <div className={styles.GroupChart}></div>
    }
  }

  /**
   * 渲染正确率-召回率曲线图
   */
  const renderPRChart = () => {
    if (!performanceLoading && prOption) {
      return (
        <ReactEchartsCore
          echarts={echarts}
          option={prOption}
          notMerge={true}
          lazyUpdate={true}
          className={styles.GroupChart}
          theme={'theme_name'}
        />
      )
    } else {
      return <div className={styles.GroupChart}></div>
    }
  }
  // 雷达图 start
  /**
   * 获取综合性能雷达图
   */
  const getRadarOption = (
    indicator: { name: string; max: number }[],
    seriesData: { name: string; value: number[] }[],
    legend: string[],
    selected: RadarSelected
  ) => {
    const option = {
      tooltip: {},
      radar: {
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        center: ['60%', '50%'],
        indicator: indicator
      },
      color: defaultChartColors,
      legend: {
        type: 'scroll',
        orient: 'vertical',
        top: 'middle',
        left: 10,
        data: legend,
        selected
      },
      series: [
        {
          type: 'radar',
          name: '综合性能雷达图',
          data: seriesData
        }
      ]
    }
    return option
  }
  /**
   * 处理legend需要显示的标签
   *
   * 若四个维度的值都为0，则默认不显示
   */
  const handleRadarSelected = (series: { name: PerformaceKeys; value: number[] }[]) => {
    let selected: RadarSelected = {
      boolModelPerformance: true,
      vsmPerformance: false,
      probabilityModelPerformance: false,
      languageModelPerformance: false
    }
    for (let i of series) {
      const key = i.name as PerformaceKeys
      selected[key] = !i.value.every(j => j === 0)
    }
    return selected
  }
  /**
   * 处理综合性能雷达图数据
   */
  const handleAveragePerformanceResult = (res: AveragePerformance) => {
    const series = []
    const keys = Object.keys(res) as PerformaceKeys[]
    for (let i of keys) {
      const data = handleSinglePerformanceResult(res[i])
      const list = []
      const keys2 = Object.keys(data) as ValueKeys[]
      for (let j of keys2) {
        list.push(data[j])
      }
      series.push({
        name: i,
        value: list
      })
    }
    return series
  }
  /**
   * 取出综合性能数据中的单个模型数据
   */
  const handleSinglePerformanceResult = (res: IndividualPerformanceOrigin): IndividualPerformance => {
    const { query, retrieverId, id, ...data } = res
    return data
  }
  /**
   * 获取综合性能雷达图数据
   */
  const getRadarPerformance = async () => {
    const res = await requestFn(dispatch, {
      url: '/IRforCN/performance/averagePerformance',
      method: 'post'
    })
    if (res && res.status === 200 && res.data) {
      const series = handleAveragePerformanceResult(res.data)
      const selected = handleRadarSelected(series)
      const tmpRadarOption = getRadarOption(radarIndicator, series, radarLegend, selected)
      setRadarOption(tmpRadarOption)
    } else {
      errorTips('获取综合性能数据失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
    setPerformanceLoading(false)
  }
  /**
   * 渲染雷达图
   */
  const renderRadarChart = () => {
    if (!performanceLoading && radarOption) {
      return (
        <div className={styles.PerformanceWrapper}>
          <ReactEchartsCore
            echarts={echarts}
            option={radarOption}
            notMerge={true}
            lazyUpdate={true}
            className={styles.PerformanceChart}
            theme={'theme_name'}
          />
        </div>
      )
    } else {
      return <div className={styles.PerformanceWrapper}></div>
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
   * 渲染需要仿真的模型
   */
  const renderModals = () => {
    return defaultModels.map(i => {
      return (
        <div
          key={i.name}
          className={`${styles.Modal} ${modelType === i.value ? styles.Active : ''}`}
          onClick={() => updateModelType(i.value)}>
          {i.name}
        </div>
      )
    })
  }

  return (
    <div>
      <div className={styles.SearchWrapper}>
        <span className={styles.SearchLabel}>请选择标准查询</span>
        <Form.Item className={styles.Select}>
          {getFieldDecorator('selectedQuery', {
            initialValue: selectedQuery
          })(
            <Select style={{ width: '100%' }} size="large" onChange={updateSelectValue}>
              {renderSelectOptions()}
            </Select>
          )}
        </Form.Item>
        <Button
          type="primary"
          size="large"
          loading={calculationLoading}
          disabled={calculationDisabled}
          onClick={calculate}>
          计算
        </Button>
      </div>
      <div className={styles.ModalWrapper}>
        <Radio.Group
          defaultValue="boolModel"
          buttonStyle="solid"
          className={`GlobalEvaluationRadioGroup ${styles.RadioGroup}`}
          onChange={updateModelName}>
          <Radio.Button value="boolModel">布尔模型</Radio.Button>
          <Radio.Button value="vsm">向量空间模型</Radio.Button>
          <Radio.Button value="probabilityModel">概率模型</Radio.Button>
          <Radio.Button value="languageModel">语言模型</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.TableNames}>
        <p>参考排名</p>
        <p>我的检索器排序</p>
      </div>
      {renderTables()}
      <Button
        type="primary"
        disabled={selectedQuery === ''}
        className={styles.PerformanceBtn}
        onClick={getPerformance}
        loading={performanceLoading}>
        检索模型性能对比
      </Button>
      <Spin spinning={performanceLoading}>{renderPerformanceChart()}</Spin>
      <div className={styles.LineChartGroup}>
        <p>ROC曲线</p>
        <p>正确率-召回曲线</p>
      </div>
      <Spin spinning={performanceLoading}>
        <div className={styles.ChartGroupWrapper}>
          {renderROCChart()}
          {renderPRChart()}
        </div>
      </Spin>
      <p className={styles.ChartTitle}>综合性能雷达图</p>
      <Spin spinning={performanceLoading}>{renderRadarChart()}</Spin>
      <div className={styles.TextAreaTite}>请结合试验效果对以上四个模型进行综合分析:</div>
      <TextArea rows={14} className={styles.TextArea} value={analysisText} onChange={udpateAnalysisText} />
      <div className={styles.SaveBtn}>
        <Button type="primary" disabled={analysisText === ''} loading={saveAnalysLoading} onClick={saveText}>
          确认
        </Button>
      </div>
      <div className={styles.TextAreaTite}>请选择需要仿真的模型:</div>
      <div className={styles.ModalWrapper}>{renderModals()}</div>
      <div className={styles.NextStepBtn}>
        <Button type="primary" disabled={selectedQuery === ''} loading={selectModelLoading} onClick={goNextStep}>
          确认
        </Button>
      </div>
    </div>
  )
}

const EvaluationExperimentWithoutRouter = Form.create<EvaluationExperimentProps>({ name: 'EvaluationExperimentForm' })(
  EvaluationExperimentForm
)

/**
 * 分析检索模型性能组件
 */
const EvaluationExperiment = withRouter(EvaluationExperimentWithoutRouter)

export default EvaluationExperiment
