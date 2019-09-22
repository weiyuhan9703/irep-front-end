import React, { useState, useEffect } from 'react'
import { Pagination } from 'antd'
import styles from './notice.module.less'

const defaultPageSize = 5

const defaultNotices = [
  {
    title: '【考试通知】期末考试时间6月20日，请各位同学做好复习工作',
    date: '06-01',
    year: '2019'
  },
  {
    title: '【系统维护】本周系统维护升级，暂时无法实验',
    date: '05-05',
    year: '2019'
  },
  {
    title: '【选课通知】欢迎同学选择信息检索实验课程',
    date: '03-10',
    year: '2019'
  },
  {
    title: '【考试通知】期末考试时间1月20日，请各位同学做好复习工作',
    date: '01-01',
    year: '2019'
  },
  {
    title: '【选课通知】欢迎同学选择信息检索实验课程',
    date: '07-03',
    year: '2018'
  },
  {
    title: '【系统维护】本周系统维护升级，暂时无法实验',
    date: '07-02',
    year: '2018'
  },
  {
    title: '【考试通知】期末考试时间6月20日，请各位同学做好复习工作',
    date: '06-01',
    year: '2017'
  },
  {
    title: '【系统上线】网络大数据虚拟仿真实验正式上线，欢迎广大同学使用！',
    date: '07-02',
    year: '2017'
  }
]

const Notice = () => {
  const [notices, setNotices] = useState<{ title: string; date: string; year: string }[]>([])
  const [currentPageIndex, setCurrentPageIndex] = useState(1)

  useEffect(() => {
    const initNotices = () => {
      const newNotices = defaultNotices.filter((i, index) => {
        return index >= (currentPageIndex - 1) * defaultPageSize && index < currentPageIndex * defaultPageSize
      })
      setNotices(newNotices)
    }

    initNotices()
  }, [currentPageIndex])

  const onPageChange = (page: number) => {
    setCurrentPageIndex(page)
  }

  const itemRender = (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactElement<HTMLElement>
  ) => {
    if (type === 'prev') {
      return <span>上一页</span>
    }
    if (type === 'next') {
      return <span>下一页</span>
    }
    return originalElement
  }

  const renderNotices = () => {
    return notices.map((i, index: number) => {
      return (
        <div key={index} className={styles.NoticeItem}>
          <div className={styles.NoticeTitle}>{i.title}</div>
          <div className={styles.Time}>
            <p className={styles.Date}>{i.date}</p>
            <p className={styles.Year}>{i.year}</p>
          </div>
        </div>
      )
    })
  }

  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>系统通知</div>
        <div className={styles.subTitle}>System Notifiction</div>
      </div>
      <div className={styles.Content}>
        <div className={styles.notices}>
          {renderNotices()}
          <div className={styles.Pagination}>
            <Pagination
              defaultCurrent={currentPageIndex}
              total={defaultNotices.length}
              itemRender={itemRender}
              defaultPageSize={defaultPageSize}
              onChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notice
