import { React, ReactDom } from '../common';


class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  onclick = () => {
    this.setState({ count: this.state.count + 1 })
    console.log('count', this.state.count)
    this.setState({ count: this.state.count + 1 })
    console.log('count', this.state.count)
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 })
      console.log('count', this.state.count)
      this.setState({ count: this.state.count + 1 })
      console.log('count', this.state.count)
    }, 1000);
  }
  handleClick = () => {
    this.setState(state => ({ count: state.count + 1 }))
    console.log('count', this.state.count) // 0
    this.setState(state => {
      console.log('count', state.count) // 1
      return { count: state.count + 1 }
    })
    console.log('count', this.state.count) // 0
  }
  render() {
    return React.createElement('div', { id: 'counter' }, this.state.count,
      React.createElement('button', { onClick: this.onclick }, '+++'))
  }
}

const el = React.createElement(Counter)

ReactDom.render(
  el,
  document.getElementById('root')
)

