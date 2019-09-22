/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import ReactDOM from 'react-dom'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import { makeStore, StoreContext } from './store/Store'
import './reset.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const store = makeStore()

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <LocaleProvider locale={zh_CN}>
      <section className="GlobalSection">
        <App />
      </section>
    </LocaleProvider>
  </StoreContext.Provider>,
  document.getElementById('root')
)
serviceWorker.unregister()
