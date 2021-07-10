import createDom from './createDom';

function render(reactEl, container) {
  const dom = createDom(reactEl); // reactEl --> dom
  container.appendChild(dom)
}

export default render;