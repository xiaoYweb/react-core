import { React, ReactDom } from '../common';


class Diff extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }
  handleClick = () => {
    this.setState(state => ({ show: !state.show }))
  }
  render() {
    return this.state.show
      ? React.createElement('ul', { onClick: this.handleClick },
        React.createElement('li', { key: 'A' }, 'A'),
        React.createElement('li', { key: 'B' }, 'B'),
        React.createElement('li', { key: 'C' }, 'C'),
        React.createElement('li', { key: 'D' }, 'D'),
      )
      : React.createElement('ul', { onClick: this.handleClick },
        React.createElement('li', { key: 'A' }, 'A'),
        React.createElement('li', { key: 'C' }, 'C'),
        React.createElement('li', { key: 'B' }, 'B'),
        React.createElement('li', { key: 'E' }, 'E'),
        React.createElement('li', { key: 'F' }, 'F'),
      )
  }
}

const el = React.createElement(Diff)

ReactDom.render(
  el,
  document.getElementById('root')
)

