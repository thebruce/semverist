# The Semverist

[![Greenkeeper badge](https://badges.greenkeeper.io/thebruce/semverist.svg)](https://greenkeeper.io/)

> Intelligent Semver-based hierarchy processing

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