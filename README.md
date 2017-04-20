# semverist

Intelligent Semver-based hierarchy processing

[![Build Status](https://img.shields.io/https://travis-ci.org/thebruce/semverist.svg?branch=master?style=flat-square)](https://travis-ci.org/thebruce/semverist)
[![Coverage Status](https://img.shields.io/https://coveralls.io/repos/github/thebruce/semverist/badge.svg?branch=master?style=flat-square)](https://coveralls.io/github/thebruce/semverist?branch=master)
[![Semantic Release](https://img.shields.io/https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

The Semverist provides a uniform interface for understanding and manipulating directories, config, and objects with a semver based hierarchy.

The Semverist provides a uniform interface for understanding and manipulating directories, config, and objects with a semver based hierarchy.

We work better when we work together. So, the Semverist is two powerful components working together. The first is an inspector, Poirot, and the second a composer, Schoenberg. These two components will allow you to construct richly populated semver hierarchies with reduced maintenance, bloat, and only meaningful additions.

## Contents
- [Usage](#usage)
- [Semverist Components](#semverist-components)
- [What is a semverist object?](#what-is-a-semverist-object)
- [Capabilities: defaults](#capabilities-defaults)
- [Capabilities: groups](#capabilities-groups)
- [Capabilities: attributes](#capabilities-attributes)

## Usage
See the config example for options:

```
const schoenberg = require('semverist/schoenberg');
const nestedConfig = {
  "semverist": {
    "exampleNameSpace": {
      "yourConfiguration": "See config example."
    }
  }
};

const semveristComposer = schoenberg(
  semverishObject,  // A semverish object or path according to config.
  nestedConfig.semverist, // Passing in config in this example but can use config/
  'exampleNameSpace'
)
.then((composer) => {
  // Now you have a composer class and can assemble your semverish objects.
  // Like so.
  composer.assembleManifest();
  return composer.getComposition();
})
```

## Semverist Components

### Schoenberg, the composer
The Semverist composer builds a fleshed out object from the Semverist inspector with support for defaults, arbitrary groups and attribute/file overides or stubs. It also features lazy semver, a companion to API versioning best practices and lazy configuration inheritence that allows for minimal definition and maintenance but maximum impact.

### Poirot, the inspector (COMING SOON)
The Semverist inspector can tell you about the attributes/files in the sember shaped object/directory you pass to the Semverist. It can:
* Tell you the semver number of the last occurence of an attribute in a semver object/directory.
* Tell you whether an attribute/file exists for a given semver range/value.
* Tell you what elements form a given attribute file for a given semver.
* Tell you the location w/in the semver hierarchy of the attribute for a given semver range (in the case of lazy semver)
* Tell you the semver range for an attribute, default, or group.
* Tell you the first occurence of a given attribute /file in this semver object/directory.


## What is a semverist object?

### The Semverist Object: What is a semver shaped hierarchy?

Semver is an extremely useful versioning standard whose declarative syntax helps machine and human readers to set package and software version use in a sane format. Read about semver at [http://semver.org/](http://semver.org/). Semver is not only useful for package versions however, using its declarative ranges within configuration, objects and directories is an awesome way to relate configuration, metadata, scripts, and schemas to constantly evolving services and software. The semverist was born out of a need to reliably deal with these realizations in objects and directories.

The semverist object is declarative and meant to be useful to both Inspector, Poirot and Composer, Schoenberg. Additional utility is provided by defaults and groups and lazy semver funcitonality but even without these concepts you will still be able to inspect and learn about the semverist object you have and build it out with the correct composition.

A semver object might take the shape of:
```
{
  1: {
    0: {
      0: {
        attributeOfVersion100: 'value',
        'thing': 'thingValue100'
      },
      1: {
        attributeOfVersion101: 'value',
        'thing': 'thingValue101'
      }
    }
    1: {
      0: {
        attributeOfVersion110: 'value',
        'thing': 'thingValue110'
      }
    }
  }
  2: {
    0: {
      0: {
        attributeOfVersion200: 'value',
        'thing': 'thingValue200'
      }
    }
  }
}
```

A semver shaped directory with similarly named children might look like the following:
```
|-- 1
|   |-- 0
|   |   |-- 0
|   |   |   |-- file100.json
|   |   |   |-- thing.json
|   |   |-- 1
|   |   |   |-- file101.json
|   |   |   |-- thing.json
|   |-- 1
|   |   |-- 0
|   |   |   |-- file110.json
|   |   |   |-- thing.json
|-- 2
|   |-- 0
|   |   |-- 0
|   |   |   |-- file200.json
|   |   |   |-- thing.json
```

## Capabilities: Defaults

### The Semverist Object: Defaults
Semverist Objects can utilize default overrides for all children objects/files. When combined with lazy semver it can create powerful inheritence structures with less effort or mirror best practice api behavior for documentation or schemas.
Defaults in objects can be used as base definitions for attributes when used with lazy semver and can act as stubs, when used with directories of json files they again can provide defaults. Defaults can be used to override or stub out empty attributes or empty files as well increasing the possiblities for richly inherited data shapes in the semverist object.

#### Defaults confer some inheritence based on the level of the hierarchy in which they are placed.

| Default Location | Applies to Major Children  | Applies to Minor Children  | Applies to Patch Children | Applies to this Patch only  |
|---|---|---|---|---|
| Root  | X  | X  | X | -  |
| Major Version  | -  | X  | X | -  |
| Minor Version | -  | -  | X  | -  |
| Patch Version  | - | -  | -  | X  |

#### Overriding defaults with other defaults

Defaults are merged into the resulting attribute/file according to the merge strategy you have chosen. Thus a default that shares the same shape of a default set at a higher level will overwrite the higher level default for the children it affects. 
Example:
We start with a default in 1, which applies to all minor and patch children.
```
{
  1: {
    "default": {
      "test": "value"
    },
    0: {
      0:{
        "item":{}
      }
    }
  }
}
```
In the above case with a mergeStrategy of last in we would expect that item would have the following value when built by the composer, Schoenberg:
```
item: {
  "test": "value"
}
```
However, lets override the default at level 1, with one at level 1.0 like so:
```
{
  1: {
    "default": {
      "test": "value"
    },
    0: {
      "default": {
        "test": "otherValue"
      }
      0:{
        "item":{}
      }
    }
  }
}
```
In this new case with a mergeStrategy of last in we would expect that item would have the following value when built by the composer, Schoenberg:
```
item: {
  "test": "otherValue"
}
```
This is so because the minor version's defaults apply to patch version children and with the last in merge strategy the default at the minor level overrides the default at the major level.

In a directory situation this takes a similar shape but with files. Where the contents of a file will be merged according to your merge strategy. Let's take a look at an example for directories:

Let's imagine a default text file with the following contents:  `This is a {{text}} file` represented by default.txt in the following directory structure:

```
|-- 1
|   |-- default.txt (a file with the text `This is a {{text}} file`)
|   |-- 0
|   |   |-- 0
|   |   |   |-- file1.txt (an empty file)
|   |   |-- 1
|   |-- 1
|   |   |-- 0
|   |   |   |-- file2.txt (a file with the text `I already have text`)
```

With a merge strategy of `replace` we would expect the following output:

| File | Contents after Schoenberg merges according to merge strategy.  |
|---|---|
| file1.txt  | `This is a {{text}} file`  |
| file2.txt   | `I already have text` |

File 2 does not take the default.txt values because it already had values in it and replace will use the last in to overwrite.

Lets add an additional default.txt file and another empty file to see a more complex example.

```
|-- 1
|   |-- default.txt (a file with the text `This is a {{text}} file`)
|   |-- 0
|   |   |-- default.txt (a file with the text `This is a {{otherText}} file`)
|   |   |-- 0
|   |   |   |-- file1.txt (an empty file)
|   |   |-- 1
|   |-- 1
|   |   |-- 0
|   |   |   |-- file2.txt (a file with the text `I already have text`)
|   |   |   |-- file3.txt (an empty file)
```

With a merge strategy of `replace` we would expect the following output:
| File | Contents after Schoenberg merges according to merge strategy.  |
|---|---|
| file1.txt  | `This is a {{otherText}} file`  |
| file2.txt   | `I already have text` |
| file3.txt  | `This is a {{text}} file`  |

File 1 inherits the default.txt contents from the nearest parent, in this case the minor version where we added the new default. File 2 remains unchanged in this merge strategy and File 3 inherits from the nearest default.txt located in a parent, which is the original default.txt we placed in the major version folder.


## Capabilities: Groups

### The Semverist Object: Schoenberg Groups
Semverist objects can utilize aribitrary groups of overrides for select objects/directories. This works a lot like defaults but instead of applying to every item underneath it in the hierarchy it only applies to items below it that are indicated for the group. For config and directories this is typically indicated inside the group object which functions fairly similarly to defaults. For directories groups are folders nested in the semver hierarchy including the files that belong to the group.

## Capabilities: Attributes

### The Semverist Object: attributes
Named item overides applying to specific object/directories within a semver object/directory.

The Semverist will inspect your directories/objects & tell you about them with Poirot and masterfully compose them with Schoenberg.

## Lazy Semver

### The power of laziness now brought to your semver experience.
Lazy Semver allows you to create schema items once and inherit them until they change mirroring API versioning best practices. The lazy semver configuration option allows you to inherit properties up through a major version overriding and overwriting with defaults, groups, and redeclarations. This can be very useful for setting attributes once per major version of semver and lowering maintenance tasks and copy/paste type errors.
API

<a name="module_configLoader"></a>

## configLoader
A module to load configuration for the semverist.


* [configLoader](#module_configLoader)
    * [configLoader(configNameSpace, configs)](#exp_module_configLoader--configLoader) ⏏
        * [~semveristBehaviors](#module_configLoader--configLoader..semveristBehaviors) : <code>Object</code>

<a name="exp_module_configLoader--configLoader"></a>

### configLoader(configNameSpace, configs) ⏏
Initializes the manifest class.

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| configNameSpace | <code>string</code> | A namespace in configuration   to draw configuration from for this manifest. |
| configs | <code>semveristBehaviors</code> | A configurtion override   object. [semveristBehaviors](semveristBehaviors) |

<a name="module_configLoader--configLoader..semveristBehaviors"></a>

#### configLoader~semveristBehaviors : <code>Object</code>
The semverist Behavior object. A part of semverist configuration
which if provided from the config module should be namespaced to
'semverist'.

**Kind**: inner typedef of <code>[configLoader](#exp_module_configLoader--configLoader)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| inheritence | <code>boolean</code> | <code>semverImplied</code> | (null|semverImplied|lasySemverist) Enables inheritence for   the semverist object composer. Can be 1) null, or no   inheritence, 2) semverImplied the default   in which Parent semverist elements are inherited to   their child leaves unless they are overridden by another   instance of the same semverist element. Inheritence does not   cross over from parent to its siblings or 3) lazySemverist which Affects   inheritence by treating   the the highest semver occurence of a semverist element (elements   indicated below), as the element to inherit from for all future   parent and children leaves until specifically overriden by another   instance of the same semverist element. Adjacent higher siblings   in the semverist object can inherit elements from a previous sibling or   its children. |
| lazySemverist | <code>Object</code> |  | Configuration for lazySemverist   behavior. This is only in effect if the inheritence is   lazySemverist. |
| lazySemverist.preReleaseForwards | <code>boolean</code> | <code>false</code> | If true   allows lazy semverist enabled semverist elements to carry forward from   prereleases. |
| lazySemverist.attributes | <code>boolean</code> | <code>true</code> | Applies   lazySemverist inheritence to the semverist element, attributes.   Currently this is the only kind of lazySemverist though we plan to add   groups and defaults as well. |
| default | <code>boolean</code> | <code>true</code> | Enables default semverist   elements to influence semverist composer inheritence and merge   strategies. |
| defaultName | <code>string</code> | <code>&quot;default&quot;</code> | An override name for   defaults.Semverist elements with this name will be utilized as   defaults. |
| groups | <code>boolean</code> | <code>true</code> | Enables group semverist   elements to influence semverist composer inheritence and   merge strategies. |
| mergeStrategy | <code>string</code> | <code>&quot;lastIn&quot;</code> | Sets the mergeStrategy   for use with semverist composer realizations of semverist   element attributes. |
| preReleasePattern | <code>RegExp</code> |  | A regex pattern to use to   match your prerelease naming and versioning. Please   note that any item that the bounds of your prerelease pattern could   create conflicts with your semverist attribute names. Please be sure   to tightly cordon off your patterns. |


<a name="module_semveristSuper"></a>

## semveristSuper
A module to load configuration for the semverist.


* [semveristSuper](#module_semveristSuper)
    * [semverist](#exp_module_semveristSuper--semverist) ⏏
        * _instance_
            * [.init([configs])](#module_semveristSuper--semverist+init)
            * [.splitStringNoEmpties(semverishString)](#module_semveristSuper--semverist+splitStringNoEmpties) ⇒ <code>array</code>
            * [.createOptions(attributeType, [inheritenceOverride], [lazySemverOverride])](#module_semveristSuper--semverist+createOptions) ⇒ <code>semveristItemOptions</code>
            * [.setDefaultName(defaultName)](#module_semveristSuper--semverist+setDefaultName)
            * [.getDefaultName()](#module_semveristSuper--semverist+getDefaultName) ⇒ <code>string</code>
            * [.setSemveristGroups(groupsConfig)](#module_semveristSuper--semverist+setSemveristGroups)
            * [.getSemveristGroups()](#module_semveristSuper--semverist+getSemveristGroups) ⇒ <code>Object</code>
            * [.setSemver(semverish)](#module_semveristSuper--semverist+setSemver)
            * [.getSemver()](#module_semveristSuper--semverist+getSemver) ⇒ <code>string</code>
            * [.getSemveristConfig()](#module_semveristSuper--semverist+getSemveristConfig) ⇒ <code>Object</code>
            * [.setSemveristConfig(configuration)](#module_semveristSuper--semverist+setSemveristConfig)
            * [.setSemveristConfigItem(itemPath, value)](#module_semveristSuper--semverist+setSemveristConfigItem)
            * [.valueToSemver(semverString)](#module_semveristSuper--semverist+valueToSemver) ⇒ <code>string</code>
            * [.setSource(source)](#module_semveristSuper--semverist+setSource)
            * [.getSource()](#module_semveristSuper--semverist+getSource) ⇒ <code>Object</code>
            * [.validateSource(source)](#module_semveristSuper--semverist+validateSource) ⇒ <code>boolean</code>
            * [.setPreReleasePattern(pattern)](#module_semveristSuper--semverist+setPreReleasePattern)
            * [.getPreReleasePattern()](#module_semveristSuper--semverist+getPreReleasePattern) ⇒ <code>RegExp</code>
            * [.isAttributeDefault(attributeName)](#module_semveristSuper--semverist+isAttributeDefault) ⇒ <code>boolean</code>
            * [.getSemveristAttributeGroups(semveristAttribute)](#module_semveristSuper--semverist+getSemveristAttributeGroups) ⇒ <code>array</code>
            * [.doesAttributeBelongToGroup(attributeName, groupName)](#module_semveristSuper--semverist+doesAttributeBelongToGroup) ⇒ <code>boolean</code>
        * _static_
            * [.getSemverLevels()](#module_semveristSuper--semverist.getSemverLevels) ⇒ <code>Array</code>
        * _inner_
            * [~semveristBehaviors](#module_semveristSuper--semverist..semveristBehaviors) : <code>Object</code>
            * [~semveristGroups](#module_semveristSuper--semverist..semveristGroups) : <code>Object</code>
            * [~preReleasedOrdering](#module_semveristSuper--semverist..preReleasedOrdering) : <code>Object</code>
            * [~semveristItemOptions](#module_semveristSuper--semverist..semveristItemOptions) : <code>Object</code>

<a name="exp_module_semveristSuper--semverist"></a>

### semverist ⏏
A super class for semverish instances like semverish, range and converter.

**Kind**: Exported class  
<a name="module_semveristSuper--semverist+init"></a>

#### semverist.init([configs])
Initialization of semverist classes.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [configs] | <code>Object</code> | An optional config object. If it   comes from the config module it will be namespaced to   'semverist' |
| [configs.semveristBehaviors] | <code>semveristBehaviors</code> | An   object with overall semverist behavior configuration.   [semveristBehaviors](semveristBehaviors) |
| [configs.groups] | <code>semveristGroups</code> | An object with   any number of arbitrarily named group configurations   [semveristGroups](semveristGroups) |
| [configs.preReleasedOrdering] | <code>preReleaseOrdering</code> | An object with any number of semver hierarchies.   [preReleaseOrdering](preReleaseOrdering) |

<a name="module_semveristSuper--semverist+splitStringNoEmpties"></a>

#### semverist.splitStringNoEmpties(semverishString) ⇒ <code>array</code>
Returns an array of the semverString split.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>array</code> - An array of semverish values.  

| Param | Type | Description |
| --- | --- | --- |
| semverishString | <code>string</code> | A semverish string. |

<a name="module_semveristSuper--semverist+createOptions"></a>

#### semverist.createOptions(attributeType, [inheritenceOverride], [lazySemverOverride]) ⇒ <code>semveristItemOptions</code>
Creates an options object for a given attribute type,

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>semveristItemOptions</code> - [emveristItemOptions](emveristItemOptions)  

| Param | Type | Description |
| --- | --- | --- |
| attributeType | <code>string</code> | A semverist element   (attribute, group, default) or the semverist object   itself (semveristObject) |
| [inheritenceOverride] | <code>boolean</code> |  |
| [lazySemverOverride] | <code>boolean</code> |  |

<a name="module_semveristSuper--semverist+setDefaultName"></a>

#### semverist.setDefaultName(defaultName)
Sets the default name

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| defaultName | <code>string</code> | <code>&quot;default&quot;</code> | The name of the   default semverist defaults element. By default it is,   well, "default"; |

<a name="module_semveristSuper--semverist+getDefaultName"></a>

#### semverist.getDefaultName() ⇒ <code>string</code>
Get the name of the semverist defaults element.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
<a name="module_semveristSuper--semverist+setSemveristGroups"></a>

#### semverist.setSemveristGroups(groupsConfig)
Sets semverist group elements.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Description |
| --- | --- | --- |
| groupsConfig | <code>Object</code> | Groups config detailing   membership, typically comes from config. |

<a name="module_semveristSuper--semverist+getSemveristGroups"></a>

#### semverist.getSemveristGroups() ⇒ <code>Object</code>
Get semverist group element details for this semverist.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
<a name="module_semveristSuper--semverist+setSemver"></a>

#### semverist.setSemver(semverish)
Sets a valid semver value related to the semverish value
  used to initialize this object. This will fill out missing
  elements of the semver if anything less than a patch or 3
  position was provided.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Throws**:

- Throws an error is the semverish value can not be transformed
  into a valid semver value.


| Param | Type | Description |
| --- | --- | --- |
| semverish | <code>string</code> | A semverish value to transform into a valid semver string. |

<a name="module_semveristSuper--semverist+getSemver"></a>

#### semverist.getSemver() ⇒ <code>string</code>
Returns a valid semver value for the semverish value of this object.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>string</code> - A valid semver string.  
<a name="module_semveristSuper--semverist+getSemveristConfig"></a>

#### semverist.getSemveristConfig() ⇒ <code>Object</code>
Returns semverist config.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>Object</code> - - Configuration for use with the semverist.  
<a name="module_semveristSuper--semverist+setSemveristConfig"></a>

#### semverist.setSemveristConfig(configuration)
Sets configuration from config Module or passed in.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Description |
| --- | --- | --- |
| configuration | <code>obj</code> | A configuration object for the   semverist. |

<a name="module_semveristSuper--semverist+setSemveristConfigItem"></a>

#### semverist.setSemveristConfigItem(itemPath, value)
Sets an internal item with itemPath within the config to the
  the passed value.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Description |
| --- | --- | --- |
| itemPath | <code>string</code> | An attribute or . separated path to an attribute. |
| value | <code>any</code> | A value you would like to assignt to the passed path within     semverist config. |

<a name="module_semveristSuper--semverist+valueToSemver"></a>

#### semverist.valueToSemver(semverString) ⇒ <code>string</code>
Convert a *semverish* value i.e. 4, 4.0 to a valid semver
  value.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>string</code> - - A valid semver string.  

| Param | Type | Description |
| --- | --- | --- |
| semverString | <code>string</code> | A semver-ish value to convert   to a propert semver value. |

<a name="module_semveristSuper--semverist+setSource"></a>

#### semverist.setSource(source)
Set the source for semverist subclasses and mixins.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Throws**:

- - Will throw an error if the source does not validate.


| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | The semverist base class is capable   of handling objects with a semver style hierarchy. |

<a name="module_semveristSuper--semverist+getSource"></a>

#### semverist.getSource() ⇒ <code>Object</code>
Returns semverist semver style source object.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>Object</code> - - An object with semver style hierarchy.  
<a name="module_semveristSuper--semverist+validateSource"></a>

#### semverist.validateSource(source) ⇒ <code>boolean</code>
Validates that the source is the correct type.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>boolean</code> - - True if the source is a valid type
   of source, False otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>any</code> | A source value to validate. |

<a name="module_semveristSuper--semverist+setPreReleasePattern"></a>

#### semverist.setPreReleasePattern(pattern)
Sets the prerelease pattern for the semverist.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>RegExp</code> | A regex pattern that matches your preRelease pattern |

<a name="module_semveristSuper--semverist+getPreReleasePattern"></a>

#### semverist.getPreReleasePattern() ⇒ <code>RegExp</code>
Returns your prerelease pattern.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
<a name="module_semveristSuper--semverist+isAttributeDefault"></a>

#### semverist.isAttributeDefault(attributeName) ⇒ <code>boolean</code>
Checks to see if the attribute Name passed is the default name.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>boolean</code> - True if they are the same.  

| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | An attribute name. |

<a name="module_semveristSuper--semverist+getSemveristAttributeGroups"></a>

#### semverist.getSemveristAttributeGroups(semveristAttribute) ⇒ <code>array</code>
Gets an array of group names to which the attribute belongs.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>array</code> - - An array of semverist group names.  

| Param | Type | Description |
| --- | --- | --- |
| semveristAttribute | <code>string</code> | The name of a semverist   attribute element. |

<a name="module_semveristSuper--semverist+doesAttributeBelongToGroup"></a>

#### semverist.doesAttributeBelongToGroup(attributeName, groupName) ⇒ <code>boolean</code>
Checks to see whether this semverist attribute belongs to the passed group.

**Kind**: instance method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>boolean</code> - - True if the attribute belongs to this group,
false if otherwise.  
**Throws**:

- - Throws error if group does not have members.


| Param | Type | Description |
| --- | --- | --- |
| attributeName | <code>string</code> | a semverist element attribute name. |
| groupName | <code>any</code> | A semverist element group name. |

<a name="module_semveristSuper--semverist.getSemverLevels"></a>

#### semverist.getSemverLevels() ⇒ <code>Array</code>
Returns an array of semver parts in order of their occurence.

**Kind**: static method of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Returns**: <code>Array</code> - - An array of semver parts in order.  
<a name="module_semveristSuper--semverist..semveristBehaviors"></a>

#### semverist~semveristBehaviors : <code>Object</code>
The semverist Behavior object. A part of semverist configuration
which if provided from the config module should be namespaced to
'semverist'.

**Kind**: inner typedef of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| inheritence | <code>boolean</code> | <code>semverImplied</code> | (null|semverImplied|lasySemverist) Enables inheritence for   the semverist object composer. Can be 1) null, or no   inheritence, 2) semverImplied the default   in which Parent semverist elements are inherited to   their child leaves unless they are overridden by another   instance of the same semverist element. Inheritence does not   cross over from parent to its siblings or 3) lazySemverist which Affects   inheritence by treating   the the highest semver occurence of a semverist element (elements   indicated below), as the element to inherit from for all future   parent and children leaves until specifically overriden by another   instance of the same semverist element. Adjacent higher siblings   in the semverist object can inherit elements from a previous sibling or   its children. |
| lazySemverist | <code>Object</code> |  | Configuration for lazySemverist   behavior. This is only in effect if the inheritence is   lazySemverist. |
| lazySemverist.preReleaseForwards | <code>boolean</code> | <code>false</code> | If true   allows lazy semverist enabled semverist elements to carry forward from   prereleases. |
| lazySemverist.attributes | <code>boolean</code> | <code>true</code> | Applies   lazySemverist inheritence to the semverist element, attributes.   Currently this is the only kind of lazySemverist though we plan to add   groups and defaults as well. |
| default | <code>boolean</code> | <code>true</code> | Enables default semverist   elements to influence semverist composer inheritence and merge   strategies. |
| defaultName | <code>string</code> | <code>&quot;default&quot;</code> | An override name for   defaults.Semverist elements with this name will be utilized as   defaults. |
| groups | <code>boolean</code> | <code>true</code> | Enables group semverist   elements to influence semverist composer inheritence and   merge strategies. |
| mergeStrategy | <code>string</code> | <code>&quot;lastIn&quot;</code> | Sets the mergeStrategy   for use with semverist composer realizations of semverist   element attributes. |
| preReleasePattern | <code>RegExp</code> |  | A regex pattern to use to   match your prerelease naming and versioning. Please   note that any item that the bounds of your prerelease pattern could   create conflicts with your semverist attribute names. Please be sure   to tightly cordon off your patterns. |

<a name="module_semveristSuper--semverist..semveristGroups"></a>

#### semverist~semveristGroups : <code>Object</code>
A semverist group element which allows you to create any number
of arbirarily named groups for any combination of semverist
attributes.

**Kind**: inner typedef of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| groups.groupName | <code>Object</code> | Any number of   group name keyed objects. |
| groups.groupName.members | <code>Array.string</code> | An array   of semverist element attributes who belongs to this group.  Any   occurence of a group within the semverist hierarchy will apply to   the members listed here according to the inheritence and merge   strategy in play at that leaf of the hierarchy. |

<a name="module_semveristSuper--semverist..preReleasedOrdering"></a>

#### semverist~preReleasedOrdering : <code>Object</code>
A prerelease configuration object which represents the semver hierarchy
object. These should be complete semver hierarchies complete to the patch
version where release order for non-alphabetical prerelease names can
be indicated.

**Kind**: inner typedef of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| majorVersion | <code>Object</code> | Any number of major   versions. |
| majorVersion.minorVersion | <code>Object</code> | Any number of minor   versions. // eslint-disable-next-line max-len |
| majorVersion.minorVersion.releaseArray | <code>Array.string</code> | A patch version key with an array of prerelease names in their release   order. If they are alphabetical this is optional. If however, they   deviate, you will need to indicate their release order here in every   patch were you use a non   alphabetical prerelease tag. |

<a name="module_semveristSuper--semverist..semveristItemOptions"></a>

#### semverist~semveristItemOptions : <code>Object</code>
An options object for use when creating and working with ranges.

**Kind**: inner typedef of <code>[semverist](#exp_module_semveristSuper--semverist)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| inheritence | <code>boolean</code> | Determines whether inheritence should   be used in considering the item's range. |
| lazySemverist | <code>boolean</code> | Determines whether lazySemverist   should be applied to the item's range. |
| type | <code>string</code> | The type element or semveristObject, attribute,   default, group, semveristObject. |


## License

MIT
## Contributors

[![](https://avatars.githubusercontent.com/u/?s=130)]()
---
[]()
