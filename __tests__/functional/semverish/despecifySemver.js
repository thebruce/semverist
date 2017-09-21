'use strict';

const semverishFactory = require('../../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Despecify Semver tests', () => {
  beforeEach(() => {
    semverah = semverishFactory('semverist', 'semverish')
      .then(SemverishSuperClass => new SemverishSuperClass());
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('despecifySemver1to1', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1');
      return semverishSuper.despecifySemver(1);
    })
    .then(obj => expect(obj).toEqual('1'));
  });

  test('despecifySemver2to1', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0');
      return semverishSuper.despecifySemver(1);
    }).then(obj => expect(obj).toEqual('1'));
  });

  test('despecifySemver3to1', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.0');
      return semverishSuper.despecifySemver(1);
    }).then(obj => expect(obj).toEqual('1'));
  });

  test('despecifySemver4to1', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0');
      semverishSuper.setSemverishArray('1.0.0-alpha.0');
      return semverishSuper.despecifySemver(1);
    }).then(obj => expect(obj).toEqual('1'));
  });

  test('despecifySemver5to1OneInFiveNoOneHereGetsOutAlive', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0+542');
      semverishSuper.setSemverishArray('1.0.0-alpha.0+542');
      return semverishSuper.despecifySemver(1);
    }).then(obj => expect(obj).toEqual('1'));
  });


  test('despecifySemver3to3', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha');
      semverishSuper.setSemverishArray('1.0.0-alpha');
      return semverishSuper.despecifySemver(3);
    }).then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('despecifySemver4to3', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0');
      semverishSuper.setSemverishArray('1.0.0-alpha.0');
      return semverishSuper.despecifySemver(3);
    }).then(obj => expect(obj).toEqual('1.0.0'));
  });

  test('despecifySemver3toUndefined', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.0');
      return semverishSuper.despecifySemver();
    }).then(obj => expect(obj).toEqual('1'));
  });

  test('despecifySemverishArrayEntity', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(2);
    }).then(obj => expect(obj).toEqual('1.0'));
  });


  test('despecifySemverishNoBuild', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha+124');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(4);
    }).then(obj => expect(obj).toEqual('1.0.0-alpha'));
  });

  test('despecifySemverishWithBuild', () => {
    expect.assertions(1);
    return semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha+124');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(5);
    }).then(obj => expect(obj).toEqual('1.0.0-alpha+124'));
  });
});
