const getParents = (dom) => {
  const parent = dom.parentElement;
  if (!parent) {
    return [];
  } else {
    const list = getParents(parent);
    list.unshift(parent);
    return list;
  }
};

const getPath = (dom) => {
  let list = getParents(dom);
  list.unshift(dom);
  return list;
};

export default {
  getParents,
  getPath 
};