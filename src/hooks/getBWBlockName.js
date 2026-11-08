const getBWBlockName = (blockName) => {
  if (typeof blockName === 'string') {
    const parts = blockName.split('/');
    return parts.length > 1 ? parts[1] : blockName;
  }
  return '';
};

export default getBWBlockName;
