import { background } from '@wordpress/icons';

const layoutOptionsAttributes = {
  backgroundOption: {
    type: 'string',
    default: 'color',
    usedBy: 'BackgroundPanel',
  },
  backgroundColor: {
    type: 'string',
    default: '#fff',
    usedBy: 'BackgroundPanel',
  },
  backgroundGradient: {
    type: 'string',
    default: '',
    usedBy: 'BackgroundPanel',
  },
  backgroundImageOverlay: {
    type: 'string',
    default: '',
    usedBy: 'BackgroundPanel',
  },
  backgroundFocalPoint: {
    type: 'object',
    default: {
      x: 0.5,
      y: 0.5,
    },
    usedBy: 'BackgroundPanel',
  },
  backgroundAttachmentScroll: {
    type: 'string',
    default: 'scroll',
    usedBy: 'BackgroundPanel',
  },
  backgroundBlendMode: {
    type: 'string',
    default: 'normal',
    usedBy: 'BackgroundPanel',
  },
  backgroundRepeat: {
    type: 'string',
    default: 'normal',
    usedBy: 'BackgroundPanel',
  },
  backgroundOpacity: {
    type: 'string',
    default: 'normal',
    usedBy: 'BackgroundPanel',
  },
  displayType: {
    type: 'string',
    default: 'normal',
    usedBy: 'DisplayTypePanel',
  },
  rowDirection: {
    type: 'string',
    default: 'normal',
    usedBy: 'DisplayTypePanel',
  },
  flexWrap: {
    type: 'string',
    default: 'normal',
    usedBy: 'DisplayTypePanel',
  },
  justifyContent: {
    type: 'string',
    default: 'normal',
    usedBy: 'DisplayTypePanel',
  },
  alignItem: {
    type: 'string',
    default: 'normal',
    usedBy: 'DisplayTypePanel',
  },
  positionType: {
    type: 'string',
    default: 'normal',
    usedBy: 'PositionPanel',
  },
  rowGap: {
    type: 'object',
    default: {},
    usedBy: 'SpacingPanel',
  },
  columnGap: {
    type: 'object',
    default: {},
    usedBy: 'SpacingPanel',
  },
  padding: {
    type: 'object',
    default: {},
    usedBy: 'SpacingPanel',
  },
  margin: {
    type: 'object',
    default: {},
    usedBy: 'SpacingPanel',
  },
  textColor: {
    type: 'string',
    default: 'normal',
    usedBy: 'TextColorPanel',
  },
  linkColor: {
    type: 'string',
    default: 'normal',
    usedBy: 'TextColorPanel',
  },
  hoverColor: {
    type: 'string',
    default: 'normal',
    usedBy: 'TextColorPanel',
  },
  visitedColor: {
    type: 'string',
    default: 'normal',
    usedBy: 'TextColorPanel',
  },
  zindex: {
    type: 'string',
    default: 'normal',
    usedBy: 'ZIndexPanel',
  },
};

export default layoutOptionsAttributes;
