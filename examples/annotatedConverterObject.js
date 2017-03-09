'use strict';

// This is the raw ranges before merging but with inheritence and
// lazy semverist considered.
const converterObject = { // eslint-disable-line
  default: {
    default: { // the name of default, by default it's...default!
      '0.0.0 < 1.0.0': // Keyed by the range that this value satisfies.
        '0' // The location of the default Object that should be used for this range.
    }
  },
  groups: {  // A collection of groups for this semverist Object.
    groupName1: { // A group name
      '0.0.0 <= 0.4.5': // Keyed by a range that the value satisfies.
        '0.0.0', // the location of groupName1 that will be used for this range key.
      '> 0.4.5': // Another key, keyed by a range that its value satisfies.
        '0.4.5'  // the location of groupName1 that will be usef for this range key
    },
    groupName2: {
      '> 0.0.0 || ^1.0.0': // Keyed by a range that the value satisfies.
         '0.0.0' // the location of groupName 2 that will be used for this range key.
    }
  },
  attributes: {
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
