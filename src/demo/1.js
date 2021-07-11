import { React, ReactDom } from '../common';

const onclick = (ev) => { 
  // alert(11) 
  console.log(ev)
  ev.persist()
  setTimeout(() => {
    console.log(ev)
  }, 1000);
}
// const el = <button id="say-hello"> say
//   <span color="red" onClick={onclick}>hello</span>
// </button>;
const el = React.createElement(
  'button',
  { id: 'say-hello', onClick: onclick },
  'say',
  React.createElement('span', { style: { color: 'red' } }, 'hello'))

console.log('demo1 el', el)
ReactDom.render(
  el,
  document.getElementById('root')
)

