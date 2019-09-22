import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { Input, Button, notification } from 'antd'
import styles from './Contactus.module.less'
import addressImg from '../../assets/Contactus/address.png'
import answerImg from '../../assets/Contactus/answer.png'
import falseImg from '../../assets/Contactus/false.png'
import technologyImg from '../../assets/Contactus/technology.png'
import { requestFn } from '../../utils/request'
import { Actions } from '../../store/Actions'
import { useDispatch } from '../../store/Store'

const { TextArea } = Input

/** 联系我们 */
const Contactus = () => {
  const dispatch: Dispatch<Actions> = useDispatch()
  //要提交的表单内容
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [advice, setAdvice] = useState('')
  const [submitLoding, setSubmitLoding] = useState(false)

  /** 更新电话号码 */
  const updatePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value)
  }

  /** 更新电子邮箱 */
  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  /** 更新建议内容 */
  const updateAdvice = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdvice(event.target.value)
  }

  const saveAdvice = async () => {
    setSubmitLoding(true)
    const res = await requestFn(dispatch, {
      url: '/opinion/add',
      method: 'post',
      data: {
        oPhone: phone,
        oEmail: email,
        oContent: advice
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      setSubmitLoding(false)
      successTips('感谢您建议！', '')
    } else {
      setSubmitLoding(false)
      errorTips('提交失败，请联系系统管理员！', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      duration: 1.5,
      description
    })
  }

  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  return (
    <div className={styles.Container}>
      <div className={styles.topContainer}>
        <div className={styles.topTitle}>联系我们</div>
        <div className={styles.subTitle}>Contact Us</div>
      </div>
      <div className={styles.Content}>
        <div className={styles.left}>
          <div className={styles.suggestion}>
            <h2 className={styles.title}>感谢您对实验平台进一步优化提出的宝贵意见！</h2>
            <h3 className={styles.subTitle}>请您描述实验中的具体问题，我们会及时向您反馈</h3>
            <div className={styles.form}>
              <label className={styles.label}>您的电话：</label>
              <Input className={styles.input} value={phone} onChange={updatePhone} />
            </div>
            <div className={styles.form}>
              <label className={styles.label}>您的邮箱：</label>
              <Input className={styles.input} value={email} onChange={updateEmail} />
            </div>
            <div className={styles.form}>
              <label className={styles.textAreaLable}>详细描述：</label>
              <TextArea className={styles.textArea} rows={4} value={advice} onChange={updateAdvice} />
            </div>
            <Button className={styles.button} type="primary" loading={submitLoding} onClick={saveAdvice}>
              提交
            </Button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>
            <label className={styles.label}>联系信息</label>
          </div>
          <div className={styles.contact}>
            <div className={styles.info}>
              <div className={styles.img}>
                <img src={answerImg} alt="icon" />
              </div>
              <div className={styles.subInfo}>
                <label className={styles.subInfo1}>实验答疑：郭晨睿</label>
                <label className={styles.subInfo2}>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：18101930560</label>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.img}>
                <img src={technologyImg} alt="icon" />
              </div>
              <div className={styles.subInfo}>
                <label className={styles.subInfo1}>技术支持：郭晨睿</label>
                <label className={styles.subInfo2}>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：18101930560</label>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.img}>
                <img src={falseImg} alt="icon" />
              </div>
              <div className={styles.subInfo}>
                <label className={styles.subInfo1}>实验答疑：郭晨睿</label>
                <label className={styles.subInfo2}>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：18101930560</label>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.img}>
                <img src={addressImg} alt="icon" />
              </div>
              <div className={styles.subInfo}>
                <label className={styles.subInfo2}>联系地址：湖北省武汉市武昌区武汉大学信息管理学院</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contactus
