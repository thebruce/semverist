'use strict';

const semverUtils = require('semver-utils');
const _ = require('lodash');

/**
 * This is a semverist plugin for set/geting the semverist element.
 * It is self-contained.
 *
 * Mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = superclass => class extends superclass {
  writeComposition() {
    // get semver realizations, For each semver realization
    const realizations = this.getConverter().semverRealizations;
    const components = this.getManifestComponents();
    const componentKeys = Object.keys(components);
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

  createSemverHierarchy(draft) {
    this.getConverter().semverRealizations.forEach((realization) => {
      // Parse each semver item and make hierarchy.
      const tmpParsed = semverUtils.parse(realization);
      let tmpPath = realization;
      tmpPath = this.constructor.pathBuildImprovement(tmpParsed);
      _.setWith(draft, tmpPath, {}, Object);
    });
    return draft;
  }

  static pathBuildImprovement(parsedPath) {
    if (parsedPath.build) {
      const tmpBuild = parsedPath.build;
      delete parsedPath.build;
      return semverUtils.stringify(
        parsedPath
      ).concat(`.${tmpBuild}`);
    }
    return semverUtils.stringify(parsedPath);
  }
};
