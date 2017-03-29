'use strict';

// This is the raw ranges before merging but with inheritence and
// lazy semverist considered.
const converterObject = { // eslint-disable-line
  semverRealizations: [ // Both implied and fully declared semantic versions in the semverish object.
    '0.0.0',
    '0.4.5',
    '1.0.0'
  ],
  default: {
    default: { // the name of default, by default it's...default!
      '0.0.0 < 1.0.0': { // Keyed by the range that this value satisfies.
        range: '0.0.0 < 1.0.0',
        lowerBounds: '0.0.0', // a fully realized semver string value extracted from the semverish that serves as the lower bounds of this range.
        upperBounds: '< 1.0.0', // a fully realized semver string value extracted from the semverish value and then tempered by any terminal bounds from the range object.
        semveristElement: 'default', // the semverist element this range relates to - can influence the options retrieved for this semverist element and thus the behavior of the range.
        semverishValue: '0', // The actual semverish value on which this range is based and the sorting value for this range.
        childrenSemverish: []
      }
    }
  },
  group: { // A collection of groups for this semverist Object.
    groupName1: { // A group name
      '>= 0.0.0 < 0.4.5 > 0.4.5 < 1.0.0': {// Keyed by a range that the value satisfies.
        range: '0.0.0 <= 0.4.5',
        lowerBounds: '0.0.0', // a fully realized semver string value extracted from the semverish that serves as the lower bounds of this range.
        upperBounds: '0.4.5', // a fully realized semver string value extracted from the semverish value and then tempered by any terminal bounds from the range object.
        semveristElement: 'groupName1', // the semverist element this range relates to - can influence the options retrieved for this semverist element and thus the behavior of the range.
        semverishValue: '0.0', // The actual semverish value on which this range is based and the sorting value for this range.
        childrenSemverish: [ // child ranges found in the overall semverist object we are considering that satisfy this range.  These values would create exceptions in this semver range based on inheritence rules.
          '0.4.5',
        ]
      },
      '0.4.5': {// Another key, keyed by a range that its value satisfies.
        range: '0.4.5',
        lowerBounds: '0.4.5', // a fully realized semver string value extracted from the semverish that serves as the lower bounds of this range.
        upperBounds: '0.4.5', // a fully realized semver string value extracted from the semverish value and then tempered by any terminal bounds from the range object.
        semveristElement: 'groupName1', // the semverist element this range relates to - can influence the options retrieved for this semverist element and thus the behavior of the range.
        semverishValue: '0.4.5', // The actual semverish value on which this range is based and the sorting value for this range.
        childrenSemverish: []
      }
    },
    groupName2: {
      '> 0.0.0 || ^1.0.0': // Keyed by a range that the value satisfies.
        '0.0.0' // the location of groupName 2 that will be used for this range key.
    }
  },
  attribute: {
    entity1: {
      '0.0.0 <= 1.0.0': // Keyed by a range that the value satisfies.
        '0.0.0' // the location of entity1 that will be used for this range key.
    },
    entity2: {
      '0.0.0 < 1.0.0 || > 1.0.0 < 2.0.0': // Keyed by a range that the value satisfies.
        '0.0.0' // the location of entity2 that will be used for this range key.
    },
    entity3: {
      '>= 0.5.0 < 1.0.0': // Keyed by a range that the value satisfies.
        '0.5.0' // the location of entity3 that will be used for this range key.
    }
  }
};
