import createDom from '../react-dom/createDom';
import { setProp } from '../react-dom/setProps';
import { onlyOne } from '../utils';
import { TEXT, ELEMENT, FUNCTION_COMPONENT, CLASS_COMPONENT } from './constants';

// domdiff
export function compareTwoRenderReactEl(oldRenderReactEl, newRenderReactEl) {
  console.log('compareTwoRenderReactEl')
  oldRenderReactEl = onlyOne(oldRenderReactEl)
  newRenderReactEl = onlyOne(newRenderReactEl)
  let currentDom = oldRenderReactEl.renderDom;

  let currentReactEl = oldRenderReactEl;
  if (newRenderReactEl === null) { // 新的虚拟dom 节点为 null 
    currentDom.parentNode.removeChild(currentDom)
  } else if (oldRenderReactEl.type !== newRenderReactEl.type) {
    const newDom = createDom(newRenderReactEl)
    currentDom.parentNode.replaceChild(newDom, currentDom)
    currentReactEl = newRenderReactEl;
  } else {
    // 新老节点都有 type 一样  要进行 domdiff
    updateReactElement(oldRenderReactEl, newRenderReactEl)
    // const newDom = createDom(newRenderReactEl)
    // currentDom.parentNode.replaceChild(newDom, currentDom)
    // currentReactEl = newRenderReactEl;
  }

  return currentReactEl
}

function updateReactElement(oldRenderReactEl, newRenderReactEl) {
  const currentDom = newRenderReactEl.renderDom = oldRenderReactEl.renderDom;
  if (newRenderReactEl.$$typeof === TEXT && oldRenderReactEl.$$typeof === TEXT) {
    if (newRenderReactEl.content !== oldRenderReactEl.content) {
      currentDom.textContent = newRenderReactEl.content;
    }
  } else if (oldRenderReactEl.$$typeof === ELEMENT) {
    updateDomProperties(currentDom, oldRenderReactEl.props, newRenderReactEl.props)
    updateChildrenReactEl(currentDom, oldRenderReactEl.props.children, newRenderReactEl.props.children); // 递归更新子元素
  } else if (oldRenderReactEl.$$typeof === FUNCTION_COMPONENT) {
    updateFunctionComponent(oldRenderReactEl, newRenderReactEl)
  } else if (oldRenderReactEl.$$typeof === CLASS_COMPONENT) {
    updateClassComponent(oldRenderReactEl, newRenderReactEl)
  }
}

function updateDomProperties(dom, oldProps, newProps) {
  patchProps(dom, oldProps, newProps)
}

function patchProps(dom, oldProps, newProps) {
  for (const key in oldProps) {
    if (Object.hasOwnProperty.call(oldProps, key)) {
      if (key === 'children') continue;
      if (!newProps.hasOwnProperty(key)) { // 老有 新没有
        dom.removeAttribute(key)
      }
    }
  }
  for (const key in newProps) {
    if (Object.hasOwnProperty.call(newProps, key)) {
      if (key === 'children') continue;
      setProp(dom, key, newProps[key])
    }
  }
}

function updateChildrenReactEl(parentNode, oldReactElChildren, newReactElChildren) {
  diff(parentNode, oldReactElChildren, newReactElChildren)
}

function diff(parentNode, oldReactElChildren, newReactElChildren) {

}

// 拿到老元素 重新执行函数组件 拿到新元素 进行对比
function updateFunctionComponent(oldRenderReactEl, newRenderReactEl) {
  const childOldRenderEl = oldRenderReactEl.renderReactEl;
  const childNewRenderEl = newRenderReactEl.type(newRenderReactEl.props)
  const childCurrentRenderEl = compareTwoRenderReactEl(childOldRenderEl, childNewRenderEl)
  newRenderReactEl.renderReactEl = childCurrentRenderEl;
  return childCurrentRenderEl;
}

function updateClassComponent(oldRenderReactEl, newRenderReactEl) {
  const { oldInstance } = oldRenderReactEl;
  const { $updater: oldUpdater } = oldInstance;
  const { newProps } = newRenderReactEl;
  oldUpdater.emitUpdate(newProps)
}