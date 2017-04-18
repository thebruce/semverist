'use strict';

const requireDirectory = require('require-directory');
const converterFactory = require('../converter/converter');

// Require plugins directory. We will need this to roll
// our own composer or insprectors depending on config.
const plugins = requireDirectory(module, '../plugins');

const configLoader = require('../configLoader');
const Molotov = require('../molotov');

module.exports = function manifestFactory(pluginName, configNameSpace, config) {
  // Get (namespaced or default) config from config loader.
  let tmpConfig;
  let tmpConfigNameSpace;

  if (config) {
    tmpConfig = config;
  }

  if (configNameSpace) {
    tmpConfigNameSpace = configNameSpace;
  }

  // We are going to add plugin capabilities to our manifest supers
  // and implementations (composer and inpsectors) based on configuration.
  // There are simply too many combinations of these to lay them out
  // in plugin (mixin) layers, so we will maintain just the capabilities for
  // a composer or inspector in plugin layers and dynamically stuff
  // capabilities into the super before hand here.

  // Call the config loader which will merge config and create config
  // from defaults.
  const manifestConfig = configLoader(tmpConfigNameSpace, tmpConfig);

  // This is our array where we stuff in mixins.
  const configDeducedPlugins = [];

  // This capability will be added to all manifest supers.
  configDeducedPlugins.push(plugins.manifest.manifestSortArray);

  // Now forumlate plugins according to config.
  // Q1: Are we supporting defaults.
  if (manifestConfig.semveristBehaviors.default) {
    // supporting defaults add default plugins.
    configDeducedPlugins.push(plugins.manifest.defaultManifestComponents);
  }
  // Q2: Are we supporting groups
  if (manifestConfig.semveristBehaviors.groups) {
    // supporting Groups add group plugins.
    configDeducedPlugins.push(plugins.manifest.groupManifestComponents);
  }
  // Q3: Is this a directory or object?
  // if (manifestConfig.composer.composerType === 'default') {
    // use directoryConverter and directory classes
  configDeducedPlugins.push(plugins.manifest.objectWriter);
  // }
  // else {
    // Use config or object classes.
  // }

  // Q4: What is our strategy merge or replace?
  if (manifestConfig.semveristBehaviors.mergeStrategy === 'merge') {
    // use merge class
    configDeducedPlugins.push(plugins.manifest.mergeStrategy);
  }
  // else {
    // use replace
  // }

  // Q5: What is our priority?
  // if (manifestConfig.composer.priority === 'default') {
  configDeducedPlugins.push(plugins.manifest.defaultPriority);
  // }

  // save this until we get to resolved below,
  // then add that as the last item in the array
  // then reduce pass them into each other and return as setUp below.

  const molotov = new Molotov();
  let setUp;
  // If we have a plugin, such as composer or inspector.
  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then((resolved) => {
        const dynamicMixinLoad = configDeducedPlugins.reduce(
          (mixClass, mixin) => mixin(mixClass),
          resolved.manifest[pluginName]
        );
        // At this point we have our super wrapped in our plugin
        // so we can add our on the fly composed plugins around that.
        return dynamicMixinLoad;
      }
    );
  }
  else { // If not we will only add our deduced plugins based on config.
    setUp = molotov.getSupers()
      .then((superClasses) => {
        const dynamicMixinLoad = configDeducedPlugins.reduce(
          (mixClass, mixin) => mixin(mixClass),
          superClasses.manifest
        );
        return dynamicMixinLoad;
      }
    );
  }

  return setUp.then(extendedClass => class manifest extends extendedClass {
    /**
     * Creates an instance of manifest.
     * @param {Object} converter - A converter Object.
     * @param {Object} converterClass - A converter class.
     */
    constructor(converter, converterClass) {
      super(manifestConfig);
      this.setConverter(converter);
      this.setConverterClass(converterClass);
    }

    init() {
      // Set capabilities for this manifest.
      this.setManifestCapabilities();

      super.init();
    }

    /**
     * Set manifest components for this manifest. Which will
     *   contain all semverist elements from the semverish object
     *   and the instances where they occur at the various
     *   semverish realizations containing all of the semverist
     *   elements (defaults, groups, and attributes) which can
     *   apply according to config - the priorities, strategies
     *   and enabled elements.
     *
     */
    setManifestComponents() {
      this.manifestComponents = {};
      super.setManifestComponents();
    }

    /**
     * Static converter creator to supply manifest class
     *   with its converter object and class.
     *
     * @static
     * @param {SemveristObject} converterSource -
     *
     * @returns {Promise.Array} converterPromise - An array
     *   of converter object and the converter class. Which returns
     *   the appropriate object or directory version of a converter.
     */
    static createConverter(converterSource) {
      const staticConfig = this.getManifestConfig();
      let converter;
      if (staticConfig.converterType === 'directory') {
        // use directoryConverter and directory classes
        converter = converterFactory('semverist', 'directoryConverter')
          .then((ConverterClass) => {
            const converterClass = new ConverterClass();
            converterClass.init(converterSource, staticConfig);
            return Promise.all([
              converterClass.createConverter(),
              converterClass
            ]);
          }
        );
      }
      else {
        // Use config or object classes.
        converter = converterFactory('semverist', 'converter')
          .then((ConverterClass) => {
            const converterClass = new ConverterClass();
            converterClass.init(converterSource, staticConfig);
            return Promise.all([
              converterClass.createConverter(),
              converterClass
            ]);
          }
        );
      }
      return converter;
    }

    /**
     * Gets the config for the manifest created during the factory based on
     *   the config namespace.
     * @static
     * @returns {Object} - configuration for the semverist.
     */
    static getManifestConfig() {
      return manifestConfig;
    }

    /**
     * Assigns the converter class for this manifest.
     *
     * @param {Object} converterClass - A converter class.
     */
    setConverterClass(converterClass) {
      this.converterClass = converterClass;
    }

    /**
     * Returns the converter for this manifest.
     *
     * @returns {Object}
     */
    getConverterClass() {
      return this.converterClass;
    }
  });
};

