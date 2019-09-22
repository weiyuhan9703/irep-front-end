/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Table } from 'antd'
import styles from './Report.module.less'
import { getStore } from '../../utils/util'

type columnAlignType = 'center' | 'left' | 'right' | undefined
const columnAlignCenter: columnAlignType = 'center'

const Report = () => {
  const name = getStore('user').username
  const number = getStore('user').jobNumber
  const studentClass = '15管工'
  const score = '75'
  const date = new Date()
  const time = date.toLocaleString()

  const columns = [
    {
      title: '编号',
      dataIndex: '编号',
      width: '150px',
      align: columnAlignCenter
    },
    {
      title: '项目',
      dataIndex: '项目',
      width: '300px',
      align: columnAlignCenter
    },
    {
      title: '结果',
      dataIndex: '结果',
      width: '300px',
      align: columnAlignCenter
    },
    {
      title: '得分',
      dataIndex: '得分',
      width: '200px',
      align: columnAlignCenter
    }
  ]

  const data1 = [
    {
      编号: '1',
      项目: '信息检索模型架构知识点',
      结果: '正确5项，错误3项',
      得分: '2'
    },
    {
      编号: '2',
      项目: '完整搭建搜索引擎架构',
      结果: '正确6项，错误2项',
      得分: '3'
    }
  ]

  const data2 = [
    {
      编号: '1',
      项目: '数据预处理知识点',
      结果: '正确5项，错误3项',
      得分: '3'
    },
    {
      编号: '2',
      项目: '词云分析',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '3',
      项目: '结合词云分析结果选择合适的预处理器',
      结果: '已完成',
      得分: '5'
    },
    {
      编号: '4',
      项目: '仿真预处理器',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '5',
      项目: '倒排索引知识点',
      结果: '正确4项，错误4项',
      得分: '2'
    },
    {
      编号: '6',
      项目: '完整搭建倒排索引架构 ',
      结果: '正确6项，错误2项',
      得分: '2'
    },
    {
      编号: '7',
      项目: '小规模文档集下手动构建倒排索引表',
      结果: '正确5项，错误5项',
      得分: '5'
    },
    {
      编号: '8',
      项目: '仿真倒排索引表',
      结果: '已完成',
      得分: '2'
    }
  ]

  const data3 = [
    {
      编号: '1',
      项目: '布尔模型知识点',
      结果: '正确6项，错误2项',
      得分: '2'
    },
    {
      编号: '2',
      项目: '完整搭建布尔模型架构',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '3',
      项目: '仿真布尔模型',
      结果: '已完成',
      得分: '4'
    },
    {
      编号: '4',
      项目: '布尔模型查询预处理',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '5',
      项目: '计算布尔向量',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '6',
      项目: '进行布尔运算',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '7',
      项目: '召回目标文档',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '8',
      项目: '向量空间模型知识点 ',
      结果: '正确6项，错误2项',
      得分: '2'
    },
    {
      编号: '9',
      项目: '完整搭建向量空间模型架构',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '10',
      项目: '仿真空间向量模型',
      结果: 'TF 模型参数：',
      得分: '3'
    },
    {
      编号: '11',
      项目: '求文档IDF',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '12',
      项目: '查询预处理',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '13',
      项目: '求查询的 TF',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '14',
      项目: '求查询向量',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '15',
      项目: '求各文档 TF',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '16',
      项目: '求文档向量',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '17',
      项目: '求相似度',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '18',
      项目: '概率检索模型知识点',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '19',
      项目: '完整搭建概率检索模型架构',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '20',
      项目: '调整参数 a',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '21',
      项目: '调整参数 K',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '22',
      项目: '仿真概率检索模型',
      结果: '参数 A：0.75 参数 K：1',
      得分: '4'
    },
    {
      编号: '23',
      项目: '求索引项',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '24',
      项目: '求系数 Bij',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '25',
      项目: '计算相似度',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '26',
      项目: '按相似度降序排序',
      结果: 'TF 模型参数：',
      得分: '3'
    },
    {
      编号: '27',
      项目: '语言模型知识点',
      结果: '正确6项，错误2项',
      得分: '已完成'
    },
    {
      编号: '28',
      项目: '完整搭建语言模型架构',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '29',
      项目: '调整语言模型参数',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '30',
      项目: '仿真语言模型',
      结果: '类型： 平滑系数：0.5',
      得分: '2'
    },
    {
      编号: '31',
      项目: '计算各文档 LM',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '32',
      项目: '计算各文档生成查询概率',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '33',
      项目: '按生成概率排序',
      结果: '已完成',
      得分: '2'
    },
    {
      编号: '34',
      项目: '综合四个模型的实验结果对模型进行分析',
      结果: '已完成',
      得分: '3'
    }
  ]

  // 指标
  const columns2 = [
    {
      title: '指标',
      dataIndex: '指标',
      width: '150px',
      align: columnAlignCenter
    },
    {
      title: '数值',
      dataIndex: '数值',
      width: '150px',
      align: columnAlignCenter
    }
  ]
  const data4_1_1 = [
    {
      指标: 'Precision',
      数值: '0.53649'
    },
    {
      指标: 'Precision@5',
      数值: '0.68315'
    },
    {
      指标: 'Precision@10',
      数值: '0.64821'
    },
    {
      指标: 'Precision@20',
      数值: '0.58435'
    },
    {
      指标: 'F1',
      数值: '0.58675'
    }
  ]
  const data4_1_2 = [
    {
      指标: 'Recall',
      数值: '0.53846'
    },
    {
      指标: 'Recall@5',
      数值: '0.86245'
    },
    {
      指标: 'Recall@10',
      数值: '0.75163'
    },
    {
      指标: 'Recall@20',
      数值: '0.69846'
    },
    {
      指标: 'Map',
      数值: '0.36595'
    }
  ]
  const data4_1_3 = [
    {
      指标: 'NDCG',
      数值: '0.24563'
    },
    {
      指标: 'NDCG@5',
      数值: '0.21568'
    },
    {
      指标: 'NDCG@10',
      数值: '0.35861'
    },
    {
      指标: 'NDCG@20',
      数值: '0.58463'
    }
  ]

  const CreateTable = (props: { data: unknown[] | undefined }) => {
    return (
      <div>
        <Table columns={columns2} dataSource={props.data} bordered size="small" pagination={false} />,
      </div>
    )
  }

  // 指标图
  const columns3 = [
    {
      title: '正确率-召回率曲线 ',
      dataIndex: 'image',
      width: '150px',
      align: columnAlignCenter
    }
  ]

  const image4_1_1 = [
    {
      imgae: ''
    }
  ]

  const image4_1_2 = [
    {
      imgae: ''
    }
  ]

  const CreateImage = (props: { data: unknown[] | undefined }) => {
    return (
      <div>
        <Table columns={columns3} dataSource={props.data} size="small" pagination={false} />,
      </div>
    )
  }

  const data4 = [
    {
      编号: '1',
      项目: '分析检索模型性能知识点',
      结果: '正确6项，错误2项',
      得分: '3'
    },
    {
      编号: '2',
      项目: '分析布尔模型',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '',
      项目: <CreateTable data={data4_1_1} />,
      结果: <CreateTable data={data4_1_2} />,
      得分: <CreateTable data={data4_1_3} />
    },
    {
      编号: '3',
      项目: '分析向量空间模型',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '',
      项目: <CreateTable data={data4_1_1} />,
      结果: <CreateTable data={data4_1_2} />,
      得分: <CreateTable data={data4_1_3} />
    },
    {
      编号: '',
      项目: <CreateImage data={image4_1_1} />,
      结果: <CreateImage data={image4_1_2} />,
      得分: ''
    },
    {
      编号: '4',
      项目: '分析概率检索模型',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '',
      项目: <CreateTable data={data4_1_1} />,
      结果: <CreateTable data={data4_1_2} />,
      得分: <CreateTable data={data4_1_3} />
    },
    {
      编号: '',
      项目: <CreateImage data={image4_1_1} />,
      结果: <CreateImage data={image4_1_2} />,
      得分: ''
    },
    {
      编号: '5',
      项目: '分析语言模型',
      结果: '已完成',
      得分: '3'
    },
    {
      编号: '',
      项目: <CreateTable data={data4_1_1} />,
      结果: <CreateTable data={data4_1_2} />,
      得分: <CreateTable data={data4_1_3} />
    },
    {
      编号: '',
      项目: <CreateImage data={image4_1_1} />,
      结果: <CreateImage data={image4_1_2} />,
      得分: ''
    },
    {
      编号: '6',
      项目: '对仿真结果进行分析说明',
      结果: '分析比较到位，对模型理解较好',
      得分: '5'
    }
  ]
  const data5 = [
    {
      编号: '1',
      项目: '仿真搜索引擎 ',
      结果: '已完成',
      得分: '5'
    }
  ]

  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>实验报告</div>
        <div className={styles.subTitle}>Experiment Report</div>
      </div>
      <div className={styles.Content}>
        <div className={styles.Report}>
          <h1 className={styles.ReportTitle}>武汉大学《网络大数据搜索引擎设计虚拟仿真实验》实验报告</h1>
          <div className={styles.reporTop}>
            <div>
              姓名：<input className={styles.topInput} value={name} disabled></input>
            </div>
            <div>
              学号：<input className={styles.topInput} value={number} disabled></input>
            </div>
            <div>
              班级：<input className={styles.topInput} value={studentClass} disabled></input>
            </div>
            <div>
              评分：<input className={styles.topInput} value={score} disabled></input>
            </div>
          </div>
          <div className={styles.reporTop2}>
            <div>
              实验名称：<input className={styles.topInput2} value="网络大数据搜索引擎设计虚拟仿真实验" disabled></input>
            </div>
            <div>
              实验日期：<input className={styles.topInput3} value={time} disabled></input>
            </div>
          </div>
          <h2>实验结果与分析：</h2>
          <Table
            columns={columns}
            dataSource={data1}
            bordered
            size="small"
            title={() => '子实验1   信息检索模型架构'}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data2}
            bordered
            size="small"
            title={() => '子实验2   构建搜索引擎索引器'}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data3}
            bordered
            size="small"
            title={() => '子实验3   构建搜索引擎检索器'}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data4}
            bordered
            size="small"
            title={() => '子实验4   分析检索模型性能'}
            pagination={false}
          />
          ,
          <Table
            columns={columns}
            dataSource={data5}
            bordered
            size="small"
            title={() => '子实验5   仿真搜索引擎'}
            pagination={false}
          />
          ,
        </div>
      </div>
    </div>
  )
}

export default Report
