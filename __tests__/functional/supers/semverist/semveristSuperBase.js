

const SemveristSuperBase = require('../../../../lib/supers/semverist');

const alternateConfig = {
  semveristBehaviors: {
    inheritence: 'lazySemverist',
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

let semveristSuperBase;
let tmpMocks = [];

describe('Semverist Super Base tests', () => {
  beforeEach(() => {
    semveristSuperBase = new SemveristSuperBase();
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('setPreleasePatternWithArg', () => {
    expect.assertions(1);
    semveristSuperBase.setPreReleasePattern(/\d-[A-Z]*/g);
    return expect(semveristSuperBase.getPreReleasePattern())
      .toEqual(/\d-[A-Z]*/g);
  });

  test('setPreleasePatternNoArg', () => {
    expect.assertions(1);
    return expect(semveristSuperBase.getPreReleasePattern())
      .toEqual(
        /\d+-([0-9A-Za-z-]*)((\.\d*(\+[a-zA-Z0-9-]*)|\.\d+\b)*\.?|\+[a-zA-Z0-9-]+\.?)?/g
      );
  });

  test('setSourceGoodSource', () => {
    expect.assertions(1);
    semveristSuperBase.setSource({
      test: [],
    });
    return expect(semveristSuperBase.getSource())
      .toEqual({
        test: [],
      });
  });

  test('setSourceBadSource', () => {
    expect.assertions(1);
    return expect(() => {
      semveristSuperBase.setSource('test');
    }).toThrowError('Could not set source, it must be an object.');
  });

  test('setDefaultName', () => {
    expect.assertions(1);
    semveristSuperBase.setDefaultName('default');
    return expect(semveristSuperBase.getDefaultName())
      .toEqual('default');
  });

  test('doesAttributeBelongToGroupTrue', () => {
    expect.assertions(1);
    semveristSuperBase.setSemveristGroups({
      testGroup: {
        members: [
          'testItem',
        ],
      },
    });
    return expect(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup')).toBe(true);
  });


  test('doesAttributeBelongToGroupFalse', () => {
    expect.assertions(1);
    semveristSuperBase.setSemveristGroups({
      testGroup: {
        members: [
          'junkItem',
        ],
      },
    });
    expect(semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup')).toBe(false);
  });

  test('doesAttributeBelongToGroupError', () => {
    expect.assertions(1);
    semveristSuperBase.setSemveristGroups({
      testGroup: {},
    });
    expect(() => {
      semveristSuperBase.doesAttributeBelongToGroup('testItem', 'testGroup');
    }).toThrowError('testGroup group is not properly formed and has no members array');
  });

  test('getSemveristGroups', () => {
    expect.assertions(1);
    semveristSuperBase.setSemveristGroups({
      testGroup: {
        members: [
          'testItem',
        ],
      },
      fakeGroup: {
        members: [
          'punk',
        ],
      },
      testGroup2: {
        members: [
          'punk',
          'testItem',
        ],
      },
    });
    expect(semveristSuperBase.getSemveristAttributeGroups('testItem').sort())
      .toEqual([
        'testGroup',
        'testGroup2',
      ]);
  });

  test('getSemveristConfig', () => {
    expect.assertions(1);
    semveristSuperBase.setSemveristConfig({
      semveristBehaviors: {},
    });
    expect(Object.keys(semveristSuperBase.getSemveristConfig()))
      .toEqual(['semveristBehaviors']);
  });

  test('init with overrides', () => {
    expect.assertions(1);
    semveristSuperBase.init(alternateConfig);
    expect(semveristSuperBase.getSemveristConfig().semveristBehaviors.inheritence)
      .toEqual('lazySemverist');
  });

  test('get Semver Level index', () => {
    expect.assertions(1);
    expect(SemveristSuperBase.getSemverLevelIndex('prerelease'))
      .toEqual(3);
  });
});
