/** 仿真我的搜索引擎的检索结果接口 */
export interface SearchResult {
  content: string
  docId: number
  title: string
  url: string
}

/** 求文档IDF的检索结果接口 */
export interface IdfResult {
  idf: number
  num: number
  term: string
}

/** 查询预处理检索结果接口/求索引项接口
 *
 * 向量空间模型/概率模型
 */
export interface VectorSpacePreProcessQuery {
  query: string
  result: string[]
}

/** 查询的TF的检索结果接口 */
export interface QueryTFResult {
  docId: number
  term: string
  tf: number
}

/** 查询向量的检索结果的接口 */
export interface QueryVectorResult {
  num: number
  term: string
  value: number
}

/** 各文档TF检索结果接口 */
export interface QueryDocTFResult {
  docId: number
  tfs: QueryTFResult[]
  title: string
}

/** 文档向量检索结果接口 */
export interface QueryDocVectorResult {
  docId: number
  title: string
  vector: QueryVectorResult[]
}

/** 求相似度结果接口
 *
 * 降序也是此接口
 */
export interface QuerySimilarityResult {
  docId: number
  similarity: number
  title: string
}

/** 概率检测模型求系数bij接口 */
export interface QueryBIJResult {
  bij: number
  docId: number
  term: string
}
