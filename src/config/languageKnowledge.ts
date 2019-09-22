/**
 * 语言模型实验--温故知新富文本数据
 */
export const languageKnowledge = [
  {
    title: '简介',
    content: `
      <p style="text-indent: 2em;">
      语言模型是采用概率统计方法描述自然语言内在规律的一种数学模型，在许多涉及自然语言处理的领域中有着广泛的应用。区别于其他大多数检索模型从查询到文档（即给定用户查询，如何找出相关的文档），语言模型由文档到查询，即为每个文档建立不同的语言模型，判断由文档生成用户查询的可能性有多大，然后按照这种生成概率由高到低排序，作为检索结果。
      </p>
      <p style="text-indent: 2em;">
      基本思想：假设每个文档都存在一个语言模型，从文档的语言模型抽样产生检索的概率表示文档与查询的相似度。与传统的检索模型不同的是，语言模型是由文档到查询，即为每个文档建立不同的语言模型，判断由文档生成用户查询的可能性有多大，然后按照这种生成概率由高到低排序，作为搜索结果。
      </p>
      <p style="text-indent: 2em;">
      基本概念：为每个文档建立一个语言模型，语言模型代表了单词（或单词序列）在文档中的分布情况。针对查询中的单词，每个单词都有一个抽取概率，将这些单词的抽取概率相乘就是文档生成查询的概率。
      </p>
    `
  },
  {
    title: '实现步骤',
    content: `
      <p style="text-indent: 2em;">
        对文档集中的每篇文档
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> d </mi>
        </math>
        构建其对应的语言模型。目标是将文档按照其与查询相关的似然
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> P </mi>
          <mfenced>
            <mrow>
              <mi> d </mi>
              <mo> | </mo>
              <mi> q </mi>
            </mrow>
          </mfenced>
        </math>
        排序。最普遍的计算
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> P </mi>
          <mfenced>
            <mrow>
              <mi> d </mi>
              <mo> | </mo>
              <mi> q </mi>
            </mrow>
          </mfenced>
        </math>
        的方法是使用多项式一元语言模型，该模型等价于多项式朴素贝叶斯模型，其中这里的文档相当于后者中的类别，每篇文档在估计中都是一门独立的&ldquo;语言&rdquo;。在基于语言模型（简记为
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> L </mi>
          <mi> M </mi>
        </math>
        ）的检索中，可以将查询的生成看成一个随机过程。具体的方法是：
      </p>
      <p>(1) 对每篇文档推导出其
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> L </mi>
          <mi> M </mi>
        </math>
      ；</p>
      <p>(2) 估计查询在每个文档
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> d </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
            </mrow>
          </msub>
        </math>
      的
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> L </mi>
          <mi> M </mi>
        </math>
      下的生成概率
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> P </mi>
          <mfenced>
            <mrow>
              <mi> d </mi>
              <mo> | </mo>
              <mi> M </mi>
              <mi> q </mi>
            </mrow>
          </mfenced>
        </math>
      </p>
      <p>(3) 按照上述概率对文档进行排序。</p>
    `
  },
  {
    title: '优点',
    content: `
      <p>1、有良好的理论框架</p>
      <p>2、有大量的可用数据</p>
      <p>3、概率估计的参数平滑技术</p>
      <p>4、能够通过平滑解释一些经验和启发式方法</p>
    `
  },
  {
    title: '缺点',
    content: `
      <p style="text-indent: 2em;">
        相关度排序函数定义虽然比较直观，但相关性是一个抽象的概念，该定义本身没有也无法具体给出R的定义，所以该模型在理论上存在很大的模糊性。
      </p>
    `
  }
]
