import React, { useEffect } from 'react'
import styles from './Knowledge.module.less'

interface KnowledgeProps {
  knowledge: { title: string; content: string }[]
}

/** 温故知新 */
const Knowledge = (props: KnowledgeProps) => {
  useEffect(() => {
    // @ts-ignore
    if (window.MathJax && window.MathJax.Hub) {
      // 如果，不传入第三个参数，则渲染整个document
      // @ts-ignore
      // eslint-disable-next-line no-undef
      window.MathJax.Hub.Queue(['Typeset', MathJax.Hub, document.getElementById('knowledgeMathJaxContent')])
    }
  }, [props.knowledge])

  const renderContent = () => {
    return props.knowledge.map((i, index) => {
      return (
        <div key={index}>
          <div className={styles.KnowledgeWrapper}>
            <div className={styles.TitleWrapper}>
              <span>{i.title}</span>
            </div>
            <div className={styles.Content} dangerouslySetInnerHTML={{ __html: i.content }} />
          </div>
        </div>
      )
    })
  }

  return <div id="knowledgeMathJaxContent">{renderContent()}</div>
}

export default Knowledge
