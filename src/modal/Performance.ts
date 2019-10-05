/** 检索模型性能对比数据接口 */
export interface IndividualPerformance {
  f1: number
  map: number
  ndcg: number
  ndcg5: number
  ndcg10: number
  ndcg20: number
  p5: number
  p10: number
  p20: number
  precision: number
  r5: number
  r10: number
  r20: number
  recall: number
}

/** 检索模型性能对比参数接口
 *
 * 接口返回的数据类型接口
 */
export interface IndividualPerformanceOrigin extends IndividualPerformance {
  query: string
  retrieverId: string
  id: number
}

/** 综合性能雷达图数据接口 */
export interface AveragePerformance {
  boolModelPerformance: IndividualPerformanceOrigin
  vsmPerformance: IndividualPerformanceOrigin
  probabilityModelPerformance: IndividualPerformanceOrigin
  languageModelPerformance: IndividualPerformanceOrigin
}

/** 综合性能雷达图 legend图标默认显示状态接口 */
export interface RadarSelected {
  boolModelPerformance: boolean
  vsmPerformance: boolean
  probabilityModelPerformance: boolean
  languageModelPerformance: boolean
}

/** 综合性能数据字段类型 */
export type PerformaceKeys =
  | 'boolModelPerformance'
  | 'vsmPerformance'
  | 'probabilityModelPerformance'
  | 'languageModelPerformance'

export type ValueKeys =
  | 'f1'
  | 'map'
  | 'ndcg20'
  | 'ndcg10'
  | 'ndcg5'
  | 'ndcg'
  | 'r20'
  | 'r10'
  | 'r5'
  | 'recall'
  | 'p20'
  | 'p10'
  | 'p5'
  | 'precision'

