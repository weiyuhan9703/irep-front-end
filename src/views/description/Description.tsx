import React from 'react'
import styles from './Description.module.less'

const Description = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>考核说明</div>
        <div className={styles.subTitle}>Inspection Instructions</div>
      </div>
      <div className={styles.Content}>
        <p>
          本虚拟仿真项目采用多指标考核的方式对学生的学习效果进行考核，具体分为为预习考核、实验过程考核、实验结果考核三部分组成。各种考核方式总分值100分。
        </p>
        <p>
          （1）预习考核——预习考核是在学生掌握相关知识背景之后、在每项子实验之前进行的。该层次考核的目的是判断学生是否有足够的知识储备进行网络大数据搜索引擎设计虚拟仿真实验，从而保证虚拟仿真实验的效果。该层次考核以选择题和填空题形式进行，每个子实验4道选择题4道填空题。该部分总分值14分。
        </p>
        <p>
          （2）实验过程考核——实验过程考核包括操作过程考核和实验分析，考察学生是否在实验过程中准确无遗漏地完成了实验操作，并对重要实验阶段的实验效果做总结分析。目的是考核学生是否对实验有准确清晰的理解并提升实验效果。该部分总分值 40 分。
        </p>
        <p>
          （3）实验结果考核——实验结果考核是在学生完成模型检索设计操作后进行的，以考察学生对搜索引擎的系统的理解程度。最后选择仿真模型，考察学生对检索模型性能指标的理解程度。该部分总分 40 分，具体评分标准如下：
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;（a）各检索模型性能评测
        </p>
        <p>
          ①p@20＞0.5，评分为 10 分；0.4≤p@20＜0.5,评分为 8 分；0.3≤p@20＜0.4,评分为 5 分；0.2≤p@20＜0.3，评分为 3 分；0.1≤p@20＜0.2，评分为 1 分。
        </p>
        <p>
          ②recall@20＞0.5，评分为 10 分；0.4≤recall@20＜0.5，评分为 8 分；0.3≤recall@20＜0.4，评分为 5 分；0.2≤recall@20＜0.3，评分为 3 分；0.1≤recall@20＜0.2，评分为 1 分。
        </p>
        <p>
          ③NDCG@20＞0.5，评分为 10 分；0.4≤NDCG@20＜0.5，评分为 8 分；0.3≤NDCG@20＜0.4，评分为 5 分；0.2≤NDCG@20＜0.3，评分为 3 分；0.1≤NDCG@20＜0.2，评分为 1 分。
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;（b）选择仿真模型，选择NDCG@20排名第一的模型10分，选择NDCG@20排名第二的模型5分，选择NDCG@20排名第三的模型2分，选择布尔模型0分。
        </p>
      </div>
    </div>
  )
}

export default Description
