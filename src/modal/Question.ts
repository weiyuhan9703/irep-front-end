/** 选择题选项枚举 */
export enum Choice {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

/** 选择题选项组件(checkbox)接口 */
export interface Option {
  key: Choice
  value: string
}

/** 选择题数据接口 */
export interface ChoiceQuestion {
  title: string
  answer: Choice
  score: number
  options: Option[]
}

/** 原始完成题数据接口 */
export interface OriginCompletionQuestion {
  title: string
  score: number
  answer: string
}

/** 处理后的完成题数据接口 */
export interface ProcessedCompletionQuestion {
  prefix: string
  suffix: string
  answer: string
  score: number
}

