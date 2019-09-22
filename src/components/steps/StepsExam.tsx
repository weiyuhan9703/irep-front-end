import React, { useCallback } from 'react'
import { Icon } from 'antd'
import { Dispatch } from 'redux'
import { useDispatch, useMappedState, State } from '../../store/Store'
import { Actions } from '../../store/Actions'
import styles from './StepsExam.module.less'

const StepsExam = () => {
  const dispatch: Dispatch<Actions> = useDispatch()
  const state: State = useMappedState(useCallback((globalState: State) => globalState, []))

  const removeCard = (name: string, index: number) => {
    dispatch({
      type: 'handle_entry_card',
      payload: {
        name,
        type: 'remove',
        index
      }
    })
  }

  const addCard = (index: number) => {
    const currentIndex = state.entryExperimentCards.findIndex(i => i.current)
    if (currentIndex === -1) {
      return false
    }
    dispatch({
      type: 'handle_entry_card',
      payload: {
        name: '',
        type: 'add',
        index
      }
    })
  }

  const renderCard = (name: string, index: number) => {
    if (name) {
      return (
        <>
          <span className={`${styles.Name}`}>{`${index + 1}.${name}`}</span>
          <div className={styles.CloseBox} onClick={() => removeCard(name, index)}>
            <Icon type="close-circle" style={{ color: '#999' }} />
          </div>
        </>
      )
    } else {
      return (
        <span className={styles.Index} onClick={() => addCard(index)}>
          {index + 1}
        </span>
      )
    }
  }
  const renderSteps = () => {
    return state.steps.map((i, index) => {
      return (
        <div key={index} className={`${styles.Item} ${!i.name ? styles.Operational : ''}`}>
          {renderCard(i.name, index)}
        </div>
      )
    })
  }
  return <div className={styles.Container}>{renderSteps()}</div>
}

export default StepsExam
