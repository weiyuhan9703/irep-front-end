/**
 * 布尔检索实验--温故知新富文本数据
 */
export const booleanKnowledge = [
  {
    title: '简介',
    content: `
      <p style="text-indent: 2em;">
        布尔模型是基于集合论和布尔代数的一种简单检索模型，它的特点是查找那些对于某个查询词返回为&ldquo;真&rdquo;的文档。在该模型中，一个查询词就是一个布尔表达式，包括关键词以及逻辑运算符。由于文档必须严格符合检索词的要求才能够被检索出来，因此布尔检索模型又被称为&ldquo;完全匹配检索&rdquo;(Exact-Match Retrieval)。
      </p>
      <p>布尔模型的检索流程为：</p>
      <p>1. 基于文档语料建立倒排索引；</p>
      <p>2. 根据检索词获取倒排索引中对应的postings，更新结果列表；</p>
      <p>
        3. 根据检索表达式中的逻辑运算符对结果列表和相应postings中的文档ID进行逻辑操作，更新计算结果至结果列表中，循环以上操作至最后一个检索词；
      </p>
      <p>4. 返回检索结果列表，即满足用户检索需求的文档。</p>
      <p>例如对简单的查询：Brutus AND Calpurnia,布尔查询可表示为：</p>
      <p style="text-align: center;">
        <img src="https://t1.picb.cc/uploads/2019/07/26/grGDTM.png" style="max-width: 100%;">
      </p>
      <p style="text-align: center;"><strong>图表 3&nbsp;</strong>Boolean</p>`
  },
  {
    title: '优点',
    content: `
      <p>1. &nbsp;简单，简化了复杂的检索过程</p>
      <p>2. &nbsp;易于理解，结构化的提问方式与用户的思维习惯一致</p>
    `
  },
  {
    title: '缺点',
    content: `
      <p>1. &nbsp;对检索结果平等对待，不能按照用户定义的重要性排序输出</p>
      <p>2. &nbsp;完全匹配可能导致检出的文档过多或过少，难以控制检索结果的输出量</p>
      <p>3. &nbsp;很难满足用户复杂的需求，对用户的检索技能有较高的要求</p>
    `
  }
]
