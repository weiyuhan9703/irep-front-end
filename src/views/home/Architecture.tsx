import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './Architecture.module.less'
import VisitorChart from '../../components/visitorChart/VisitorChart'
import constuctImg from '../../assets/home/irep系统架构图.png'

const ArchitectureComponet = (props: RouteComponentProps) => {
  const switchRoute = (path: string) => {
    props.history.replace(path)
  }
  return (
    <div className={styles.Container}>
      <div className={styles.topContent}>
        <div className={styles.top}>
          <div className={styles.introductionText}>
            <p>
              信息检索（information
              retrieval，简称IR）是从大规模非结构化数据（通常是文本）的集合（通常保存在计算机上）中找出满足用户需求的资料（通常是文档）的过程
              。
            </p>
            <p>
              以下为您详细展示中文文档信息检索的全过程。采用了布尔模型、向量空间模型、语言模型。并对不同模型的检索性能进行定量评价。
            </p>
          </div>
          <div className={styles.introductionVideo}></div>
        </div>
      </div>
      <div className={styles.Content}>
        <div className={styles.leftDiv}>
          <div className={styles.visitors}>
            <VisitorChart />
          </div>
          <div className={styles.courseIntro}>
            <div>
              <div className={styles.infoTitle}>
                <img src={require('../../assets/introduction/subject.png')} className={styles.icon} alt=""></img>
                <span>面向专业</span>
              </div>
              <div className={styles.infoText}>信息管理与信息系统</div>
            </div>
          </div>
          <div className={styles.courseIntro}>
            <div>
              <div className={styles.infoTitle}>
                <img src={require('../../assets/introduction/course.png')} className={styles.icon} alt=""></img>
                <span>所属课程</span>
              </div>
              <div className={styles.infoText}>信息检索实验</div>
            </div>
          </div>
          <div className={styles.courseIntro}>
            <div>
              <div className={styles.infoTitle}>
                <img src={require('../../assets/introduction/time.png')} className={styles.icon} alt=""></img>
                <span>实验课时 </span>
              </div>
              <div className={styles.infoText}>实验课程课时：48课时</div>
              <div className={styles.infoText}>实验项目课时：6课时</div>
            </div>
          </div>
          <div className={styles.chooseButton}>
            <button className={styles.commonButton} onClick={() => switchRoute('/introduction/background')}>
              实验背景
            </button>
            <button className={styles.commonButton} onClick={() => switchRoute('/introduction/team')}>
              支持团队
            </button>
            <button className={styles.activeButton} onClick={() => switchRoute('/introduction/architecture')}>
              系统架构
            </button>
          </div>
        </div>
        <div className={styles.rightDiv}>
          <div className={styles.mainContent}>
            <div className={styles.title}>
              <div className={styles.titleIcon}></div>系统架构与简要说明：
            </div>
            <div className={styles.texts}>
              <div>
                该三维虚拟仿真实验系统以B/S 架构设计，基于图书情报国家级实验教学示范中心平台运行。系统采用服务器集群、数据层、支撑层、通用服务层、仿真层、应用层六层架构。
              </div>
              <div>
                1. 服务器集群主要提供大数据分布式存储和分析的硬件支持。
              </div>
              <div>
                2. 数据层：数据层储存了该实验的所有建模信息及虚拟组件，包括：用户基础信息用户实验记录、用户实验结果、基础实验数据、倒排索引数据等。
              </div>
              <div>
                3. 支撑层：支撑层是基于网络的实验管理平台，是保证实验在网上正常运行的基础。
              </div>
              <div>
                4. 通用服务层，通用服务层封装了实验所必须的各种服务，如用户管理、实验管理、实验数据管理、实验报告管理等。
              </div>
              <div>
                5. 仿真层：仿真层主要是根据真实实验场景进行建模，还原实验本身，并且在实验过程中，使用者可以在虚拟实验中探索不同参数设置对实验结果的影响，拓宽实验深度和广度。
              </div>
              <div>
                6. 应用层：本层具有拓展性，可以满足多终端不同用户的需要。
              </div>
              <img className={styles.constuctImg} src={constuctImg} alt="系统架构图" />
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Architecture = withRouter(ArchitectureComponet)

export default Architecture
