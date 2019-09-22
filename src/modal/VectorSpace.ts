/** 向量空间模型--下拉选项接口 */
export interface Options {
  label: string
  value: string
}

/** 标准检索数据结果接口 */
export interface StandardResult {
  queryId: number
  docId: number
  docRank: number
  retrieverId: number
  score: number
  isExisting: boolean | null
  title: string
}
