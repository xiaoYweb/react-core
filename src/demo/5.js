import { React, ReactDom } from '../common';


function FunctionCounter(props) {
  const { count, onclick } = props;
  return React.createElement('div', { id: 'counter', n: count },
    React.createElement('p', {},
      count
    ),
    React.createElement('button', { onClick: onclick },
      '+++'
    )
  )
}

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  onclick = () => {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    return <FunctionCounter count={this.state.count} onclick={this.onclick} />
  }
}

const el = React.createElement(Counter)

ReactDom.render(
  el,
  document.getElementById('root')
)

