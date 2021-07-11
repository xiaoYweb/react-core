import { updateQueue }from '../react/Component'

/**
 * 合成事件 代理到 document 上
 * @param {*} dom 绑定事件的 dom
 * @param {*} eventType 事件类型 onClick ...
 * @param {*} listener 事件函数
 */
export function addEvent(dom, eventType, listener) {
  eventType = eventType.toLowerCase();
  const eventStore = dom.eventStore || (dom.eventStore = {}) // 存放监听函数
  eventStore[eventType] = listener;
  document.addEventListener(eventType.slice(2), dispatchEvent, false) // 冒泡
}

let syntheticEvent;
function dispatchEvent(ev) {
  let { target, type } = ev;
  const eventType = 'on' + type;

  updateQueue.isBatchUpdate = true;

  while (target) {
    const { eventStore } = target;
    if (eventStore) {
      const listener = eventStore[eventType]
      syntheticEvent = createSyntheticEvent(ev)

      syntheticEvent.currentTarget = target;
      listener.call(target, syntheticEvent)
    }

    for (const key in syntheticEvent) { 
      syntheticEvent[key] = null
    }

    target = target.parentNode;
  }
  
  updateQueue.isBatchUpdate = true;
  updateQueue.batchUpdate() // 执行批量更新
}

class SyntheticEvent {
  constructor(ev) {
    this.nativeEvent = ev
  }
  persist() {
    syntheticEvent = createSyntheticEvent(this.nativeEvent)
  }
}
function createSyntheticEvent(ev) {
  const syntheticEvent = new SyntheticEvent(ev)
  syntheticEvent.nativeEvent = ev;
  for (const key in ev) {
    const val = ev[key]
    if (typeof val === 'function') {
      syntheticEvent[key] = val.bind(ev)
    } else {
      syntheticEvent[key] = val
    }
  }
  return syntheticEvent;
}