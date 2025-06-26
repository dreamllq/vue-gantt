const getParents = (dom:HTMLElement):HTMLElement[] => {
  const parent = dom.parentElement;
  if (!parent) {
    return [];
  } else {
    const list = getParents(parent);
    list.unshift(parent);
    return list;
  }
};

const getPath = (dom:HTMLElement) => {
  const list = getParents(dom);
  list.unshift(dom);
  return list;
};

export default {
  getParents,
  getPath 
};