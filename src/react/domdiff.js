import createDom from '../react-dom/createDom';
import { onlyOne } from '../utils'

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
    // 
    const newDom = createDom(newRenderReactEl)
    currentDom.parentNode.replaceChild(newDom, currentDom)
    currentReactEl = newRenderReactEl;
  }

  return currentReactEl
}

