

const semverUtils = require('semver-utils');
const _ = require('lodash');

/**
 * This is a manifest plugin
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
module.exports = superclass => class extends superclass {
  /**
   * Writes the composition for the manifest to an object.
   *   Calls any supers if they exist to write or alter
   *   the written composition after.
   * @returns {void}
   */
  writeComposition() {
    // Get semver realizations, For each semver realization
    const realizations = this.getConverter().semverRealizations;
    // Get manifest components.
    const components = this.getManifestComponents();
    // Get keys for those components, which will be semverist attributes.
    const componentKeys = Object.keys(components);
    // Start our composition draft.
    let compositionDraft = {};
    // Create semver hierarchies.
    compositionDraft = this.createSemverHierarchy(compositionDraft);
    // Now For each element in the converter, get this realization if present.
    componentKeys.forEach((key) => {
      // Now for each realization set the components.
      realizations.forEach((semverValue) => {
        if (components[key][semverValue]) {
          // We do have an item. Prioritize it.
          this.prioritizeComponent([key, semverValue]);
          // Now that its been prioritized create it in its place.
          this.strategizeComposition(key, semverValue, compositionDraft);
        }
      });
    }, this);

    // then set composition.
    this.setComposition(compositionDraft);
    // then if super() call super.;
    if (super.writeComposition) super.writeComposition();
  }

  /**
   * Creates the semver hierarchy that corresponds to the
   *   semver realizations captured in the converter.
   *
   * @param {Object} draft - A composition draft.
   * @returns {Object} - The draft after the hierarchy has
   *   been added.
   */
  createSemverHierarchy(draft) {
    // For each semver realization
    this.getConverter().semverRealizations.forEach((realization) => {
      // Parse each semver item and make hierarchy.
      const tmpParsed = semverUtils.parse(realization);
      let tmpPath = realization;
      // Will handle any revisions to the path.
      tmpPath = this.constructor.pathBuildImprovement(tmpParsed);
      _.setWith(draft, tmpPath, {}, Object);
    });
    return draft;
  }

  /**
   * Revises the path to handle any special cases.
   *   Can be a place for super overrides to modify
   *   the path for special prereleases and the like.
   *
   * @static
   * @param {Object} parsedPath - A semver utils parsed
   *   path.
   * @returns {string} - A valid object path.
   */
  static pathBuildImprovement(parsedPath) {
    if (parsedPath.build) {
      const tmpBuild = parsedPath.build;
      delete parsedPath.build;
      return semverUtils.stringify(
        parsedPath
      ).concat(`.${tmpBuild}`);
    }

    return super.pathBuildImprovement(semverUtils.stringify(parsedPath));
  }
};
