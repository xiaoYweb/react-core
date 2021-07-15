import createDom from '../react-dom/createDom';
import { setProp } from '../react-dom/setProps';
import { onlyOne } from '../utils';
import { TEXT, ELEMENT, FUNCTION_COMPONENT, CLASS_COMPONENT, REMOVE, MOVE, INSERT } from './constants';

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


let updateDepth = 0;
let diffQueue = [];
function updateChildrenReactEl(parentNode, oldReactElChildren, newReactElChildren) {
  updateDepth++
  diff(parentNode, oldReactElChildren, newReactElChildren)
  updateDepth--
  if (updateDepth === 0) {
    patch(diffQueue)
    updateDepth.length = 0;
  }
}

function patch(updateDepth) {
  const deleteMap = {}
  const deleteChildren = []
  for (let i = 0; i < updateDepth.length; i++) {
    const diffrence = updateDepth[i];
    const { type, parentNode, fromIndex } = diffrence;
    if (type === MOVE || type === REMOVE) {
      const oldChildDom = parentNode.children[fromIndex]
      deleteMap[fromIndex] = oldChildDom;
      deleteChildren.push(oldChildDom)
    }
  }
  deleteChildren.forEach(childDom => {
    childDom.parentNode.removeChild(childDom)
  })
  for (let i = 0; i < updateDepth.length; i++) {
    const diffrence = updateDepth[i];
    const { type, parentNode, fromIndex, toIndex, dom } = diffrence;
    switch (type) {
      case INSERT:
        insertChildAt(parentNode, dom, toIndex)
        break;
      case MOVE:
        insertChildAt(parentNode, deleteMap[fromIndex], toIndex)
        break;
      default:
        break;
    }
  }
}

function insertChildAt(parentNode, newChildDom, index) {
  const oldChildDom = parentNode.children[index]
  oldChildDom
    ? parentNode.insertBefore(newChildDom, oldChildDom)
    : parentNode.appendChild(newChildDom)
}


function diff(parentNode, oldReactElChildren, newReactElChildren) {
  const oldReactElChildrenMap = getOldReactElChildrenMap(oldReactElChildren)
  const newReactElChildrenMap = getNewReactElChildrenMap(oldReactElChildrenMap, newReactElChildren)

  let lastIndex = 0;
  for (let i = 0; i < newReactElChildren.length; i++) {
    const newChildReactEl = newReactElChildren[i];
    if (!newChildReactEl) continue;
    const newKey = newChildReactEl.key || i;
    const oldChildReactEl = oldReactElChildrenMap[newKey]
    const { _mountIndex } = oldChildReactEl;
    if (oldChildReactEl === newChildReactEl) {
      if (oldChildReactEl < lastIndex) {
        diffQueue.push({
          parentNode,
          type: MOVE,
          fromIndex: _mountIndex,
          toIndex: i
        })
      }
      lastIndex = Math.max(lastIndex, _mountIndex)
    } else { // 新老元素不相等 插入
      diffQueue.push({
        parentNode,
        type: INSERT,
        fromIndex: _mountIndex,
        toIndex: i,
        dom: createDom(newChildReactEl)
      })

    }
    newChildReactEl._mountIndex = i;

  }

  for (const key in oldReactElChildrenMap) {
    if (!Object.hasOwnProperty.call(newReactElChildrenMap, key)) {
      const oldChildReactEl = oldReactElChildrenMap[key];
      diffQueue.push({
        parentNode,
        type: REMOVE,
        fromIndex: oldChildReactEl._mountIndex,
      })
    }
  }
}

function getNewReactElChildrenMap(oldReactElChildrenMap, newReactElChildren) {
  const newReactElChildrenMap = {}
  for (let i = 0; i < newReactElChildren.length; i++) {
    const newChildReactEl = newReactElChildren[i];
    if (!newChildReactEl) continue
    const newKey = newChildReactEl.key || i;
    const oldChildReactEl = oldReactElChildrenMap[newKey]
    if (canDeepCompare(oldChildReactEl, newChildReactEl)) {
      updateReactElement(oldChildReactEl, newChildReactEl) // 复用老节点 用新属性更细dom
      newReactElChildren[i] = oldChildReactEl;
    }
    newReactElChildrenMap[newKey] = newReactElChildrenMap[i];
  }
  return newReactElChildrenMap;
}

function canDeepCompare(oldChildReactEl, newChildReactEl) {
  if (oldChildReactEl && newChildReactEl) {
    return oldChildReactEl.type === newChildReactEl.type
  }
  return false;
}

function getOldReactElChildrenMap(oldReactElChildren) {
  const oldReactElChildrenMap = {}
  for (let i = 0; i < oldReactElChildren.length; i++) {
    const oldChildReactEl = oldReactElChildren[i];
    const oldKey = oldChildReactEl.key || i;
    oldReactElChildrenMap[oldKey] = oldChildReactEl;
  }
  return oldReactElChildrenMap;
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