import { TEXT, ELEMENT, FUNCTION_COMPONENT, CLASS_COMPONENT } from './constants';

export function createElement(type, config = {}, ...children) {
  delete config.__source;
  delete config.__self;
  const { key, ref, ...props } = config;
  let $$typeof;
  if (typeof type === 'string') {
    $$typeof = ELEMENT;
  } else if (typeof type === 'function' && type.isReactComponent) {
    $$typeof = CLASS_COMPONENT;
  } else if (typeof type === 'function') {
    $$typeof = FUNCTION_COMPONENT;
  }

  props.children = children.map(item => {
    if (typeof item === 'object') { // react元素
      return item;
    } else {
      return {
        $$typeof: TEXT,
        type: TEXT,
        content: item,
      }
    }
  });

  return reactElement($$typeof, type, key, ref, props)
}

function reactElement($$typeof, type, key, ref, props) {
  return {
    $$typeof, type, key, ref, props
  }
}



export default createElement;