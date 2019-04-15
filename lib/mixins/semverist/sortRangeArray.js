const semverUtils = require('semver-utils');
const semver = require('semver');
const _ = require('lodash');
const toSemver = require('version-comparison/lib/toSemver');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 * @param {Class} superclass
 * A super class or mixed in super class.
 * @returns {Class}
 *   A mixed in class.
 */
module.exports = superclass =>
  class extends superclass {
    /**
     * Sorts an array of ranges.
     *
     * @param {array} rangeArray - An array of range strings.
     * @returns {array} - A sorted array of range string.
     */
  sortRangeArray(rangeArray) {  // eslint-disable-line
      // Create an Object
      const tmpObject = {};
      // stringify each item in the range.
      if (rangeArray && _.isArray(rangeArray)) {
        rangeArray.forEach(value => {
          const tmpRange = semverUtils.parseRange(value);
          // first item in tmpRange is the low part of the range.
          // get rid of semver and operator. join the rest of the values.
          const first = tmpRange[0];
          delete first.semver;
          delete first.operator;
          // The range is the key and this simplified value is the value.
          tmpObject[value] = semverUtils.stringify(first);
        });
      } else {
        throw new Error('Can not sort a range Array that is not a range.');
      }
      // return the sorted ranges, such wow.
      return this.constructor.semverishSort(tmpObject);
    }

    /**
     * Sorts a semverishArray.
     *
     * @param {Array} semverishArray
     *   An array of semverish values to sort.
     * @returns {Array}
     *   The semverish array that was passed in but sorted according to semver.
     */
    sortSemverishArray(semverishArray) {
      // Create an Object
      const tmpObject = {};

      // stringify each item in the range.
      if (semverishArray && _.isArray(semverishArray)) {
        semverishArray.forEach(value => {
          tmpObject[value] = this.valueToSemver(value);
        });
      } else {
        throw new Error(
          'Can not sort a semverish Array that is not actually range.'
        );
      }

      return this.constructor.semverishSort(tmpObject);
    }
    /**
     * Sorts semverish items.
     *
     * @static
     * @param {any} tmpObject
     *   An object keyed by semver strings with semverish values.
     * @returns {Array}
     *   A sorted semverish array.
     */
    static semverishSort(tmpObject) {
      // Are all the values unique?
      // key count
      const keyCount = Object.keys(tmpObject).length;
      const sortedArray = [];
      const invertTmp = _.invert(tmpObject);
      const sorter = semver.sort(Object.keys(invertTmp));
      // Turn sorted array into sorted ranges.
      sorter.forEach(value => sortedArray.push(invertTmp[value]));
      // Now get unique values count.
      if (keyCount !== _.uniq(_.values(tmpObject)).length) {
        // OK, this could be a pickle, if we are in ranges. Let's test.
        let sentinelTruth = true;

        Object.keys(tmpObject).forEach(value => {
          if (!semver.valid(value) && semver.validRange(value)) {
            try {
              toSemver(value);
            } catch (error) {
              sentinelTruth = false;
            }
          }
        });

        if (sentinelTruth) {
          // We have an array of semver.
          const count = sortedCount =>
            sortedCount.reduce(
              (a, b) => Object.assign(a, { [b]: (a[b] || 0) + 1 }),
              {}
            ); // eslint-disable-line max-len
          const duplicates = dict => Object.keys(dict).filter(a => dict[a] > 1);
          // For each of the items in this array represents a value
          // that is a dupe.
          const dupes = duplicates(count(_.values(tmpObject)));

          dupes.forEach(value => {
            // Get all semverish keys with this value.
            const allOccurences = _.filter(
              Object.keys(tmpObject),
              semverish => tmpObject[semverish] === value
            );
            // Find the position of the item in sorted array.
            const originalValue = _.intersection(sortedArray, allOccurences)[0];
            const originalLocation = sortedArray.indexOf(originalValue);
            // Sort those items
            const keySort = _.orderBy(
              allOccurences,
              newValue => newValue.length,
              'asc'
            );
            // splice replace them in sorted
            // Now splice in values.
            const args = [originalLocation, 1].concat(keySort);
            Array.prototype.splice.apply(sortedArray, args);
          });
        } else {
          // We have an array of semverRanges.
          // OK this is a pickle, the starting values have some similarities.
          // While there can only be one key of the same semverist element at
          // any position in the hierarchy, we can have multiple items implying
          // the same value. i.e. 1, 1.0, and 1.0.0 all semver resolve to 1.0.0.
          // These would work out as child exceptions where applicable. i.e.
          // 1.0.0 and 1.0 would be child exceptions to 1 and so forth.
          // So with range sorting we have to consider this.
          // Now because of the crawling and how we expect for this to be handled,
          // we can expect that these similar starting ranges will be sorted
          // by semverish where shorter semverish sink and longer semverish rise.
          // i.e. 1 is heavier than 1.0.0-alpha. So we are going to take that
          // into account when sorting.
          //
          // If the above if statement has brought us here we do have this case.
          // Our sortedArray has placed the occurence of this shared value
          // correctly. However because of the object inversion we only have
          // one occurence of this key. So we are going to do some manipulation
          // to get the original ranges And then we are going to splice them
          // into the sorted array.
          const count = sortedCount =>
            sortedCount.reduce(
              (a, b) => Object.assign(a, { [b]: (a[b] || 0) + 1 }),
              {}
            ); // eslint-disable-line max-len
          const duplicates = dict => Object.keys(dict).filter(a => dict[a] > 1);
          // For each of the items in this array represents a value
          // that is a dupe.
          const dupes = duplicates(count(_.values(tmpObject)));
          const counts = count(_.values(tmpObject));
          let offset = 0;
          // Now find the position of this dupe in sorter.
          dupes.forEach(value => {
            // Find a value in sorter.
            const index = sorter.indexOf(value);
            const forInserting = [];
            Object.keys(tmpObject).forEach(key => {
              if (tmpObject[key] === value) {
                // This matches so lets collect for inserting.
                forInserting.push(key);
              }
            });
            // Now splice in values.
            const args = [index + offset, 1].concat(forInserting);
            Array.prototype.splice.apply(sortedArray, args);
            // Increase the offset now that we have added to the sortedArray
            offset += counts[value] - index;
          });
        }
      }
      // return the sorted ranges, such wow.
      return sortedArray;
    }
  };
