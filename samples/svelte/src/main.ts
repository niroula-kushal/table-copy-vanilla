import './app.css'
import App from './App.svelte'

import {tableCopy} from 'table-copy-vanilla'
import 'table-copy-vanilla/dist/style.css'

tableCopy();

const app = new App({
  target: document.getElementById('app')!,
})

export default app
