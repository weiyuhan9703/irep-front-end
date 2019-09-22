/**
 * 空间向量模型实验--温故知新富文本数据
 */
export const vectorSpaceKnowledge = [
  {
    title: '简介',
    content: `
      <p><strong>向量空间模型（vector space model 简称：VSM）：</strong>一系列文档在同一向量空间中的表示被称为向量空间模型。其把对文本内容的处理简化为向量空间中的向量运算，并且它以空间上的相似度表达语义的相似度。</p>
      <p><strong>文档频率（document</strong><strong>&nbsp;</strong><strong>frequency）</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
        </math>
        ：出现词项的t文档数目，也就是每个倒排记录表的长度。</p>
      <p><strong>term</strong><strong>&nbsp;</strong><strong>frequency）</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> t </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
              <mo> , </mo>
              <mi> d </mi>
            </mrow>
          </msub>
        </math>
        ：出现词项的t文档数目，也就是每个倒排记录表的长度。
      </p>
      <p><strong>逆文档频率（inverse</strong><strong>&nbsp;</strong><strong>document</strong><strong>&nbsp;</strong><strong>frequency）</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> i </mi>
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
        </math>
      ：因为
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mi> d </mi>
        <msub>
          <mrow>
            <mi> f </mi>
          </mrow>
          <mrow>
            <mi> t </mi>
          </mrow>
        </msub>
      </math>
      本身较大，需要将其映射到一个较小的范围。设文档集中所有文档数为N，词项idf为：
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> i </mi>
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
          <mo> = </mo>
          <msub>
            <mrow>
              <mi> log </mi>
            </mrow>
            <mrow>
              <mn> 2 </mn>
            </mrow>
          </msub>
          <mfrac>
            <mrow>
              <mi> N </mi>
            </mrow>
            <mrow>
              <mi> d </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                </mrow>
              </msub>
            </mrow>
          </mfrac>
        </math>
      </p>
    `
  },
  {
    title: '实现步骤',
    content: `
      <p>1.计算
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> i </mi>
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
        </math>
      ：利用倒排索引表中的文档频率
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mi> d </mi>
        <msub>
          <mrow>
            <mi> f </mi>
          </mrow>
          <mrow>
            <mi> t </mi>
          </mrow>
        </msub>
      </math>
      参数求出各个词项逆文档频率</p>
      <p>逆文档频率因子（
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> i </mi>
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
        </math>
      ）&ndash;全局（文档集合）</p>
      <p>计算公式：
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> i </mi>
          <mi> d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
          <mo> = </mo>
          <msub>
            <mrow>
              <mi> log </mi>
            </mrow>
            <mrow>
              <mn> 2 </mn>
            </mrow>
          </msub>
          <mfrac>
            <mrow>
              <mi> N </mi>
            </mrow>
            <mrow>
              <mi> d </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                </mrow>
              </msub>
            </mrow>
          </mfrac>
        </math>
      </p>
      <p>N代表文档集合中的文档总数</p>
      <p>2.计算词频因子:将查询语句也看作一个文档，分别计算查询语句与文档集中各词的词频因子。</p>
      <p>词频因子（
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> t </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
              <mo> , </mo>
              <mi> d </mi>
            </mrow>
          </msub>
        </math>
      )&ndash;局部（一个文档）：最简单的就是直接利用词频数
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> t </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
              <mo> , </mo>
              <mi> d </mi>
            </mrow>
          </msub>
        </math>
      作为词频因子值。</p>
      <p>平滑公式：
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> t </mi>
          <msub>
            <mrow>
              <mi> f </mi>
              <mo>'</mo>
            </mrow>
            <mrow>
              <mi> t </mi>
              <mo> , </mo>
              <mi> d </mi>
            </mrow>
          </msub>
          <mo> = </mo>
          <mn> 1 </mn>
          <mo> + </mo>
          <mi> log </mi>
          <mfenced>
            <mrow>
              <mi> t </mi>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> t </mi>
                  <mo> , </mo>
                  <mi> d </mi>
                </mrow>
              </msub>
            </mrow>
          </mfenced>
        </math>
      </p>
      <p>
        3.计算向量：按照词典中的顺序建立各个文档的词项向量，向量中每一个词的权值一般采用TF-IDF框架计算。（查询语句也看作一个文档进行计算）
      </p>
      <p>TF*IDF框架：
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> W </mi>
          <mi> e </mi>
          <mi> i </mi>
          <mi> g </mi>
          <mi> h </mi>
          <msub>
            <mrow>
              <mi>t</mi>
            </mrow>
            <mrow>
              <mi>t</mi>
            </mrow>
          </msub>
          <mo>=</mo>
          <mi> t </mi>
          <msub>
            <mrow>
              <mi> f </mi>
              <mo>'</mo>
            </mrow>
            <mrow>
              <mi> t </mi>
              <mo> , </mo>
              <mi> d </mi>
            </mrow>
          </msub>
          <mo>&#x00D7;<!-- multiplication sign --> </mo>
          <mi> i </mi>
          <mi>d </mi>
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> t </mi>
            </mrow>
          </msub>
        </math>
       </p>
      <p>4.相似度计算：查询与某文档的相似度为查询向量和文档向量余弦值。（或查询向量的单位向量与文档向量的单位向量的点积）</p>
      <p style="text-align: center">
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> C </mi>
          <mi> o </mi>
          <mi> s </mi>
          <mi> i </mi>
          <mi> n </mi>
          <mi> e </mi>
          <mfenced>
            <mrow>
              <mi> Q </mi>
              <mo> , </mo>
              <msub>
                <mrow>
                  <mi> D </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
            </mrow>
          </mfenced>
          <mo> = </mo>
          <mfrac>
            <mrow>
              <munderover>
                <mrow>
                  <mo>
                    &#x2211;
                    <!-- n-ary summation -->
                  </mo>
                </mrow>
                <mrow>
                  <mi> j </mi>
                  <mo> = </mo>
                  <mn> 1 </mn>
                </mrow>
                <mrow>
                  <mn> t </mn>
                </mrow>
              </munderover>
              <msub>
                <mrow>
                  <mi> W </mi>
                </mrow>
                <mrow>
                  <mi> i </mi>
                  <mi> j </mi>
                </mrow>
              </msub>
              <mo>
                &#x00D7;
                <!-- multiplication sign -->
              </mo>
              <msub>
                <mrow>
                  <mi> q </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
            </mrow>
            <mrow>
              <msqrt>
                <munderover>
                  <mrow>
                    <mo>
                      &#x2211;
                      <!-- n-ary summation -->
                    </mo>
                  </mrow>
                  <mrow>
                    <mi> j </mi>
                    <mo> = </mo>
                    <mn> 1 </mn>
                  </mrow>
                  <mrow>
                    <mn> t </mn>
                  </mrow>
                </munderover>
                <msubsup>
                  <mrow>
                    <mi> w </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                    <mi> j </mi>
                  </mrow>
                  <mrow>
                    <mn> 2 </mn>
                  </mrow>
                </msubsup>
                <mo>
                  &#x00D7;
                  <!-- multiplication sign -->
                </mo>
                <munderover>
                  <mrow>
                    <mo>
                      &#x2211;
                      <!-- n-ary summation -->
                    </mo>
                  </mrow>
                  <mrow>
                    <mi> j </mi>
                    <mo> = </mo>
                    <mn> 1 </mn>
                  </mrow>
                  <mrow>
                    <mn> t </mn>
                  </mrow>
                </munderover>
                <msubsup>
                  <mrow>
                    <mi> q </mi>
                  </mrow>
                  <mrow>
                    <mi> j </mi>
                  </mrow>
                  <mrow>
                    <mn> 2 </mn>
                  </mrow>
                </msubsup>
              </msqrt>
            </mrow>
          </mfrac>
        </math>
      </p>
      <p style="text-align: center;"><strong>图表 4</strong> cosine similarity</p>
      <p style="text-align: left;">5.按照文档和查询的相似性得分从高到低排序作为搜索结果。</p>
    `
  },
  {
    title: '优点',
    content: `<p>基于线性代数的简单模型；词组的权重不是二元的；允许计算文档和索引之间的连续。</p>`
  },
  {
    title: '缺点',
    content: `
      <p>
        不适用于较长的文件；检索词组必须与文件中出现的词组精确匹配；语义敏感度不佳；易导致&ldquo;假阴性匹配&rdquo;；忽略词组间的相关性。
      </p>
    `
  }
]
