import { React, ReactDom } from '../common';


class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  tick = (ev) => {
    setTimeout(() => {
      console.log('tick ev', ev)
    }, 1000);
  }
  onclick = (ev) => {
    console.log('ev', ev)
    this.tick(ev)
  }
  render() {
    return <div>
      <p>{this.state.count}</p>
      <button onClick={this.onclick}>
        ++ <span>++</span>
      </button>
    </div>
  }
}
ReactDom.render(
  <Counter />,
  document.getElementById('root')
)

