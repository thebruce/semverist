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

### Schoenberg Defaults
Semverist Objects can utilize default overrides for all children objects/files. When combined with lazy semver it can create powerful inheritence structures with less effort or mirror best practice api behavior for documentation or schemas.

### Schoenberg Groups
Semverist objects can utilize aribitrary groups of overrides for select objects/directories.

### Schoenberg attributes
Named item overides applying to specific object/directories within a semver object/directory.

The Semverist will inspect your directories/objects & tell you about them with Poirot and masterfully compose them with Schoenberg.