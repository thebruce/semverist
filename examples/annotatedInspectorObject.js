'use strict';

/**
 * The Inspector object is created by the semverist inspector.
 * It is based on the object or directory you have inspected.
 * We will refer to that object or directory as a 'semverist object'
 * below for brevity.
 */

const inspector = {  // eslint-disable-line no-unused-vars
  inspectorSemverRanges: '^3.13 ||  ^4', // Represents the ranges of all attributes of the semverist object.
  highestDeclaredRange: '4.0.1',  // The highest explicitly declared attribute's semver version in the semverist object.
  lowestDeclaredRange: '3.13.0',  // The lowest explicitly declared attribute's semver version of the semverist object.
  default: { // A semverist object attribute. This could represent an attribute of an object or a directory, depending on the semverist source. Defaults are good for all attributes and groups and are inherited by all.
    semverRange: '^3.13 ||  ^4',  // The range that this attribute satisfies.
    inspectorItemType: 'default', // default || group || attribute
    highestDeclaredRange: '4.0.1', // the highest declared range for this semverist attribute.
    lowestDeclaredRange: '3.13.0', // the lowest declared range for this semverist attribute.
    items: { // A collection of semver ranges where this semver attribute has representation.
      '^4.0.1': { // A semver range.
        components: [ // an array of components that comprise this semver attributes realization for this range.
          '4.0.1.default' // This means that we have an attribute `default` in a semver hierarchy 4.0.1
        ]
      },
      '^4.0.0': {
        components: [
          '4.0.default'
        ]
      },
      '^3.13': {
        components: [
          '3.13.default'
        ]
      }
    }
  },
  arbitraryGroupName: {
    semverRange: '3.13.0 || ~4.0.0',
    inspectorItemType: 'group',
    highestDeclaredRange: '4.0.1',
    lowestDeclaredRange: '3.13.0',
    items: {
      '4.0.0 || ^4.02': {
        components: [
          '4.0.arbitraryGroupName'
        ]
      },
      '^4.0.1': {
        components: [
          '4.0.1.default',
          '4.0.arbitraryGroupName'
        ]
      },
      '3.13.0': {
        components: [
          '3.13.0.arbitaryGroupName',
          '3.13.default'
        ]
      }
    }
  },
  episodes: {
    semverRange: '3.13.0 || ^4', // Because we have configuration at 4.episodes, we have implied inheritence for the entire 4 major version.
    inspectorItemType: 'attribute',
    highestDeclaredRange: '4.0.1',
    lowestDeclaredRange: '3.13.0',
    items: {
      '4.0.0 && >4.0.1': {
        components: [
          '4.0.arbitraryGroupName',
          '4.episodes'
        ]
      },
      '4.0.1': {
        components: [
          '4.0.1.episode',
          '4.0.1.default',
          '4.0.arbitraryGroupName'
        ]
      },
      '^3.13.0': {
        components: [
          '3.13.arbitraryGroupName',
          '3.13.default'
        ]
      }
    }
  }
};
