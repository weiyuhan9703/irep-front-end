import React, { useState} from 'react'
import styles from './Discussion.module.less'
import { List} from 'antd';
import commentImage from '../../assets/discussion/comment.png'
import peopleImage from "../../assets/discussion/people.png"
import timeImage from "../../assets/discussion/time.png"
import { getStore } from '../../utils/util';

var commentList=[
  {
    addCommentDisabled:'0',
    author:"方荣甫",
    content:"在搜索引擎使用中，关键字and、or、not的区别是什么？",
    time:"2019/8/9 10:56:10",
    comments:[
      {
        author:"郭晨睿",
        content:"随着1946年世界上第一台电子计算机问世，计算机技术逐步走进信息检索领域，并与信息检索理论紧密结合起来。",
        time:"2019/8/9 10:56:10",
      },
      {
        author:"方荣甫",
        content:"信息检索起源于图书馆的参考咨询和文摘索引工作，目的在于从一大推信息中找到我们所需要的某部分思想，进一步"
    +"使之更加具体；信息检索的目标是从一大堆文档等非结构信息中根据我们的需求筛选出我们需要的文档。",
        time:"2019/8/9 10:56:10",
      },
    ]
  },
  {
    addCommentDisabled:'0',
    author:"郭晨睿",
    content:"信息检索起源于图书馆的参考咨询和文摘索引工作，目的在于从一大推信息中找到我们所需要的某部分思想，进一步"
    +"使之更加具体；信息检索的目标是从一大堆文档等非结构信息中根据我们的需求筛选出我们需要的文档。",
    time:"2019/8/9 10:56:10",
    comments:[]
  },
  {
    addCommentDisabled:'0',
    author:"巴拉拉",
    content:"随着1946年世界上第一台电子计算机问世，计算机技术逐步走进信息检索领域，并与信息检索理论紧密结合起来。",
    time:"2019/8/9 10:56:10",
    comments:[]
  },
]

const Comments =()=> {
  const [addCommentDisabled, setAddCommentDisabled]=useState(true)
  const [addCommentValue, setAddCommentValue] = useState('')
  
  // 点击回复按钮
  const addComment=(index:number)=>{
    setAddCommentDisabled(false)
    commentList[index].addCommentDisabled='1'
  }
  
  // 点击确定回复按钮
  const confirmAddComment=(index:number)=>{
    setAddCommentDisabled(true)
    commentList[index].addCommentDisabled='0'
    var date=new Date()
    var mytime=date.toLocaleString('chinese', { hour12: false })
    commentList[index].comments.push(
      {
        author:getStore('user') ? getStore('user').username : '郭晨睿',
        content:addCommentValue,
        time:mytime,
      }
    )
    setAddCommentValue('')
  }
  
  // 点击取消回复按钮
  const cancelAddComment=(index:number)=>{
    setAddCommentDisabled(true)
    commentList[index].addCommentDisabled='0'
    setAddCommentValue('')
  }
  
  // 处理输入框的变化
  const handleTextareaChange=(event:any)=>{
    setAddCommentValue(event.target.value)
  }

  // 评论主体部分
  return commentList.map((item, index) => {
    return(
      <div className={styles.CommentView} key={index}>
        <div className={styles.mainComment}>
          <div className={styles.leftView}>
            <div>{item.content}</div>
            <div style={{marginTop:8}}>
              <span><img src={peopleImage} alt=''></img>{item.author}</span>
              <span><img src={timeImage} alt=''></img>{item.time}</span>
            </div>
          </div>
          <div className={styles.rightView}>
            <img src={commentImage} alt=''></img>
            <button onClick={()=>addComment(index)}>回复</button>
          </div>
        </div>
        <div className={styles.addCommentView} hidden={item.addCommentDisabled==='0'} key={index}>
          <textarea className={styles.commentInput} value={addCommentValue} onChange={handleTextareaChange}></textarea>
          <div className={styles.buttonView}>
            <button className={styles.button1} onClick={()=>cancelAddComment(index)}>取消</button>
            <button className={styles.button2} onClick={()=>confirmAddComment(index)}>确定</button>
          </div>
        </div>
        <div hidden={item.comments.length===0}>
          <List
            className={styles.childrenCommentView}
            itemLayout="horizontal"
            dataSource={item.comments}
            renderItem={i => (
              <li>
                <div className={styles.childComment}>
                  <div className={styles.childComment1}>
                    <text className={styles.name}>{i.author}：</text>
                    <text className={styles.content}>{i.content}</text>
                  </div>
                  <div className={styles.childComment2}>
                    <text>{i.time}  回复</text>
                  </div>
                </div>
              </li>
            )}
          />
        </div>
      </div>
    )
  })
}

const Discussion = () => {
  const[myCommentValue,setMyCommentValue]=useState('')

  const handleMyCommentChange=(event:any)=>{
    setMyCommentValue(event.target.value)
  }

  const handleMyCommentConfirm=()=>{
    var date=new Date()
    var mytime=date.toLocaleString('chinese', { hour12: false })
    commentList.push(
      {
        addCommentDisabled:'0',
        author:getStore('user') ? getStore('user').username : '郭晨睿',
        content:myCommentValue,
        time:mytime,
        comments:[],
      }
    )
    setMyCommentValue('')
  }

  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>交流讨论</div>
        <div className={styles.subTitle}>Exchange Discussion</div>
      </div>
      <div className={styles.Content}>
        <div className={styles.myComment}>
          <h1>发表你的问题或想法：</h1>
          <textarea className={styles.textInput} placeholder="说说你的想法，或者有什么问题？和大家一起讨论吧！" onChange={handleMyCommentChange} value={myCommentValue}></textarea>
          <button className={styles.confirmButton} onClick={handleMyCommentConfirm}>马上发表</button>
        </div>
        <h1>讨论区：</h1>
        {Comments()}
      </div>
    </div>
  )
}

export default Discussion