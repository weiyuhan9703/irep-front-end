import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import styles from './Team.module.less'
import VisitorChart from '../../components/visitorChart/VisitorChart'

const TeamComponet = (props: RouteComponentProps) => {
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
            <button className={styles.activeButton} onClick={() => switchRoute('/introduction/team')}>
              支持团队
            </button>
            <button className={styles.commonButton} onClick={() => switchRoute('/introduction/architecture')}>
              系统架构
            </button>
          </div>
        </div>
        <div className={styles.rightDiv}>
          <div className={styles.mainContent}>
            <div className={styles.title}>
              <div className={styles.titleIcon}></div>武汉大学信息检索与知识挖掘研究所：
            </div>
            <div className={styles.texts}>
              <div>
                武汉大学信息检索与知识挖掘研究所是武汉大学校级研究中心。该所成立于2010年。依托武汉大学首批70后“信息检索方法与技术”学者学术团队，聚焦信息检索、知识挖掘与可视化、竞争情报方法与技术、大数据分析挖掘与应用等研究热点问题，经过几年的发展，研究所在队伍建设、科学研究、人才培养、社会服务、国际交流等方面取得了显著成绩，成为领域内具有较大影响力的研究中心。{' '}
              </div>
              <div>
                研究所现有专职研究员8人，兼职研究员4人，其中长江学者计划入选者1人，中组部“青年拔尖人才支持计划”入选者2人，教育部“新世纪优秀人才计划”入选者2人，武汉大学珞珈特聘教授3人，博士后5人，在读博硕士研究生40余人。{' '}
              </div>
              <div>
                研究所先后参与和承担过国家社科基金重大项目、教育部社科基地重大项目、863项目、国家科技支撑计划、国家自科基金、国家社科基金等各类纵向项目10余项；与国网湖北电力公司、湖北省标准化与质量研究院、泰康在线财产险保险股份有限公司、濮阳经济技术开发区经济发展局、深圳前海鹏元数据技术有限公司、西藏民族大学等企事业单位开展研究合作，承担各类横向项目30余项。研究所先后发表SSCI、SCI、EI等各类索引论文100余篇，研究成果获湖北省自然科学优秀论文二等奖、武汉市人文社会科学优秀成果二等奖。
              </div>
              <div>
                研究所培养的博士毕业生多任教于国内优秀高校，如武汉大学、西南大学；硕士毕业生有多人前往美国匹兹堡大学、德雷塞尔大学继续攻读博士学位。此外，研究所也为行业发展输送了大量的高素质优秀人才。团队培养学生大多在腾讯、百度、阿里巴巴、华为等高科技互联网企业工作，其较强的理论知识与专业技能得到了企业和行业的广泛认可。
              </div>
              <div>
                研究所自主设计研发了网络大数据信息自动采集平台WHU-REAPER、互联网舆情信息跟踪平台WHU-POMS、专家检索系统WHU-ES、可视化工具WHU-HTMVIS以及NEVIEWER等各类软件工具10余个，申请软件著作权和专利多个，软件成果及专利技术广泛应用于数十家科研院所和企事业单位。多个软件平台开发了用户接口，服务于相关学者和研究人员，产出了一批高质量的研究成果。
              </div>
              <div>
                研究所十分重视国际交流与合作，不断提升研究工作的国际化。研究所已与美国匹兹堡大学、印第安纳大学、丹麦哥本哈根大学、英国伦敦城市大学和荷兰阿姆斯特丹大学等多国研究机构及专家建立了密切的交流合作关系，共同合作致力于高水平人才的培养和科研成果的产出。研究所现已派出3名博士前往美国匹兹堡大学、丹麦哥本哈根大学和荷兰阿姆斯特丹大学开展研究工作。
              </div>
              <p></p>
            </div>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.title}>
              <div className={styles.titleIcon}></div>图书情报国家级实验教学示范中心
            </div>
            <div className={styles.texts}>
              <div>
                武汉大学图书情报实验教学中心，前身是成立于1988年的武汉大学图书情报学院“图书情报实验室”。2001年，通过湖北省教育厅组织的专家评审，成为湖北省第一个文科类“合格基础实验室”，同年正式更名为“武汉大学图书情报实验教学中心”。2007年，获批为“湖北省实验教学示范中心”。
              </div>
              <div>
                立足于本科生、研究生专业课程的实验教学和实践，中心全面服务于武汉大学信息管理学院“图书馆、情报与档案管理”一级学科各专业。同时，致力于大学生信息素养培养和信息能力提升，面向全校学生开设“信息素养”类课程。
              </div>
              <div>
                中心所属的武汉大学信息管理学院，是我国图书情报类专业人才培养历史最悠久、规模最大、实力最强的高等教育机构。学院系“985工程”和“211工程”项目建设单位，共设有6个本科专业，2个一级学科博士学位授权点，8个二级学科博士点，2个博士后流动站，1个本领域唯一的“教育部人文社会科学重点研究基地”。
              </div>
              <div>
                2007年，图书馆学、情报学学科顺利通过教育部组织的国家重点学科考核评估，“图书馆、情报与档案管理”一级学科被认定为本领域唯一的一级学科国家重点学科;2009年，在教育部公布的新一轮全国学科评估中，“图书馆、情报与档案管理”一级学科以满分的成绩再次名列第一。
              </div>
              <div>
                秉承武汉大学“创造、创新、创业”的三创人才培养思路，基于学院“开拓创造、务实创业、引领创新”的办学特色，根据图书情报学专业的特点及实验教学和实践的建设定位，中心树立了“强化基础，增强能力，注重应用，培养素质，促进创新”的实验教学理念，着力培养学生的信息能力、提升学生的信息素养。
              </div>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Team = withRouter(TeamComponet)

export default Team
