import { React, ReactDom } from '../common';


class ClassComponent extends React.Component {
  render() {
    // return React.createElement('div', { id: 'class-counter'}, 'hello')
    return React.createElement(FunctionComponent, { n: 11 }, 'hello')
  }
}

function FunctionComponent (props) {
  return React.createElement('div', { id: 'function-counter'}, props.children, props.n)
}

// const el1 = React.createElement('div', { id: 'counter'}, 'hello')
// const el2 = React.createElement(FunctionComponent)

const el3 = React.createElement(ClassComponent)

ReactDom.render(
  el3,
  document.getElementById('root')
)

