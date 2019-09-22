import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { Form, notification, Button, Input, Icon, Checkbox } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form/Form'
import styles from './Login.module.less'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'
import { setStore } from '../../utils/util'
import Announcement from './Announcement'
import LoginStatus from './LoginStatus'
import videoSource from '../../assets/videos/irep.mp4'
import videoPoster from '../../assets/login/video.jpg'

interface Params {
  userName: string
  password: string
}

interface LoginProp extends RouteComponentProps, FormComponentProps {}

const LoginForm = (props: LoginProp) => {
  const [loading, setLoading] = useState(false)
  const dispatch: Dispatch<Actions> = useDispatch()

  const { getFieldDecorator, getFieldsValue, validateFields } = props.form

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFields((err: any) => {
      if (!err) {
        setLoading(true)
        const fieldValue = getFieldsValue(['userName', 'password'])
        loginRequest(fieldValue as Params)
      }
    })
  }

  const loginRequest = async (fieldValue: Params) => {
    const res = await requestFn(dispatch, {
      url: '/user/login',
      method: 'post',
      params: {},
      data: {
        username: fieldValue.userName,
        password: fieldValue.password
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 101) {
      setStore("source",'0')
      setStore('user', res.data.data || { username: '张三' })
      if (fieldValue.userName === '专家' || fieldValue.userName === 'zhuanjia') {
        setStore('zhuanjia', true)
      } else {
        setStore('zhuanjia', false)
      }
      successTips('登录成功', '')
      setTimeout(() => {
        // 使用原生跳转，以更新权限
        window.location.href = '/introduction/background'
      }, 1000)
    } else {
      errorTips('登录失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
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

  const goRoute = (path: string) => {
    props.history.push(path)
  }

  // const goLabSpace = () => {
  //   window.location.href = window.location.origin
  // }

  /** 专家入口/免注册在线体验 */
  const expertEntrance = async () => {
    const res = await requestFn(dispatch, {
      url: '/user/login',
      method: 'post',
      params: {},
      data: {
        username: '专家',
        password: '123456'
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 101) {
      setStore('user', res.data.data || { username: '张三' })
      setStore('zhuanjia', true)
      setStore("source",'0')
      setTimeout(() => {
        // 使用原生跳转，以更新权限
        window.location.href = '/introduction/background'
      }, 1000)
    } else {
      errorTips('请求错误，请重试！')
    }
  }

  return (
    <div>
      <div className={styles.LoginContainer}>
        <div className={styles.FormWrapper}>
          <div className={styles.VideoWrapper}>
            <video controls poster={videoPoster}>
              <source src={videoSource} type="video/mp4" />
            </video>
          </div>
          <div className={styles.LoginForm}>
            <label className={styles.Title}>用户登录</label>
            <Form onSubmit={handleSubmit} className={styles.Form}>
              <Form.Item>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入用户名' }]
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )}
              </Form.Item>
              <Form.Item className={styles.FormRow}>
                <div className={styles.ForgetPasswordFormItem}>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true
                  })(<Checkbox>记住用户名</Checkbox>)}
                  <a className={styles.ForgetPassword} href="/">
                    忘记密码
                  </a>
                </div>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className={`${styles.FormButton} ${styles.LoginButton}`}>
                  登录
                </Button>
                <Button
                  type="primary"
                  ghost
                  size="large"
                  className={`${styles.FormButton}`}
                  onClick={() => goRoute('/register')}>
                  注册
                </Button>
              </Form.Item>
              {/* <Form.Item>
                <Button type="primary" ghost block size="large" onClick={goLabSpace}>
                  实验空间账号登录
                </Button>
              </Form.Item> */}
            </Form>
            <p className={styles.Experience} onClick={expertEntrance}>
              专家评审入口
            </p>
          </div>
        </div>
      </div>
      <div className={styles.Bottom}>
        <div className={styles.NoticeWrapper}>
          <Announcement />
        </div>
        <div className={styles.Information}>
          <LoginStatus />
        </div>
      </div>
      <div className={styles.BrowserWrapper}>
        <span>为保证实验效果，建议使用</span>
        <span className={styles.Brower}>Chrome、Edge</span>
        <span>浏览器打开</span>
      </div>
    </div>
  )
}

const LoginWithoutRouter = Form.create<LoginProp>({ name: 'LoginForm' })(LoginForm)
const Login = withRouter(LoginWithoutRouter)

export default Login
