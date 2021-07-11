import { addEvent } from './events';

function setProps(dom, props) {
  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (key === 'children') continue;
      const value = props[key]
      setProp(dom, key, value)
    }
  }
}

function setProp(dom, key, value) {
  if (/^on/.test(key)) {
    // dom[key.toLowerCase()] = value;
    addEvent(dom, key, value)
  } else if (key ==='style') {
    for (const styleName in value) {
      if (Object.hasOwnProperty.call(value, styleName)) {
        dom.style[styleName] = value[styleName]
      }
    }
  } else {
    dom.setAttribute(key, value)
  }
}

export default setProps;
