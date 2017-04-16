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

  const manifestConfig = configLoader(tmpConfigNameSpace, tmpConfig);

  const configDeducedPlugins = [];

  // Now forumlate plugins according to config.
  // Are we supporting defaults.
  if (manifestConfig.semveristBehaviors.default) {
    // supporting defaults add default plugins.
    configDeducedPlugins.push(plugins.manifest.defaultManifestComponents);
  }
  // Are we supporting groups
  if (manifestConfig.semveristBehaviors.groups) {
    // supporting Groups add group plugins.
    configDeducedPlugins.push(plugins.manifest.groupManifestComponents);
  }
  // Is this a directory or object?
  // if (manifestConfig.converterType === 'directory') {
    // use directoryConverter and directory classes
  // }
  // else {
    // Use config or object classes.
  // }
  // What is our strategy merge or replace?
  // if (manifestConfig.semveristBehaviors.mergeStrategy === 'merge') {
    // use merge class
  // }
  // else {
    // use replace
  // }

  // save this until we get to resolved below,
  // then add that as the last item in the array
  // then reduce pass them into each other and return as setUp below.

  const molotov = new Molotov();
  let setUp;
  if (pluginName) {
    setUp = molotov.getMolotov() // Ensures we get any superOverrides from config.
      .then(pluginMaker => pluginMaker.resolve())
      .then((resolved) => {
        const dumpy = configDeducedPlugins.reduce(
          (mixClass, mixin) => mixin(mixClass),
          resolved.manifest[pluginName]
        );
        // At this point we haver our super wrapped in our plugin
        // so we can add our on the fly composed plugins around that.
        return dumpy;
      }
    );
  }
  else {
    setUp = molotov.getSupers()
      .then((superClasses) => {
        const dumpy = configDeducedPlugins.reduce(
          (mixClass, mixin) => mixin(mixClass),
          superClasses.manifest
        );
        return dumpy;
      }
    );
  }

  return setUp.then(extendedClass => class manifest extends extendedClass {
    init() {
      super.init(manifestConfig);
    }
    setManifestComponents() {
      this.manifestComponents = {};
      super.setManifestComponents();
    }

    static createConverter(converterSource) {
      const staticConfig = this.getManifestConfig();
      let converter;
      if (staticConfig.converterType === 'directory') {
        // use directoryConverter and directory classes
        converter = converterFactory('semverist', 'directoryConverter')
          .then((ConverterClass) => {
            const converterClass = new ConverterClass();
            converterClass.init(converterSource, staticConfig);
            return converterClass.createConverter();
          }
        );
      }
      else {
        // Use config or object classes.
        converter = converterFactory('semverist', 'converter')
          .then((ConverterClass) => {
            const converterClass = new ConverterClass();
            converterClass.init(converterSource, staticConfig);
            return converterClass.createConverter();
          }
        );
      }
      return converter;
    }

    static getManifestConfig() {
      return manifestConfig;
    }
  });
};

