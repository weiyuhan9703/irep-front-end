import React, { useEffect, useState } from 'react'
import { Dispatch } from 'redux'
import { Spin } from 'antd'
import echarts from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import styles from './VisitorChart.module.less'
import { defaultChartColors } from '../../config/Constant'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'

const defaultSeries = [820, 932, 901, 934, 1290, 1330, 1320]

/**
 * 实验简介左上角近一周实验人数图表组件
 */
const VisitorChart = () => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const [chartOption, setChartOption] = useState()
  const [loading, setLoading] = useState(false)

  const getChartOption = (series: number[]) => {
    const option = {
      title: {
        text: '近一周实验人数',
        show: true
      },
      color: defaultChartColors,
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}: <br>{c0}人'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: series,
          type: 'line'
        }
      ]
    }
    return option
  }

  useEffect(() => {
    /**
     * 获取最近一周实验人数
     *
     * 暂无接口
     */
    const getExperimentUserCounts = async () => {
      setLoading(true)
      const res = await requestFn(dispatch, {
        url: '',
        method: 'post'
      })
      if (res && res.status === 200 && res.data && res.data.users) {
        const option = getChartOption(res.data.users)
        setChartOption(option)
      } else {
        const option = getChartOption(defaultSeries)
        setChartOption(option)
      }
      setLoading(false)
    }

    getExperimentUserCounts()
  }, [dispatch])

  const renderChart = () => {
    if (chartOption) {
      return (
        <div className={styles.ChartWrapper}>
          <ReactEchartsCore
            echarts={echarts}
            option={chartOption}
            notMerge={true}
            lazyUpdate={true}
            className={styles.Chart}
            theme={'theme_name'}
          />
        </div>
      )
    }
  }

  return (
    <Spin spinning={loading} className={styles.Spin}>
      {renderChart()}
    </Spin>
  )
}

export default VisitorChart
