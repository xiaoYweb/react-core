
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

function dispatchEvent(ev) {
  const { target } = ev;
  
}