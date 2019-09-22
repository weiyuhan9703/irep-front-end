import React, { useState, useEffect } from 'react'
import { Dispatch } from 'redux'
import { Form, Input, Checkbox, Button, notification } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import styles from './Examination.module.less'
import titleLeftImg from '../../assets/experiment/exam/completion_title_left.png'
import titleRightImg from '../../assets/experiment/exam/completion_title_right.png'
import { OriginCompletionQuestion, ChoiceQuestion, ProcessedCompletionQuestion, Option } from '../../modal/Question'
import { requestFn } from '../../utils/request'
import { useDispatch } from '../../store/Store'
import { Actions } from '../../store/Actions'

const CheckboxGroup = Checkbox.Group

/** 保存分数方法接口 */
export interface ScoreObj {
  completionSore: number
  choiceScore: number
}

/** 知识自查表单组件接口 */
interface ExamFormProps extends FormComponentProps {
  completionQuestions: OriginCompletionQuestion[]
  choiceQuestions: ChoiceQuestion[]
  readonly experimentId?: number
  goNextStep?: () => void
}

/** 知识自查表单组件 */
const ExamForm = (props: ExamFormProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const [completionQuestions, setCompletionQuestions] = useState<ProcessedCompletionQuestion[]>([])
  const [validError, setValidError] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getFieldDecorator, validateFields, getFieldsValue } = props.form

  useEffect(() => {
    /** 将原始完成题目处理成页面可用的完成题目 */
    const handleCompletionQuestions = (questions: OriginCompletionQuestion[]) => {
      const newCompletionQuestions = questions.map(i => {
        return {
          prefix: i.title.split(/[_]{3,}/g)[0],
          suffix: i.title.split(/[_]{3,}/g)[1],
          answer: i.answer,
          score: i.score
        }
      })
      setCompletionQuestions(newCompletionQuestions)
    }

    handleCompletionQuestions(props.completionQuestions)
  }, [props.completionQuestions])

  /** 点击确认答案 */
  const confirmAnswer = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateFields((err: any) => {
      if (!err) {
        setValidError(false)
        const fieldValue = getFieldsValue()
        const newFiledValue = handleAnser(fieldValue)
        saveExaminationAnswer(newFiledValue)
      } else {
        setValidError(true)
      }
    })
  }

  /** 保存用户填写的知识自查答案到后台 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveExaminationAnswer = async (answer: any) => {
    setLoading(true)
    const res = await requestFn(dispatch, {
      url: '/score/updateChoiceAndCompletionScore',
      method: 'post',
      data: {
        experimentId: props.experimentId,
        ...answer
      }
    })
    if (res && res.status === 200 && res.data && res.data.code === 0) {
      successTips('保存答案成功', '')
      setTimeout(() => {
        setLoading(false)
        if (props.goNextStep) {
          props.goNextStep()
        }
      }, 1000)
    } else {
      setLoading(false)
      errorTips('保存答案失败', res && res.data && res.data.msg ? res.data.msg : '请求错误，请重试！')
    }
  }

  /** 成功提示 */
  const successTips = (message = '', description = '') => {
    notification.success({
      message,
      duration: 1.5,
      description
    })
  }

  /** 错误提示 */
  const errorTips = (message = '', description = '') => {
    notification.error({
      message,
      description
    })
  }

  /** 处理用户的答案
   *
   * 将选择题由数组变成字符串(若多选，则直接元素拼接)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAnser = (answer: any) => {
    for (let i of Object.keys(answer)) {
      if (answer[i] instanceof Array) {
        answer[i] = answer[i].reduce((pre: string, cur: string) => pre + cur)
      }
    }
    return answer
  }

  /** 清除提示信息 */
  const clearErrorTips = () => {
    setValidError(false)
  }

  /** 渲染完成题组件 */
  const renderCompletionQuestion = () => {
    return completionQuestions.map((i, index) => {
      return (
        <div key={index} className={styles.Item}>
          <span className={styles.QuestionText}>{`${index + 1}.${i.prefix}`}</span>
          <Form.Item className={`GlobalExamItem ${styles.FormInput}`}>
            {getFieldDecorator(`completion${index + 1}`, {
              rules: [{ required: true, message: '请输入答案' }]
            })(<Input placeholder="" onChange={clearErrorTips} autoComplete="off" />)}
          </Form.Item>
          <span className={styles.QuestionText}>{`${i.suffix}`}</span>
        </div>
      )
    })
  }

  /** 渲染选择题的选项框 */
  const renderCheckbox = (options: Option[]) => {
    return options.map((i, index) => {
      return (
        <Checkbox key={index} value={i.key} className={styles.Checkbox}>
          {i.key}.&nbsp;&nbsp;{i.value}
        </Checkbox>
      )
    })
  }

  /** 渲染选择题组件 */
  const renderChoiceQuestion = () => {
    return props.choiceQuestions.map((i: ChoiceQuestion, index) => {
      return (
        <div key={index} className={styles.ChoiceQuestionItem}>
          <p className={styles.ChoiceQuestionTitle}>{`${index + 1}.${i.title}`}</p>
          <Form.Item className={`GlobalExamItem ${styles.ChoiceQuestionFormItem}`}>
            {getFieldDecorator(`choice${index + 1}`, {
              rules: [{ required: true, message: '请至少勾选一项' }]
            })(
              <CheckboxGroup className="GlobalExamCheckboxGroup" onChange={clearErrorTips}>
                {renderCheckbox(i.options)}
              </CheckboxGroup>
            )}
          </Form.Item>
        </div>
      )
    })
  }

  const renderTips = () => {
    return <p className={styles.Tips}>{validError ? '请完成所有的题目' : ''}</p>
  }

  return (
    <div>
      <div className={styles.PageTitle}>
        <img src={titleLeftImg} alt="icon" />
        <span>阅读知识卡片，完成以下问题</span>
        <img src={titleRightImg} alt="icon" />
      </div>
      <p className={styles.QuestionTitle}>填空题（在横线处填写答案）</p>
      <div className={styles.QuestionsWrapper}>{renderCompletionQuestion()}</div>
      <p className={styles.QuestionTitle}>选择题（既有单选也有多选）</p>
      <div className={styles.QuestionsWrapper}>{renderChoiceQuestion()}</div>
      {renderTips()}
      <Button type="primary" className={styles.ConfirmBtn} onClick={confirmAnswer} loading={loading}>
        确认答案
      </Button>
    </div>
  )
}

/** 知识自查
 *
 * 所有的实验项目通用
 */
const Examination = Form.create<ExamFormProps>({ name: 'ExamForm' })(ExamForm)

export default Examination
