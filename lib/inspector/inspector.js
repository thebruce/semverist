// The work of the inspector is to create an information object that can
// answer questions about the elements within / and/or provide instructions to
// the composer to flesh out the schema object correctly.

// setSrc will have mixins. super setSrc will take a value
// (an object), validate it,.

// setSrc will have two mixins for now which is config, which will
// pass along the config namespace
// setSrc directories will pass along a path to load the directory

// validateSrc

const poirot = class {
  /**
   * Sets the src for this inspector.
   *
   * @param {any} source
   *   A source.
   * @returns {void}
   */
  setSrc(source) {
    this.src = source;
    if (super.setSrc) super.setSrc(source);
  }

  /**
   * Returns the source for this inspector.
   *
   * @returns {any}
   *  Returns a source for this inspector.
   */
  getSrc() {
    return this.source;
  }
};

module.exports = poirot;
