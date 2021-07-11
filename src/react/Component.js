import { compareTwoRenderReactEl } from './domdiff';
export const updateQueue = {
  updaters: [], // 更新器
  isBatchUpdate: false, // 是否批量更新 模式
  add(updater) {
    this.updaters.push(updater)
  },
  batchUpdate() {
    const { updaters } = this;
    this.isBatchUpdate = true;

    let updater;
    while (updater = updaters.pop()) {
      updater.updateComonent()
    }

    this.isBatchUpdate = false;
  }
}

class Updater {
  constructor(componentInstance) {
    this.componentInstance = componentInstance; // 一个组件实例对应一个更新器
    this.pendingState = []
    this.nextProps = null;
  }
  addState(partialState) {
    this.pendingState.push(partialState); //
    this.emitUpdate()
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps; // 可能回传新的属性对象 父组件更新
    if (!nextProps && updateQueue.isBatchUpdate) { // 批量更新条件 没有新属性且处于批量更新模式
      updateQueue.add(this)
      return
    }
    // 非批量更新 立即更新
    this.updateComonent()
  }
  updateComonent() {
    const { componentInstance, pendingState, nextProps } = this;
    if (nextProps || pendingState.length > 0) {
      shouldUpdate(componentInstance, nextProps, this.getState())
    }
  }
  getState() {
    const { componentInstance, pendingState } = this;
    let { state } = componentInstance
    pendingState.length > 0 && pendingState.forEach(partialState => {
      state = typeof partialState === 'function'
        ? state = partialState.call(componentInstance, state)
        : { ...state, ...partialState }
    })
    pendingState.length = 0;
    return state;
  }
}

function shouldUpdate(componentInstance, nextProps, nextState) {
  componentInstance.props = nextProps;
  componentInstance.state = nextState;
  const { shouldComponentUpdate } = componentInstance;
  if (shouldComponentUpdate && !shouldComponentUpdate(nextProps, nextState)) {
    return false
  }
  componentInstance.forceUpdate()
}

class Component {
  constructor(props) {
    this.props = props;
    this.$updater = new Updater(this)
    this.state = {}
    this.nextProps = null;
  }
  setState(partialState) {
    this.$updater.addState(partialState)
  }
  forceUpdate() {
    console.log('forceUpdate')
    const {
      props, state, renderReactEl,
      componentWillUpdate, componentDidUpdate,
    } = this;
    typeof componentWillUpdate === 'function' && componentWillUpdate()

    const newRenderReactEl = this.render();
    const currentRenderEl = compareTwoRenderReactEl(renderReactEl, newRenderReactEl)
    this.renderReactEl = currentRenderEl;

    typeof componentDidUpdate === 'function' && componentDidUpdate()
  }
}
Component.isReactComponent = {}


export default Component;