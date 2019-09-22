import { Store, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { create } from 'redux-react-hook'
import { Actions } from './Actions'
import reducer from './Reducer'

/** 实验流程卡片数组接口 */
export interface ExperimentCard {
  name: string
  current: boolean
  disabled: boolean
  correctIndex: number
  index: number
}

/** 单个排序卡片实验，保存按钮的状态 */
interface SaveOrderBtnStatus {
  completed: boolean
  saved: boolean
}

/** 全部排序卡片实验中，保存按钮的状态 */
export interface SaveOrderBtn {
  bool: SaveOrderBtnStatus
  invertedIndex: SaveOrderBtnStatus
  vectorSpace: SaveOrderBtnStatus
  language: SaveOrderBtnStatus
  probability: SaveOrderBtnStatus
}

/** 全局state接口 */
export interface State {
  pageLoading: boolean
  entryExperimentCards: ExperimentCard[]
  steps: { name: string }[]
  invertedIndexCards: ExperimentCard[]
  invertedSteps: { name: string }[]
  loadindexLoading: boolean
  loadindexSuccess: boolean
  booleanExperimentSteps: { name: string }[]
  booleanExperimentCards: ExperimentCard[]
  vectorSpaceCards: ExperimentCard[]
  vectorSteps: { name: string }[]
  probabilityExperimentCards: ExperimentCard[]
  probabilityExperimentSteps: { name: string }[]
  languageExperimentCards: ExperimentCard[]
  languageExperimentSteps: { name: string }[]
  saveOrderBtn: SaveOrderBtn
}

/** 创建全局store */
export const makeStore = (): Store<State, Actions> => {
  return createStore(reducer, INITIAL_STATE, composeWithDevTools())
}

const entryExperimentCards: ExperimentCard[] = [
  {
    name: '构建我的索引器',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '构建布尔模型',
    current: false,
    disabled: false,
    correctIndex: 5,
    index: -1
  },
  {
    name: '构建向量空间模型',
    current: false,
    disabled: false,
    correctIndex: 6,
    index: -1
  },
  {
    name: '构建预处理器',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '构建倒排索引表',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '构建我的检索器',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  },
  {
    name: '构建概率检索模型',
    current: false,
    disabled: false,
    correctIndex: 7,
    index: -1
  },
  {
    name: '构建语言模型',
    current: false,
    disabled: false,
    correctIndex: 8,
    index: -1
  },
  {
    name: '分析检索模型性能',
    current: false,
    disabled: false,
    correctIndex: 9,
    index: -1
  },
  {
    name: '仿真我的搜索引擎',
    current: false,
    disabled: false,
    correctIndex: 10,
    index: -1
  }
]

const steps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

const invertedIndexCards: ExperimentCard[] = [
  {
    name: '词典',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '全体倒排记录表',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '倒排记录表',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '词项',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  },
  {
    name: '文档频率',
    current: false,
    disabled: false,
    correctIndex: 5,
    index: -1
  },
  {
    name: '文档ID',
    current: false,
    disabled: false,
    correctIndex: 6,
    index: -1
  },
  {
    name: '词项频率',
    current: false,
    disabled: false,
    correctIndex: 7,
    index: -1
  },
  {
    name: '位置索引',
    current: false,
    disabled: false,
    correctIndex: 8,
    index: -1
  }
]

const invertedSteps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

const booleanExperimentCards: ExperimentCard[] = [
  {
    name: '查询预处理',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '计算布尔向量',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '进行布尔运算',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '召回目标文档',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  }
]

const booleanExperimentSteps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

/** 向量空间默认卡片
 *
 * 包含正确的顺序
 */
const vectorSpaceCards: ExperimentCard[] = [
  {
    name: '求查询向量',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  },
  {
    name: '求查询的TF',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '查询预处理',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '求文档IDF',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '求各文档TF',
    current: false,
    disabled: false,
    correctIndex: 5,
    index: -1
  },
  {
    name: '求文档向量',
    current: false,
    disabled: false,
    correctIndex: 6,
    index: -1
  },
  {
    name: '求相似度',
    current: false,
    disabled: false,
    correctIndex: 7,
    index: -1
  },
  {
    name: '求相似度降序排序',
    current: false,
    disabled: false,
    correctIndex: 8,
    index: -1
  }
]

/** 向量空间顺序
 *
 * 用户自己排的顺序
 */
const vectorSteps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

/** 概率模型默认卡片
 *
 * 包含正确的顺序
 */
const probabilityExperimentCards: ExperimentCard[] = [
  {
    name: '求索引项',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '求系数Bij',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '计算相似度',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '按相似度降序排序',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  }
]

const probabilityExperimentSteps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

/** 语言模型默认卡片
 *
 * 包含正确的顺序
 */
const languageExperimentCards: ExperimentCard[] = [
  {
    name: '查询预处理',
    current: false,
    disabled: false,
    correctIndex: 1,
    index: -1
  },
  {
    name: '计算LM',
    current: false,
    disabled: false,
    correctIndex: 2,
    index: -1
  },
  {
    name: '计算生成概率',
    current: false,
    disabled: false,
    correctIndex: 3,
    index: -1
  },
  {
    name: '按生成概率降序排序',
    current: false,
    disabled: false,
    correctIndex: 4,
    index: -1
  }
]

const languageExperimentSteps = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  }
]

/** 几个默认卡片顺序保存按钮的状态 */
const saveOrderBtn: SaveOrderBtn = {
  bool: {
    completed: false,
    saved: false
  },
  invertedIndex: {
    completed: false,
    saved: false
  },
  vectorSpace: {
    completed: false,
    saved: false
  },
  language: {
    completed: false,
    saved: false
  },
  probability: {
    completed: false,
    saved: false
  }
}

/** 全局初始状态 */
export const INITIAL_STATE: State = {
  pageLoading: false,
  entryExperimentCards,
  steps,
  invertedIndexCards,
  invertedSteps,
  loadindexLoading: true, // 加载索引请求状态
  loadindexSuccess: false, // 加载索引成功状态
  booleanExperimentCards,
  booleanExperimentSteps,
  vectorSpaceCards,
  vectorSteps,
  probabilityExperimentCards,
  probabilityExperimentSteps,
  languageExperimentCards,
  languageExperimentSteps,
  saveOrderBtn
}

export const { StoreContext, useDispatch, useMappedState } = create<State, Actions, Store<State, Actions>>()
