# The Semverist

The Semverist provides a uniform interface for understanding and manipulating directories, config, and objects with a semver influenced hierarchy.

We work better when we work together. So, the Semverist is two powerful components working together. The first is an inspector, Poirot, and the second a composer, Schoenberg.

## Poirot, the inspector

The Semverist inspector can tell you about the attributes/files in the sember shaped object/directory you pass to the Semverist. It can:
* Tell you the semver number of the last occurence of an attribute in a semver object/directory.
* Tell you whether an attribute/file exists for a given semver range/value.
* Tell you what elements form a given attribute file for a given semver.
* Tell you the location w/in the semver hierarchy of the attribute for a given semver range (in the case of lazy semver)
* Tell you the semver range for an attribute, default, or group.
* Tell you the first occurence of a given attribute /file in this semver object/directory.

## Schoenberg, the composer
The Semverist composer builds a fleshed out object from the Semverist inspector with support for defaults, arbitrary groups and attribute/file overides or stubs. It also features lazy semver, a companion to API versioning best practices and lazy configuration inheritence that allows for minimal definition and maintenance but maximum impact.

## The Semverist Object: What is a semver shaped hierarchy?

Semver is an extremely useful versioning standard whose declarative syntax helps machine and human readers to set package and software version use in a sane format. Read about semver at [http://semver.org/](http://semver.org/). Semver is not only useful for package versions however, using its declarative ranges within configuration, objects and directories is an awesome way to relate configuration, metadata, scripts, and schemas to constantly evolving services and software. The semverist was born out of a need to reliably deal with these realizations in objects and directories.

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

### The Semverist Object: Defaults
Semverist Objects can utilize default overrides for all children objects/files. When combined with lazy semver it can create powerful inheritence structures with less effort or mirror best practice api behavior for documentation or schemas.

### The Semverist Object: Schoenberg Groups
Semverist objects can utilize aribitrary groups of overrides for select objects/directories.

### The Semverist Object: attributes
Named item overides applying to specific object/directories within a semver object/directory.

The Semverist will inspect your directories/objects & tell you about them with Poirot and masterfully compose them with Schoenberg.

## Lazy Semver

### The power of laziness now brought to your semver experience.
Lazy Semver allows you to create schema items once and inherit them until they change mirroring API versioning best practices. The lazy semver configuration option allows you to inherit properties up through a major version overriding and overwriting with defaults, groups, and redeclarations. This can be very useful for setting attributes once per major version of semver and lowering maintenance tasks and copy/paste type errors.