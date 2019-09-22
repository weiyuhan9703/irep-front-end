/**
 * 概率检索模型实验--温故知新富文本数据
 */
export const probabilityKnowledge = [
  {
    title: '简介',
    content: `
      <p style="text-indent: 2em;">
        概率检索模型是当前信息检索领域效果最好的模型之一，它基于对已有反馈结果的分析，根据贝叶斯原理为当前查询排序。概率检索模型的基本原理与朴素贝叶斯分类是一样的。
      </p>
    `
  },
  {
    title: '基本思想',
    content: `
      <p style="text-indent: 2em;">
        给定一个用户查询，若搜索系统能在搜索结果排序时按照文档和用户查询的相关性由高到低排序，那么这个搜索系统的准确性是最优的。
      </p>
    `
  },
  {
    title: '朴素贝叶斯算法的原理',
    content: `
      <p style="text-indent: 2em;">
        对于测试元组X，最终目的是要计算对于不同的类
        <math>
          <msub>
            <mi>C</mi>
            <mn>i</mn>
          </msub>
        </math>
        ，计算后验概率
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
              <mo> | </mo>
              <mi> X </mi>
            </mrow>
          </mfenced>
        </math>
        ，哪个类最大，就属于哪个类。而为了计算
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
              <mo> | </mo>
              <mi> X </mi>
            </mrow>
          </mfenced>
        </math>
        ，则需要用贝叶斯公式做如下分解：
      </p>
      <p style="text-align: center;">
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
              <mo> | </mo>
              <mi> X </mi>
            </mrow>
          </mfenced>
          <mo> = </mo>
          <mfrac>
            <mrow>
              <mi>p</mi>
              <mfenced>
                <mrow>
                  <mi> X </mi>
                  <mo> | </mo>
                  <mi>
                    <msub>
                      <mrow>
                        <mi> C </mi>
                      </mrow>
                      <mrow>
                        <mi> i </mi>
                      </mrow>
                    </msub>
                  </mi>
                </mrow>
              </mfenced>
              <mi> p </mi>
              <mfenced>
                <mrow>
                  <mi>
                    <msub>
                      <mrow>
                        <mi> C </mi>
                      </mrow>
                      <mrow>
                        <mi> i </mi>
                      </mrow>
                    </msub>
                  </mi>
                </mrow>
              </mfenced>
            </mrow>
            <mrow>
              <mi> p </mi>
              <mfenced>
                <mrow>
                  <mi> X </mi>
                </mrow>
              </mfenced>
            </mrow>
          </mfrac>
        </math>
      </p>
      <p style="text-align: center;"><strong>图表 5</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
              <mo> | </mo>
              <mi> X </mi>
            </mrow>
          </mfenced>
        </math>
      </p>
      <p style="text-indent: 2em;">
        因为要比较大小，所以忽略
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> p </mi>
          <mfenced>
            <mrow>
              <mi> X </mi>
            </mrow>
          </mfenced>
        </math>
        ，只需要考虑分子中
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi> X </mi>
              <mo> | </mo>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
          <mi> p </mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
        </math>
        ，其中
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
        </math>
        可以通过抽样得到，那么问题转化为计算
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi> X </mi>
              <mo> | </mo>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
        </math>
        ，
        代表X在类
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mi>C</mi>
            <mn>i</mn>
          </msub>
        </math>
        中的概率。如果X由n个相互之间无关的属性组成，那么这个概率一般如下计算：
      </p>
      <p style="text-align: center;">
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi> X </mi>
              <mo> | </mo>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
          <mo> = </mo>
          <munderover>
            <mrow>
              <mo>
                &#x220F;
                <!-- n-ary product -->
              </mo>
            </mrow>
            <mrow>
              <mi> j </mi>
              <mo> = </mo>
              <mn> 1 </mn>
            </mrow>
            <mrow>
              <mi> n </mi>
            </mrow>
          </munderover>
          <mi> p </mi>
          <mfenced>
            <mrow>
              <msub>
                <mrow>
                  <mi> X </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
              <mo> | </mo>
              <msub>
                <mrow>
                  <mi> C</mi>
                </mrow>
                <mrow>
                  <mi> i </mi>
                </mrow>
              </msub>
            </mrow>
          </mfenced>
        </math>
      </p>
      <p style="text-align: center;"><strong>图表 6</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi>p</mi>
          <mfenced>
            <mrow>
              <mi> X </mi>
              <mo> | </mo>
              <mi>
                <msub>
                  <mrow>
                    <mi> C </mi>
                  </mrow>
                  <mrow>
                    <mi> i </mi>
                  </mrow>
                </msub>
              </mi>
            </mrow>
          </mfenced>
        </math>
      </p>
    `
  },
  {
    title: 'BM25模型',
    content: `
      <p style="text-indent: 2em;">BM25模型为文档
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mrow>
          <msub>
            <mrow>
              <mi> D </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
            </mrow>
          </msub>
        </mrow>
      </math>
      每个索引项tj分配了一个系数
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
      ，由如下公式计算生成：</p>
      <p style="text-align: center;">
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
          <mo> = </mo>
          <mfrac>
            <mrow>
              <mfenced>
                <mrow>
                  <msub>
                    <mrow>
                      <mi> K </mi>
                    </mrow>
                    <mrow>
                      <mn> 1 </mn>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <mn> 1 </mn>
                </mrow>
              </mfenced>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> i </mi>
                  <mo> , </mo>
                  <mi> j </mi>
                </mrow>
              </msub>
            </mrow>
            <mrow>
              <msub>
                <mrow>
                  <mi> K </mi>
                </mrow>
                <mrow>
                  <mn> 1 </mn>
                </mrow>
              </msub>
              <mfenced open="[" close="]">
                <mrow>
                  <mfenced>
                    <mrow>
                      <mn> 1 </mn>
                      <mo> - </mo>
                      <mi> b </mi>
                    </mrow>
                  </mfenced>
                  <mo> + </mo>
                  <mi> b </mi>
                  <mfrac>
                    <mrow>
                      <mi> l </mi>
                      <mi> e </mi>
                      <mi> n </mi>
                      <mfenced>
                        <mrow>
                          <msub>
                            <mrow>
                              <mi> D </mi>
                            </mrow>
                            <mrow>
                              <mi> i </mi>
                            </mrow>
                          </msub>
                        </mrow>
                      </mfenced>
                    </mrow>
                    <mrow>
                      <mi> a </mi>
                      <mi> v </mi>
                      <mi> g </mi>
                      <mo> _ </mo>
                      <mi> d </mi>
                      <mi> o </mi>
                      <mi> c </mi>
                      <mi> l </mi>
                      <mi> e </mi>
                      <mi> n </mi>
                    </mrow>
                  </mfrac>
                </mrow>
              </mfenced>
              <mo> + </mo>
              <msub>
                <mrow>
                  <mi> f </mi>
                </mrow>
                <mrow>
                  <mi> i </mi>
                  <mo> , </mo>
                  <mi> j </mi>
                </mrow>
              </msub>
            </mrow>
          </mfrac>
        </math>
      </p>
      <p style="text-align: center;"><strong>图表 7</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
      </p>
      <p style="text-indent: 2em;">
        其中，
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> K </mi>
            </mrow>
            <mrow>
              <mn> 1 </mn>
            </mrow>
          </msub>
        </math>
        和b为经验参数，用于调节词频和文档长度在权重计算中起到的作用，一般来讲，
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
        取1，b取0.75已经被证明是合理的假设。而
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> f </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
        则为词wj在文档
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mrow>
            <msub>
              <mrow>
                <mi> D </mi>
              </mrow>
              <mrow>
                <mi> i </mi>
              </mrow>
            </msub>
          </mrow>
        </math>
        中的词频，
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mrow>
            <mi> a </mi>
            <mi> v </mi>
            <mi> g </mi>
            <mo> _ </mo>
            <mi> d </mi>
            <mi> o </mi>
            <mi> c </mi>
            <mi> l </mi>
            <mi> e </mi>
            <mi> n </mi>
          </mrow>
        </math>
        为平均文档长度。计算得到了系数
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
        ，就可以基Robertson-Sparck Jones等式最终计算出文档关于查询的排序：
      </p>
      <p style="text-align: center;">
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> s </mi>
          <mi> i </mi>
          <mi> m </mi>
          <mfenced>
            <mrow>
              <msub>
                <mrow>
                  <mi> D </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
              <mo> , </mo>
              <mi> q </mi>
            </mrow>
          </mfenced>
          <mo> = </mo>
          <munder>
            <mrow>
              <mo>
                &#x2211;
                <!-- n-ary summation -->
              </mo>
            </mrow>
            <mrow>
              <msub>
                <mrow>
                  <mi> t </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
              <mo>
                &#x2208;
                <!-- element of -->
              </mo>
              <mi> q </mi>
            </mrow>
          </munder>
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
          <mo>
            &#x00D7;
            <!-- multiplication sign -->
          </mo>
          <mi> log </mi>
          <mfrac>
            <mrow>
              <mfenced>
                <mrow>
                  <msub>
                    <mrow>
                      <mi> r </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <mn> 0.5 </mn>
                </mrow>
              </mfenced>
              <mfenced>
                <mrow>
                  <mfenced open="|" close="|">
                    <mrow>
                      <msub>
                        <mrow>
                          <mi> C </mi>
                        </mrow>
                        <mrow>
                          <mn> 0 </mn>
                        </mrow>
                      </msub>
                    </mrow>
                  </mfenced>
                  <mo> - </mo>
                  <msub>
                    <mrow>
                      <mi> n </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <msub>
                    <mrow>
                      <mi> r </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <mn> 0.5 </mn>
                </mrow>
              </mfenced>
            </mrow>
            <mrow>
              <mfenced>
                <mrow>
                  <mfenced open="|" close="|">
                    <mrow>
                      <msub>
                        <mrow>
                          <mi> C </mi>
                        </mrow>
                        <mrow>
                          <mn> 1 </mn>
                        </mrow>
                      </msub>
                    </mrow>
                  </mfenced>
                  <mo> - </mo>
                  <msub>
                    <mrow>
                      <mi> r </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <mn> 0.5 </mn>
                </mrow>
              </mfenced>
              <mfenced>
                <mrow>
                  <msub>
                    <mrow>
                      <mi> n </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> - </mo>
                  <msub>
                    <mrow>
                      <mi> r </mi>
                    </mrow>
                    <mrow>
                      <mi> j </mi>
                    </mrow>
                  </msub>
                  <mo> + </mo>
                  <mn> 0.5 </mn>
                </mrow>
              </mfenced>
            </mrow>
          </mfrac>
        </math>
      </p>
      <p style="text-align: center;"><strong>图表 8</strong>
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <mi> s </mi>
          <mi> i </mi>
          <mi> m </mi>
          <mfenced>
            <mrow>
              <msub>
                <mrow>
                  <mi> D </mi>
                </mrow>
                <mrow>
                  <mi> j </mi>
                </mrow>
              </msub>
              <mo> , </mo>
              <mi> q </mi>
            </mrow>
          </mfenced>
        </math>
      </p>
    `
  },
  {
    title: '实现步骤',
    content: `
      <p>1.求索引项</p>
      <p>2.求系数
        <math xmlns="http://www.w3.org/1998/Math/MathML">
          <msub>
            <mrow>
              <mi> B </mi>
            </mrow>
            <mrow>
              <mi> i </mi>
              <mo> , </mo>
              <mi> j </mi>
            </mrow>
          </msub>
        </math>
      </p>
      <p>3.计算相似度</p>
      <p>4.按相似度降序排序</p>
    `
  },
  {
    title: '优点',
    content: `<p style="text-indent: 2em;">文档可以按照他们相关概率递减的顺序来计算秩（rank）。</p>`
  },
  {
    title: '缺点',
    content: `
      <p style="text-indent: 2em;">
        开始时需要猜想把文档分为相关和不相关的两个集合，实际上这种模型没有考虑索引术语在文档中的频率（因为所有的权重都是二元的），而索引术语都是相互独立的。
      </p>
    `
  }
]
