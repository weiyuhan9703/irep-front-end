import React, { useState } from 'react'
import { Form, Input, Radio, Button, notification } from 'antd'
import { Dispatch } from 'redux'
import { FormComponentProps } from 'antd/lib/form/Form'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { RadioChangeEvent } from 'antd/lib/radio/interface'
import styles from './Register.module.less'
import userAvatar from '../../assets/login/user.png'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'
import { defaultMobileRegExp, defaultUserEmailRegExp } from '../../config/Constant'

interface RegisterProp extends RouteComponentProps, FormComponentProps {}

interface Param {
  type: string
  number: number
  userName: string
  password: string
  mobile: string
  email: string
  department: string
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  }
}

const defaultForm = {
  type: 1,
  number: '',
  userName: '',
  password: '',
  mobile: '',
  email: '',
  department: ''
}

const RegisterForm = (props: RegisterProp) => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const dispatch: Dispatch<Actions> = useDispatch()
  const { getFieldDecorator, getFieldsValue, validateFields, resetFields } = props.form

  const goRoute = (path: string) => {
    props.history.push(path)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFields((err: any) => {
      if (!err) {
        setLoading(true)
        const fieldValue = getFieldsValue(['type', 'number', 'userName', 'password', 'mobile', 'email', 'department'])
        submitRequest(fieldValue as Param)
      }
    })
  }

  const submitRequest = async (fieldValue: Param) => {
    const res = await requestFn(dispatch, {
      url: '/user/signIn',
      method: 'post',
      params: {},
      data: {
        category: fieldValue.type,
        jobNumber: fieldValue.number,
        username: fieldValue.userName,
        password: fieldValue.password,
        phone: fieldValue.mobile,
        email: fieldValue.email,
        workSpace: fieldValue.department
      }
    })
    setLoading(false)
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('注册成功', '')
      setTimeout(() => {
        props.history.replace('/login')
      }, 1000)
    } else {
      errorTips('注册失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
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

  const changeUserType = (e: RadioChangeEvent) => {
    setForm({
      ...form,
      type: e.target.value,
      ...(e.target.value === 1 ? { number: e.target.value } : {})
    })
    resetFields(['number'])
  }

  return (
    <div className="GlobalContainer">
      <div className={styles.FormWrapper}>
        <div className={styles.FormTitel}>
          <img src={userAvatar} alt="用户图标" />
          <span>用户注册</span>
        </div>
        <Form {...formItemLayout} onSubmit={handleSubmit} className={styles.Form}>
          <Form.Item label="用户类别">
            {getFieldDecorator('type', {
              initialValue: form.type
            })(
              <Radio.Group size="large" onChange={changeUserType}>
                <Radio value={1}>校内用户</Radio>
                <Radio value={2}>校外用户</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="学号或工号">
            {getFieldDecorator('number', {
              rules: [{ required: form.type === 1, message: '请输入用户名' }]
            })(<Input placeholder="请输入学号或工号，校内用户必填" size="large" disabled={form.type !== 1} />)}
          </Form.Item>
          <Form.Item label="用户名">
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }]
            })(<Input placeholder="用户名" size="large" />)}
          </Form.Item>
          <Form.Item label="请输入密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(<Input type="password" placeholder="密码" size="large" />)}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('mobile', {
              rules: [{ required: true, pattern: defaultMobileRegExp, message: '请输入正确的手机号' }]
            })(<Input placeholder="请输入手机号" size="large" />)}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              rules: [{ required: true, pattern: defaultUserEmailRegExp, message: '请输入正确的邮箱地址' }]
            })(<Input placeholder="请输入邮箱" size="large" />)}
          </Form.Item>
          <Form.Item label="工作单位">
            {getFieldDecorator('department', {})(<Input placeholder="请输入工作单位" size="large" />)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 8, offset: 8 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
            <div className={styles.FormTipsText}>
              <span>已有账号？</span>
              <span className={styles.LoginTextBtn} onClick={() => goRoute('/login')}>
                去登录
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

const RegisterWithoutRouter = Form.create<RegisterProp>({ name: 'RegisterForm' })(RegisterForm)
const Register = withRouter(RegisterWithoutRouter)

export default Register
