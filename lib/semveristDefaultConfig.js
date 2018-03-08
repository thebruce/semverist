

module.exports = {
  semveristBehaviors: {
    inheritence: 'semverImplied',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: false,
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'merge',
    preReleasePattern:
      /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g,
  },
  groups: {},
  prereleaseOrdering: {},
  directoryFileIgnorePattern: 'json$',
  converterType: 'default',
  composer: {
    composerType: 'default',
    destination: null,
    priority: 'default',
  },
};
