'use strict';

// Range objects are created by the range class.
// They are composed with information available to the range
// (1value -> 2nd value || 1 value)
// but can be further enhanced by other ranges interacting with
// this range through the converter object.
// The converter object needs to gather all possible ranges for a
// semverist element and feed them information about each other
// so that the range can have a correct range.range value and
// thus can be ordered and accounted for correctly within
// the semverist inspector object.

const range = {  // eslint-disable-line no-unused-vars
  range: '>= 1.0.0 <1.1.0 >1.2.0 > 1.2.0-alpha <2.0.0',
  semveristElementType: 'attribute',
  lowerBounds: '1.0.0', // a fully realized semver string value extracted from the semverish that serves as the lower bounds of this range.
  semveristElement: 'entity', // the semverist element this range relates to - can influence the options retrieved for this semverist element and thus the behavior of the range.
  semverishValue: '1', // The actual semverish value on which this range is based and the sorting value for this range.
  exceptions: [
    '1.1',
    '1.2.0'
  ],
  exceptionRange: '<1.1.0 >1.2.0'
};
