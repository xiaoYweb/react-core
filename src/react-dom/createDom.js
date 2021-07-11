import { TEXT, ELEMENT, FUNCTION_COMPONENT, CLASS_COMPONENT } from '../react/constants';
import { onlyOne } from '../utils';
import setProps from './setProps';


// reactEl --> dom
function createDom(reactEl) {
  reactEl = onlyOne(reactEl) // ??
  const { $$typeof } = reactEl;
  let dom;
  if (!$$typeof) { // string number 
    dom = document.createTextNode(reactEl)
  } else if ($$typeof === TEXT) {
    dom = document.createTextNode(reactEl.content)
  } else if ($$typeof === ELEMENT) { // dom el
    dom = createNativeDom(reactEl)
  } else if ($$typeof === FUNCTION_COMPONENT) { // function el
    dom = createFunctionComponentDom(reactEl)
  } else if ($$typeof === CLASS_COMPONENT) { // calss el
    dom = createClassComponentDom(reactEl)
  }
  
  reactEl.renderDom = dom;
  return dom;
}

function createNativeDom(reactEl) { // 创建原生 dom
  const { type, props } = reactEl;
  const dom = document.createElement(type);

  createNativeChildren(dom, props.children)
  setProps(dom, props)

  return dom
}

function createNativeChildren(parentNode, reactElChldren) {
  if (!reactElChldren) return
  reactElChldren.flat(Infinity).forEach((reactEl, i) => {
    reactEl._mountIndex = i; // 索引表示 用于 dom-diff
    const childDom = createDom(reactEl)
    parentNode.appendChild(childDom)
  })
}

function createFunctionComponentDom(reactEl) {
  const { type: FunctionComponent, props } = reactEl;
  const renderReactEl = FunctionComponent(props)
  const newDom = createDom(renderReactEl)

  reactEl.renderReactEl = renderReactEl;
  renderReactEl.renderDom = newDom;

  return newDom;
}

function createClassComponentDom(reactEl) {
  const { type: ClassComponent, props } = reactEl;
  const instance = new ClassComponent(props)
  instance.props = props;

  const renderReactEl = instance.render()
  const newDom = createDom(renderReactEl)

  renderReactEl.renderDom = newDom;
  reactEl.componentInstance = instance;
  instance.renderReactEl = renderReactEl
  
  return newDom;
}

export default createDom;
