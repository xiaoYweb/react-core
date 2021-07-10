import { React, ReactDom } from './common';

const onclick = () => { alert(11) }
// const el = <button id="say-hello"> say
//   <span color="red" onClick={onclick}>hello</span>
// </button>;
const el = React.createElement(
  'button',
  { id: 'say-hello', onClick: onclick },
  'say',
  React.createElement('span', { style: { color: 'red' } }, 'hello'))

console.log('el', el)
ReactDom.render(
  el,
  document.getElementById('root')
)