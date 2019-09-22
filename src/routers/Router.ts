import loadable from '@loadable/component'

const Login = loadable(() => import('../views/login/Login'))
const Register = loadable(() => import('../views/register/Register'))
const Background = loadable(() => import('../views/home/Background'))
const Team = loadable(() => import('../views/home/Team'))
const Architecture = loadable(() => import('../views/home/Architecture'))
const Guide = loadable(() => import('../views/guide/Guide'))
const Experiment = loadable(() => import('../views/experiment/Experiment'))
const Entry = loadable(() => import('../views/experiment/entry/Entry'))
const Pretreatment = loadable(() => import('../views/experiment/pretreatment/Pretreatment'))
const BooleanModal = loadable(() => import('../views/experiment/boolean/BooleanModal'))
const InvertedIndex = loadable(() => import('../views/experiment/invertedIndex/InvertedIndex'))
const ProbabilityModel = loadable(() => import('../views/experiment/probability/ProbabilityModel'))
const VectorSpaceModel = loadable(() => import('../views/experiment/vectorSpace/VectorSpaceModel'))
const LanguageModal = loadable(() => import('../views/experiment/language/LanguageModal'))
const Evaluation = loadable(() => import('../views/experiment/evaluation/Evaluation'))
const Simulation = loadable(() => import('../views/experiment/simulation/Simulation'))
const Description = loadable(() => import('../views/description/Description'))
const Report = loadable(() => import('../views/report/Report'))
const Notice = loadable(() => import('../views/notice/Notice'))
const Discussion = loadable(() => import('../views/discussion/Discussion'))
const Contactus = loadable(() => import('../views/contactus/Contactus'))
const OAuthLogin = loadable(() => import('../views/login/OAuthLogin'))

const routes = [
  {
    path: '/',
    name: '',
    exact: true,
    children: [
      {
        component: Background,
        path: '/introduction/background',
        name: '实验背景'
      },
      {
        component: Team,
        path: '/introduction/team',
        name: '支持团队'
      },
      {
        component: Architecture,
        path: '/introduction/architecture',
        name: '系统架构'
      }
    ]
  },
  {
    component: Guide,
    path: '/guide',
    name: '实验指导'
  },
  {
    component: Experiment,
    path: '/experiment/index',
    name: '我的实验'
  },
  {
    component: Entry,
    path: '/experiment/entry',
    name: '入口实验'
  },
  {
    component: Pretreatment,
    path: '/experiment/pretreatment',
    name: '构建预处理器'
  },
  {
    component: InvertedIndex,
    path: '/experiment/invertedIndex',
    name: '构建倒排索引表'
  },
  {
    component: BooleanModal,
    path: '/experiment/boolean',
    name: '布尔模型实验'
  },
  {
    component: VectorSpaceModel,
    path: '/experiment/vectorSpace',
    name: '向量空间模型实验'
  },
  {
    component: ProbabilityModel,
    path: '/experiment/probability',
    name: '概率模型实验'
  },
  {
    component: LanguageModal,
    path: '/experiment/language',
    name: '语言模型实验'
  },
  {
    component: Evaluation,
    path: '/experiment/evaluation',
    name: '模型评价'
  },
  {
    component: Simulation,
    path: '/experiment/simulation',
    name: '仿真我的搜索引擎'
  },
  {
    component: Description,
    path: '/description',
    name: '考核说明'
  },
  {
    component: Report,
    path: '/report',
    name: '实验报告'
  },
  {
    component: Notice,
    path: '/notice',
    name: '系统通知'
  },
  {
    component: Discussion,
    path: '/discussion',
    name: '交流讨论'
  },
  {
    component: Contactus,
    path: '/contactus',
    name: '联系我们'
  },
  {
    component: Login,
    path: '/login',
    name: '登录'
  },
  {
    component: Register,
    path: '/register',
    name: '注册'
  },
  {
    component: OAuthLogin,
    path: '/oauth',
    name: 'OAuth'
  }
]

export default routes
