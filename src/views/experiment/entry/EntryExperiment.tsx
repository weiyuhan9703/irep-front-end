import React, { useCallback } from 'react'
import { Button } from 'antd'
import { Dispatch } from 'redux'
import { useDispatch, useMappedState, State } from '../../../store/Store'
import { Actions } from '../../../store/Actions'
import styles from './EntryExperiment.module.less'

interface ExperimaentProps {
  save: () => void
  loading: boolean
}

/**
 * 入口实验构建模型
 */
const EntryExperiment = (props: ExperimaentProps) => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))

  const handleClick = () => {
    props.save()
  }

  const selectCard = (name: string, index: number, disabled: boolean) => {
    if (disabled) {
      return false
    }
    dispatch({
      type: 'handle_entry_card',
      payload: {
        name,
        type: 'selected',
        index
      }
    })
  }

  const renderCards = () => {
    return state.entryExperimentCards.map((i, index) => {
      return (
        <div
          key={index}
          className={`${styles.Card} ${i.disabled ? styles.CardDisabled : ''}`}
          onClick={() => selectCard(i.name, index, i.disabled)}>
          {i.name}
        </div>
      )
    })
  }

  const renderCurrentCard = () => {
    const currentCards = state.entryExperimentCards.filter(i => i.current)
    if (currentCards.length > 0) {
      return <div className={styles.CurrentCard}>{currentCards[0].name}</div>
    }
  }

  /**
   * 渲染保存按钮的禁用状态
   *
   * 用户选好全部的实验顺序后，解除禁用状态
   */
  const renderSaveButtonDisabled = () => {
    return !state.steps.every(i => i.name)
  }

  return (
    <div>
      <h1>选中下面的卡片，再点击左侧菜单，按正确的实验顺序放置卡片</h1>
      <div className={styles.Current}>
        <p>
          当前已选中卡片：{state.entryExperimentCards.filter(i => i.current).length > 0 ? '点击左侧菜单，放置卡片' : ''}
        </p>
        <div className={styles.CurrentCardWrapper}>{renderCurrentCard()}</div>
      </div>
      <p className={styles.CardsTitle}>卡片列表</p>
      <div className={styles.Cards}>{renderCards()}</div>
      <Button
        className={styles.SaveBtn}
        type="primary"
        disabled={renderSaveButtonDisabled()}
        onClick={handleClick}
        loading={props.loading}>
        保存
      </Button>
    </div>
  )
}

export default EntryExperiment
