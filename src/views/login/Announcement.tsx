import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './Announcement.module.less'

const notices = [
  {
    title: '【考试通知】期末考试时间6月20日，请各位同学做好复习工作',
    date: '06-01',
    year: '2019'
  },
  {
    title: '【系统维护】本周系统维护升级，暂时无法实验',
    date: '05-05',
    year: '2019'
  }
]

/** 登录页的通知公告组件 */
const AnnouncementComponet = (props: RouteComponentProps) => {
  const goRoute = (path: string) => {
    props.history.push(path)
  }

  const renderNotices = () => {
    return notices.map((i, index: number) => {
      return (
        <div key={index} className={styles.NoticeItem} onClick={() => goRoute('/notice')}>
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
      <div className={styles.TitleRow}>
        <div className={styles.Label}></div>
        <span className={styles.Title}>通知公告</span>
        <span className={styles.Description}>announcement</span>
      </div>
      {renderNotices()}
    </div>
  )
}

/** 通知公告 */
const Announcement = withRouter(AnnouncementComponet)

export default Announcement
