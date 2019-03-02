const klawSync = require('klaw-sync');
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');

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
     * Sets this.semveristElement to the passed string.
     *
     * @param {string} semverishDirectoryPath
     *   An string representing a path to a semverish directory.
     * @returns {void}
     */
    setSemverishObject(semverishDirectoryPath) {
      const root = path.join(
        this.getSemveristConfig().callPath,
        semverishDirectoryPath
      );
      const semverishObject = {};
      const pathology = path.join(
        this.getSemveristConfig().callPath,
        semverishDirectoryPath
      );
      // Walk this directory for directories.
      const directories = klawSync(pathology, { nofile: true });
      // create directories.
      const filterPattern = new RegExp(
        this.getSemveristConfig().directoryFileIgnorePattern
      );
      const filterFn = function filterFn(item) {
        return filterPattern.test(item.path);
      };
      const separator = this.constructor.getPathSeparatorRegEx(path.sep);
      directories.forEach(pather => {
        const test = pather.path
          .replace(`${root}${path.sep}`, '')
          .replace(separator, '.');
        _.setWith(semverishObject, test, {}, {});
      });
      // GO through array and create paths from the directory.
      const files = klawSync(pathology, { nodir: true, filter: filterFn });
      // create objects for files.
      files.forEach(pather => {
        const pathSuffix = pather.path.replace(`${root}/`, '');
        const testName = path.basename(pathSuffix, path.extname(pathSuffix));
        const testLocation = path.dirname(pathSuffix).replace(/\//g, '.');
        // Read in file.
        const fileContents = fs.readJsonSync(pather.path, { throws: false });
        _.setWith(
          semverishObject,
          `${testLocation}.${testName}`,
          fileContents,
          {}
        );
      });
      this.semverishObject = semverishObject;
      if (super.setSemverishObject) super.setSemverishObject(semverishObject);
    }

    /**
     * Gets a regex separator.
     *
     * @static
     * @param {string | null} separator
     *   A separator string.
     * @returns {regexp}
     *   A regular expression for the passed separator.
     */
    static getPathSeparatorRegEx(separator) {
      if (separator === '/') {
        return /\//g;
      }
      return /\\/g;
    }
  };
