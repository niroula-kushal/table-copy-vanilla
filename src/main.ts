import './style.css'
import tableCopy from './table-copy'

tableCopy();

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <table>
    <thead><tr><th style="text-align:center;">JavaScript</th><th style="text-align:center;">TypeScript</th></tr></thead><tbody><tr><td style="text-align:center;"><a href="https://vite.new/vanilla" target="_blank" rel="noreferrer">vanilla</a></td><td style="text-align:center;"><a href="https://vite.new/vanilla-ts" target="_blank" rel="noreferrer">vanilla-ts</a></td></tr><tr><td style="text-align:center;"><a href="https://vite.new/vue" target="_blank" rel="noreferrer">vue</a></td><td style="text-align:center;"><a href="https://vite.new/vue-ts" target="_blank" rel="noreferrer">vue-ts</a></td></tr><tr><td style="text-align:center;"><a href="https://vite.new/react" target="_blank" rel="noreferrer">react</a></td><td style="text-align:center;"><a href="https://vite.new/react-ts" target="_blank" rel="noreferrer">react-ts</a></td></tr><tr><td style="text-align:center;"><a href="https://vite.new/preact" target="_blank" rel="noreferrer">preact</a></td><td style="text-align:center;"><a href="https://vite.new/preact-ts" target="_blank" rel="noreferrer">preact-ts</a></td></tr><tr><td style="text-align:center;"><a href="https://vite.new/lit" target="_blank" rel="noreferrer">lit</a></td><td style="text-align:center;"><a href="https://vite.new/lit-ts" target="_blank" rel="noreferrer">lit-ts</a></td></tr><tr><td style="text-align:center;"><a href="https://vite.new/svelte" target="_blank" rel="noreferrer">svelte</a></td><td style="text-align:center;"><a href="https://vite.new/svelte-ts" target="_blank" rel="noreferrer">svelte-ts</a></td></tr></tbody>
    </table>

    <textarea style="width: 100%;margin-top: 10px" rows="10"></textarea>

  </div>
`