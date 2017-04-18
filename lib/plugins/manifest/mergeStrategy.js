'use strict';

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
  strategizeComposition(elementName, semverValue, compositionDraft) {
    // Get the ordered items
    const semverishObject = this.getConverterClass().getSemverishObject();
    const items = this.getManifestComponents()[elementName][semverValue].components;
    // Get the objects from the semverish Origin. and key them by their key.
    const tmpObject = {};
    items.forEach((item) => {
      tmpObject[item] = _.cloneDeep(_.get(semverishObject, item));
    });
    // Merge items in.
    const newThing = _.reduce(tmpObject, _.merge);
    _.set(compositionDraft, `${semverValue}.${elementName}`, newThing);

    return compositionDraft;
  }
};
