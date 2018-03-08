

const rangeFactory = require('../../../../lib/semverish/range');

const tmpConfig = {
  semveristBehaviors: {
    inheritence: 'semverImplied',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: false,
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'lastIn',
    preReleasePattern: /\d-[a-zA-Z]*/g,
  },
  groups: {},
  prereleaseOrdering: {},
};

// Set Defaults for semverist objects.
const lazySemverConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
    lazySemverist: {
      attribute: true,
      preReleaseForwards: true,
    },
    default: true,
    defaultName: 'default',
    groups: true,
    mergeStrategy: 'lastIn',
    preReleasePattern: /\d-[a-zA-Z]*/g,
  },
  groups: {},
  prereleaseOrdering: {},
};
let tmpMocks = [];
let ranger;

describe('Path to range tests simple.', () => {
  beforeEach(() => {
    ranger = rangeFactory('semverist', 'range');
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });


  test('pathToRangePathZeroLength', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        return range.pathToRange('');
      })
      .catch((e) => {
        expect(e.message).toEqual('The path must have atleast a single major component.');
      });
  });

  test('pathToRangeInheritenceNull', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange('1.0.0', {
          inheritence: null,
        });
      })
      .then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('semveristObjectTestsMaxLevel3', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0.0', {
            attribute: 'semveristObject',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('semveristObjectTestsMaxLevel4', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0.0-alpha.0+124', {
            attribute: 'semveristObject',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('1.0.0-alpha.0'));
  });

  test('semveristObjectTestsPartial1', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        range.setSemverish('1');
        range.setSemverParsed('1.0.0');
        return range.pathToRange(
          '1', {
            attributeType: 'semveristObject',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <2.0.0'));
  });

  test('semveristObjectTestsPartial2', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0', {
            attributeType: 'semveristObject',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <1.1.0'));
  });

  test('semveristObjectTestsAlpha', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        range.setLowerBounds('1.0.0-alpha.1');
        range.setSemverish('1.0.0-alpha.1.entity');
        range.setSemverishArray('1.0.0-alpha.1');
        range.setSemverParsed('1.0.0-alpha.1');
        range.setSemver('1.0.0-alpha.1');
        return range.pathToRange(
          '1.0.0-alpha.1', {
            attributeType: 'semveristObject',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0-alpha.1 <1.0.0'));
  });

  test('semverImpliedTestsMaxLevel3', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0.0', {
            attributeType: 'attribute',
            inheritence: 'semverImplied',
          }
        );
      })
      .then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('semverImpliedTestsMaxLevel4', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0.0-alpha+124', {
            attributeType: 'attribute',
            inheritence: 'semverImplied',
          }
        );
      })
      .then(obj => expect(obj).toEqual('1.0.0-alpha'));
  });

  test('semverImpliedTestsPartial1', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1', {
            attributeType: 'attribute',
            inheritence: 'semverImplied',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <2.0.0'));
  });

  test('semverImpliedTestsPartial2', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.pathToRange(
          '1.0', {
            attributeType: 'attribute',
            inheritence: 'semverImplied',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <1.1.0'));
  });

  test('semverImpliedTestsAlpha', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        range.setLowerBounds('1.0.0-alpha.1');
        range.setSemverish('1.0.0-alpha.1');
        range.setSemverishArray('1.0.0-alpha.1');
        range.setSemver('1.0.0-alpha.1');
        return range.pathToRange(
          '1.0.0-alpha.1', {
            attributeType: 'attribute',
            inheritence: 'semverImplied',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0-alpha.1 <1.0.0'));
  });

  test('toTildeRange', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        return range.toTildeRange('1.0');
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <1.1.0'));
  });

  test('pathHasPrereleaseWithForwardingLeading0FullSemver', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();

        range.init(lazySemverConfig);
        range.setOptions();
        range.setSemveristConfig(lazySemverConfig);
        range.setSemverParsed('0.1.0-alpha.1');
        range.setSemver('0.1.0-alpha.1');
        range.setSemverishArray('0.1.0-alpha.1');

        return range.pathToRange(
          '0.1.0-alpha.1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=0.1.0-alpha.1 <0.1.0 >=0.1.0 <1.0.0'));
  });

  test('pathHasPrereleaseWithForwardingLeadingNonZeroFullSemver', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.1.0-alpha.1');
        range.setSemverishArray('1.1.0-alpha.1');
        range.setSemveristConfigItem(
          'semveristBehaviors.lazySemverist.preReleaseForwards',
          true
        );
        return range.pathToRange(
          '1.1.0-alpha.1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.1.0-alpha.1 <1.1.0 >=1.1.0 <2.0.0'));
  });

  test('pathHasPrereleaseWithForwardingLeadingZeroPartialSemver', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.init();
        range.setOptions();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('0.1.0-alpha');
        range.setSemver('0.1.0-alpha');
        range.setSemverishArray('0.1.0-alpha');
        range.setSemveristConfigItem(
          'semveristBehaviors.lazySemverist.preReleaseForwards',
          true
        );
        return range.pathToRange(
          '0.1.0-alpha', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=0.1.0-alpha <0.1.0 >=0.1.0 <1.0.0'));
  });

  test('pathHasPrereleaseWithForwardingLeadingNonZeroPartialSemver', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.1.0-alpha');
        range.setSemverishArray('1.1.0-alpha');
        range.setSemveristConfigItem(
          'semveristBehaviors.lazySemverist.preReleaseForwards',
          true
        );
        return range.pathToRange(
          '1.1.0-alpha', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.1.0-alpha <1.1.0 >=1.1.0 <2.0.0'));
  });

  test('pathHasPrereleaseNoForwarding', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.1.0-alpha.1');
        range.setSemverishArray('1.1.0-alpha.1');
        return range.pathToRange(
          '1.1.0-alpha.1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.1.0-alpha.1 <1.1.0'));
  });


  test('lazySemveristNoPrerelease3Long', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.1.0');
        range.setSemver('1.1.0');
        range.setSemverishArray('1.1.0');
        return range.pathToRange(
          '1.1.0', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.1.0 <2.0.0'));
  });

  test('lazySemveristNoPrerelease3LongLeadingZero', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('0.1.0');
        range.setSemverishArray('0.1.0');
        return range.pathToRange(
          '0.1.0', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=0.1.0 <1.0.0'));
  });

  test('lazySemveristNoPrerelease2Long', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.1.0');
        range.setSemverishArray('1.1');
        return range.pathToRange(
          '1.1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.1.0 <2.0.0'));
  });

  test('lazySemveristNoPrerelease1Long', () => {
    expect.assertions(1);
    return ranger
      .then((RangeClass) => {
        const range = new RangeClass();
        range.setSemveristConfig(tmpConfig);
        range.setSemverParsed('1.0.0');
        range.setSemverishArray('1');
        return range.pathToRange(
          '1', {
            attributeType: 'attribute',
            inheritence: 'lazySemverist',
          }
        );
      })
      .then(obj => expect(obj).toEqual('>=1.0.0 <2.0.0'));
  });
});
