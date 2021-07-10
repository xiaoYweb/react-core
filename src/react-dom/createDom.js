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

  } else if ($$typeof === CLASS_COMPONENT) { // calss el
    dom = createNativeDom(reactEl)
  }

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
  reactElChldren.flat(Infinity).forEach(reactEl => {
    const childDom = createDom(reactEl)
    parentNode.appendChild(childDom)
  })
}

export default createDom;
