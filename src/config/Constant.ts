import { Choice, ChoiceQuestion, OriginCompletionQuestion } from '../modal/Question'
import { Options } from '../modal/VectorSpace'
/**
 * api请求地址
 */
export const API_URL: string = process.env.NODE_ENV === 'development' ? '' : ''

/**
 * 默认请求超时时间
 */
export const REQUEST_TIME_OUT = 30000

/**
 * mock请求延时
 */
export const RESPONSE_DELAY = 1000

/**
 * 默认用户邮箱正则表达式
 */
export const defaultUserEmailRegExp = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

/**
 * 默认用户手机号正则表达式
 */
export const defaultMobileRegExp = /^1[3456789]\d{9}$/

/**
 * 入口实验--原始填空题数据(需要处理下划线)
 */
export const entryCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title:
      '信息检索是从大规模_________________的集合（通常保存在计算机上）中找出满足用户需求的资料（通常是文档）的过程。',
    score: 25,
    answer: '非结构化数据'
  },
  {
    title: '信息检索实验包含_________、建立倒排索引表、构建检索模型、评价检索模型四个步骤。',
    score: 25,
    answer: '文档预处理'
  },
  {
    title:
      '本实验要求通过完成文档预处理、构建倒排索引、构建检索模型三个子实验设计一个__________，并对自己搭建的搜索引擎性能的进行评价。',
    score: 25,
    answer: '搜索引擎'
  },
  {
    title: '检索模型包含空间向量模型、概率模型、__________、语言模型。',
    score: 25,
    answer: '布尔模型'
  }
]

/**
 * 入口实验--原始选择题数据(不需要处理)
 */
export const entryChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '以下哪个选项是信息检索的英文简称？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: 'IS'
      },
      {
        key: Choice.B,
        value: 'IT'
      },
      {
        key: Choice.C,
        value: 'IR'
      },
      {
        key: Choice.D,
        value: 'IE'
      }
    ]
  },
  {
    title: '以下哪个选项不属于文档预处理的步骤？',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '中文分词'
      },
      {
        key: Choice.B,
        value: '建立倒排索引表'
      },
      {
        key: Choice.C,
        value: '去停用词'
      },
      {
        key: Choice.D,
        value: '词干化'
      }
    ]
  },
  {
    title: '“从大规模非结构化数据的集合中找出满足用户需求的资料”这一过程称为？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '信息检索'
      },
      {
        key: Choice.B,
        value: '信息查询'
      },
      {
        key: Choice.C,
        value: '数据检索'
      },
      {
        key: Choice.D,
        value: '数据查询'
      }
    ]
  },
  {
    title: '以下哪个选项不属于信息检索实验的子实验？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '文档预处理'
      },
      {
        key: Choice.B,
        value: '构建倒排索引'
      },
      {
        key: Choice.C,
        value: '构建检索模型'
      },
      {
        key: Choice.D,
        value: '改进检索模型'
      }
    ]
  }
]

/**
 * 构建预处理器--原始填空题数据(需要处理下划线)
 */
export const pretreatmentCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '中文文档预处理流程是：确定索引的文档单位（documentunit）、词条化、去标点、________。',
    score: 25,
    answer: '去停用词'
  },
  {
    title: '__________是中文词条化的解决办法。',
    score: 25,
    answer: '分词'
  },
  {
    title: '常见的分词算法有基于___________匹配的分词方法，基于理解的分词方法和基于统计的分词方法。',
    score: 25,
    answer: '字符串'
  },
  {
    title:
      '通常意义上，停用词可以分为两类：使用十分广泛，甚至是过于频繁的一些单词；第二类是文本中__________很高，但实际意义又不大的词。',
    score: 25,
    answer: '出现频率'
  }
]

/**
 * 构建预处理器--原始选择题数据(不需要处理)
 */
export const pretreatmentChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '以下哪些不是常用的中文分词器？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '标准分词器'
      },
      {
        key: Choice.B,
        value: '空格分词器'
      },
      {
        key: Choice.C,
        value: '简单分词器'
      },
      {
        key: Choice.D,
        value: '二元分词器'
      }
    ]
  },
  {
    title: '以下哪些不是常用的机械分词方法？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '正向最大匹配法'
      },
      {
        key: Choice.B,
        value: '逆向最大匹配法'
      },
      {
        key: Choice.C,
        value: '最少切分法'
      },
      {
        key: Choice.D,
        value: '双向最小匹配法'
      }
    ]
  },
  {
    title: '基于理解的分词方法通常不包括哪些部分？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '分词子系统'
      },
      {
        key: Choice.B,
        value: '句法语义子系统'
      },
      {
        key: Choice.C,
        value: '总控部分'
      },
      {
        key: Choice.D,
        value: '二分法分词器'
      }
    ]
  },
  {
    title: '以下哪个不是常见的停用词？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '我们'
      },
      {
        key: Choice.B,
        value: '在'
      },
      {
        key: Choice.C,
        value: '接着'
      },
      {
        key: Choice.D,
        value: '学校'
      }
    ]
  }
]

/**
 * 构建倒排索引表--原始填空题数据(需要处理下划线)
 */
export const invertedIndexCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '倒排索引也常被称为反向索引、___________或反向档案。',
    score: 25,
    answer: '置入档案'
  },
  {
    title: '__________是文档检索系统中最常用的数据结构。',
    score: 25,
    answer: '倒排索引'
  },
  {
    title: '倒排索引主要由“词项词典（dictionary）”和“______________（postings）”两个部分组成。',
    score: 25,
    answer: '全体倒排记录表'
  },
  {
    title: '通过倒排索引，可以根据单词快速获取包含这个单词的___________。',
    score: 25,
    answer: '文档列表'
  }
]

/**
 * 构建倒排索引表--原始选择题数据(不需要处理)
 */
export const invertedIndexChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '倒排索引存储在全文搜索下某个单词在一个文档或者一组文档中的_________的映射。',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '存储时间'
      },
      {
        key: Choice.B,
        value: '存储位置'
      },
      {
        key: Choice.C,
        value: '存储顺序'
      },
      {
        key: Choice.D,
        value: '存储记录'
      }
    ]
  },
  {
    title: '以下哪个选项不是倒排索引的常用简称？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '反向索引'
      },
      {
        key: Choice.B,
        value: '反向档案'
      },
      {
        key: Choice.C,
        value: '置入索引'
      },
      {
        key: Choice.D,
        value: '置入档案'
      }
    ]
  },
  {
    title: '倒排索引用来存储在全文搜索下某个____在一个文档或者一组文档中的存储位置的映射。',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '单词'
      },
      {
        key: Choice.B,
        value: '词组'
      },
      {
        key: Choice.C,
        value: '短语'
      },
      {
        key: Choice.D,
        value: '术语'
      }
    ]
  },
  {
    title: '以下哪个选项属于倒排索引的组成部分？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '停用词词典'
      },
      {
        key: Choice.B,
        value: '同义词词典'
      },
      {
        key: Choice.C,
        value: '词项词典'
      },
      {
        key: Choice.D,
        value: '反义词词典'
      }
    ]
  }
]

/**
 * 构建布尔模型--原始填空题数据(需要处理下划线)
 */
export const booleanCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '_________是基于集合论和布尔代数的一种简单检索模型。',
    score: 25,
    answer: '布尔模型'
  },
  {
    title: '布尔模型的特点是查找那些对于某个查询词返回为“_____”的文档。',
    score: 25,
    answer: '真'
  },
  {
    title: '由于文档必须严格符合检索词的要求才能够被检索出来，因此布尔检索模型又被称为_____。',
    score: 25,
    answer: '完全匹配检索'
  },
  {
    title: '在布尔模型中，一个查询词就是一个布尔表达式，包括关键词和_____________。',
    score: 25,
    answer: '逻辑运算符'
  }
]

/**
 * 构建布尔模型--原始选择题数据(不需要处理)
 */
export const booleanChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '“根据检索词获取倒排索引中对应的postings，更新结果列表”这一步骤属于布尔检索流程中的第几步？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '第一步'
      },
      {
        key: Choice.B,
        value: '第二步'
      },
      {
        key: Choice.C,
        value: '第三步'
      },
      {
        key: Choice.D,
        value: '第四步'
      }
    ]
  },
  {
    title: '以下哪一项属于布尔模型的优势？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '准确度高'
      },
      {
        key: Choice.B,
        value: '检索速度快'
      },
      {
        key: Choice.C,
        value: '易于理解'
      },
      {
        key: Choice.D,
        value: '满足用户复杂需求'
      }
    ]
  },
  {
    title: '以下哪一项不属于布尔模型的劣势？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '不能按照用户定义的重要性排序输出'
      },
      {
        key: Choice.B,
        value: '难以控制检索结果的输出量'
      },
      {
        key: Choice.C,
        value: '检索过程复杂、难以理解'
      },
      {
        key: Choice.D,
        value: '很难满足用户复杂的需求，对用户的检索技能有较高的要求'
      }
    ]
  },
  {
    title: '以下哪种模型是基于集合论和布尔代数的一种简单检索模型？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '布尔模型'
      },
      {
        key: Choice.B,
        value: '向量空间模型'
      },
      {
        key: Choice.C,
        value: '概率检索模型'
      },
      {
        key: Choice.D,
        value: '语言模型'
      }
    ]
  }
]

/**
 * 构建向量空间模型--原始填空题数据(需要处理下划线)
 */
export const vectorSpaceCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '一系列文档在同一向量空间中的表示被称为____________。',
    score: 25,
    answer: '向量空间模型'
  },
  {
    title: '空间向量模型把对文本内容的处理简化为向量空间中的向量运算，并且它以____________表达语义的相似度。',
    score: 25,
    answer: '空间上的相似度'
  },
  {
    title: '在按照词典中的顺序建立各个文档的词项向量时，向量中每一个词的权值一般采用__________框架计算。',
    score: 25,
    answer: 'TF-IDF'
  },
  {
    title: '利用倒排索引表中的____________求出各个词项逆文档频率逆文档频率因子。',
    score: 25,
    answer: '文档频率参数'
  }
]

/**
 * 构建向量空间模型--原始选择题数据(不需要处理)
 */
export const vectorSpaceChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '以下哪个选项表示词项t在文档d中出现的次数？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '文档频率'
      },
      {
        key: Choice.B,
        value: '词项频率'
      },
      {
        key: Choice.C,
        value: '逆文档频率'
      },
      {
        key: Choice.D,
        value: '文档集频率'
      }
    ]
  },
  {
    title: '以下哪个选项不属于向量空间模型的优点？',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '基于线性代数的简单模型'
      },
      {
        key: Choice.B,
        value: '提问方式结构化'
      },
      {
        key: Choice.C,
        value: '词组的权重不是二元的'
      },
      {
        key: Choice.D,
        value: '允许计算文档和索引之间的连续'
      }
    ]
  },
  {
    title: '以下哪个选项不属于向量空间模型的缺点？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '适用于较长的文件'
      },
      {
        key: Choice.B,
        value: '检索词组必须与文件中出现的词组精确匹配'
      },
      {
        key: Choice.C,
        value: '语义敏感度不佳'
      },
      {
        key: Choice.D,
        value: '易导致“假阴性匹配”'
      }
    ]
  },
  {
    title: '以下哪个方法常被用来度量向量空间模型中文档的相似性？',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '余弦距离'
      },
      {
        key: Choice.B,
        value: '正弦距离'
      },
      {
        key: Choice.C,
        value: '杰卡德相似性度量'
      },
      {
        key: Choice.D,
        value: '欧氏距离'
      }
    ]
  }
]

/**
 * 构建概率检索模型--原始填空题数据(需要处理下划线)
 */
export const probabilityCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '概率检索模型是当前信息检索领域效果最好的模型之一，它基于对已有反馈结果的分析，根据____为当前查询排序。',
    score: 25,
    answer: '贝叶斯原理'
  },
  {
    title: '概率检索模型的流程为求索引项、求系数Bij、_____________、按相似度降序排序。',
    score: 25,
    answer: '计算相似度'
  },
  {
    title: '概率检索模型的优点是_________',
    score: 25,
    answer: '文档可以按照他们相关概率递减的顺序来计算秩'
  },
  {
    title: '概率检索模型基于__________原则，对所有文本计算概率，并从大到小进行排序。',
    score: 25,
    answer: '概率排序'
  }
]

/**
 * 构建概率检索模型--原始选择题数据(不需要处理)
 */
export const probabilityChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '下列哪个模型的基本原理与朴素贝叶斯分类是一样的？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '布尔模型'
      },
      {
        key: Choice.B,
        value: '向量空间模型'
      },
      {
        key: Choice.C,
        value: '概率检索模型'
      },
      {
        key: Choice.D,
        value: '语言模型'
      }
    ]
  },
  {
    title: '概率检索模型是为了解决信息检索中文本信息的相关判断的不确定性和查询信息表示的____________。',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '准确性'
      },
      {
        key: Choice.B,
        value: '模糊性'
      },
      {
        key: Choice.C,
        value: '时效性'
      },
      {
        key: Choice.D,
        value: '连续性'
      }
    ]
  },
  {
    title:
      '将相关性衡量转换为分类问题，对某个文档D来说，若其属于相关文档子集的概率___不相关文档的概率，就认为它与查询相关。',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '大于'
      },
      {
        key: Choice.B,
        value: '小于'
      },
      {
        key: Choice.C,
        value: '等于'
      },
      {
        key: Choice.D,
        value: '不等于'
      }
    ]
  },
  {
    title: '下列哪个选项属于概率检索模型的缺点',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '没有考虑索引术语在文档中的频率'
      },
      {
        key: Choice.B,
        value: '难以控制检索结果的输出量'
      },
      {
        key: Choice.C,
        value: '忽略词组间的相关性'
      },
      {
        key: Choice.D,
        value: '很难满足用户复杂的需求'
      }
    ]
  }
]

/**
 * 构建语言模型--原始填空题数据(需要处理下划线)
 */
export const languageCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title:
      '语言模型是采用_________方法描述自然语言内在规律的一种数学模型，在许多涉及自然语言处理的领域中有着广泛的应用。',
    score: 25,
    answer: '概率统计'
  },
  {
    title:
      '语言模型的思想是假设每个文档都存在一个语言模型，从文档的语言模型抽样产生______________表示文档与查询的相似度。',
    score: 25,
    answer: '检索的概率'
  },
  {
    title: '语言模型是根据________而进行的语言抽象数学建模，是一种对应关系。',
    score: 25,
    answer: '语言客观事实'
  },
  {
    title: '语言模型是一个单纯的、统一的、________形式系统。',
    score: 25,
    answer: '抽象的'
  }
]

/**
 * 构建语言模型--原始选择题数据(不需要处理)
 */
export const languageChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '下列哪个选项不属于语言模型的类型？',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '生成性模型'
      },
      {
        key: Choice.B,
        value: '抽象性模型'
      },
      {
        key: Choice.C,
        value: '分析性模型'
      },
      {
        key: Choice.D,
        value: '辨识性模型'
      }
    ]
  },
  {
    title: '下列哪个选项属于调整出现概率的平滑方法？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: 'Combined with corpus'
      },
      {
        key: Choice.B,
        value: 'Dirichlet'
      },
      {
        key: Choice.C,
        value: 'Two-stage'
      },
      {
        key: Choice.D,
        value: 'Good-Turing smoothing'
      }
    ]
  },
  {
    title: '语言模型的缺点是完全匹配可能导致检出的文档过多或过少，难以控制检索结果的___________。',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '输入量'
      },
      {
        key: Choice.B,
        value: '输出量'
      },
      {
        key: Choice.C,
        value: '精确度'
      },
      {
        key: Choice.D,
        value: '时效性'
      }
    ]
  },
  {
    title:
      '下列那种检索模型是由文档到查询，判断由文档生成用户查询的可能性有多大，然后按照这种生成概率由高到低排序作为搜索结果？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '布尔模型'
      },
      {
        key: Choice.B,
        value: '概率检索模型'
      },
      {
        key: Choice.C,
        value: '语言模型'
      },
      {
        key: Choice.D,
        value: '向量空间模型'
      }
    ]
  }
]

/**
 * 分析检索模型性能--原始填空题数据(需要处理下划线)
 */
export const evaluationCompletionQuestions: OriginCompletionQuestion[] = [
  {
    title: '信息检索模型给出了文档的表示方法，查询的表示方式以及查询与文档的___________。',
    score: 25,
    answer: '匹配过程'
  },
  {
    title: '信息检索模型本质上是对___________建模。',
    score: 25,
    answer: '相关度'
  },
  {
    title: '一个信息检索模型是由文档表示、查询、关系、__________组成的四元组。',
    score: 25,
    answer: '模型框架'
  },
  {
    title: '信息检索模型所使用的数学方法可以分为集合论、代数论、__________。',
    score: 25,
    answer: '概率统计'
  }
]

/**
 * 分析检索模型性能--原始选择题数据(不需要处理)
 */
export const evaluationChoiceQuestions: ChoiceQuestion[] = [
  {
    title: '下列哪个选项不属于布尔逻辑运算符？',
    answer: Choice.C,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: 'and'
      },
      {
        key: Choice.B,
        value: 'or'
      },
      {
        key: Choice.C,
        value: 'with'
      },
      {
        key: Choice.D,
        value: 'not'
      }
    ]
  },
  {
    title: '文本预处理中，词法分析的过程是将字符串转换成___________的过程。',
    answer: Choice.B,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '字符'
      },
      {
        key: Choice.B,
        value: '词条'
      },
      {
        key: Choice.C,
        value: '字符串'
      },
      {
        key: Choice.D,
        value: '词项'
      }
    ]
  },
  {
    title: '索引数据库建立的策略在很大程度上影响搜索引擎的效率与___________。',
    answer: Choice.A,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '准确性'
      },
      {
        key: Choice.B,
        value: '时效性'
      },
      {
        key: Choice.C,
        value: '真实性'
      },
      {
        key: Choice.D,
        value: '实用性'
      }
    ]
  },
  {
    title: '下列哪个选项不属于标引工作的方式？',
    answer: Choice.D,
    score: 25,
    options: [
      {
        key: Choice.A,
        value: '人工标引'
      },
      {
        key: Choice.B,
        value: '计算机辅助标引'
      },
      {
        key: Choice.C,
        value: '自动标引'
      },
      {
        key: Choice.D,
        value: '半自动标引'
      }
    ]
  }
]

/**
 * 向量空间模型--标准查询语句
 */
export const vectorSpaceQueryOptions: Options[] = [
  {
    label: 'qq群共享文件下载失败',
    value: 'qq群共享文件下载失败'
  },
  {
    label: '名捕震关东',
    value: '名捕震关东'
  },
  {
    label: '广东会计信息服务平台',
    value: '广东会计信息服务平台'
  },
  {
    label: '广场舞一生兄弟一生情',
    value: '广场舞一生兄弟一生情'
  },
  {
    label: '我的世界合成表',
    value: '我的世界合成表'
  },
  {
    label: '澳门签证多久签一次',
    value: '澳门签证多久签一次'
  },
  {
    label: '生死狙击好号和密码有金币',
    value: '生死狙击好号和密码有金币'
  },
  {
    label: '笔记本怎么开热点',
    value: '笔记本怎么开热点'
  },
  {
    label: '购买火车票12306',
    value: '购买火车票12306'
  },
  {
    label: '风尘劫txt下载',
    value: '风尘劫txt下载'
  }
]

/**
 * 图表颜色配置
 */
export const defaultChartColors: string[] = [
  '#00aaff',
  '#2ecc71',
  '#badc58',
  '#f03e3e',
  '#34495e',
  '#f1c40f',
  '#e67e22',
  '#95a5a6',
  '#686de0',
  '#26C0C0',
  '#74c0fc',
  '#087f5b'
]
