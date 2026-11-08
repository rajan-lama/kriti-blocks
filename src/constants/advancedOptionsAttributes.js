const advancedOptionsAttributes = {
  animations: {
    type: 'string',
    default: 'none',
    usedBy: 'AnimationPanel',
  },
  onHoverAnimations: {
    type: 'string',
    default: 'none',
    usedBy: 'AnimationPanel',
  },
  displayDateRange: {
    type: 'Object',
    usedBy: 'DateRangeVisibilityPanel',
  },
  showDesktop: {
    type: 'Boolean',
    display: true,
    usedBy: 'DeviceVisibilityPanel',
  },
  showTablet: {
    type: 'Object',
    display: true,
    usedBy: 'DeviceVisibilityPanel',
  },
  showMobile: {
    type: 'Object',
    display: true,
    usedBy: 'DeviceVisibilityPanel',
  },
  userVisibility: {
    type: 'string',
    default: 'none',
    usedBy: 'UserVisibilityPanel',
  },
  selectedRoles: {
    type: 'array',
    default: '[]',
    usedBy: 'UserVisibilityPanel',
  },
};

export default advancedOptionsAttributes;
