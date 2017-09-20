'use strict';

const semverishFactory = require('../../lib/semverish/semverish');

let tmpMocks = [];
let semverah;

describe('Range tests', () => {
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
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1');
      return semverishSuper.despecifySemver(1);
    })).resolves.toEqual('1');
  });

  test('despecifySemver2to1', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0');
      return semverishSuper.despecifySemver(1);
    })).resolves.toEqual('1');
  });

  test('despecifySemver3to1', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.0');
      return semverishSuper.despecifySemver(1);
    })).resolves.toEqual('1');
  });

  test('despecifySemver4to1', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0');
      semverishSuper.setSemverishArray('1.0.0-alpha.0');
      return semverishSuper.despecifySemver(1);
    })).resolves.toEqual('1');
  });

  test('despecifySemver5to1OneInFiveNoOneHereGetsOutAlive', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0+542');
      semverishSuper.setSemverishArray('1.0.0-alpha.0+542');
      return semverishSuper.despecifySemver(1);
    })).resolves.toEqual('1');
  });


  test('despecifySemver3to3', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha');
      semverishSuper.setSemverishArray('1.0.0-alpha');
      return semverishSuper.despecifySemver(3);
    })).resolves.toEqual('1.0.0');
  });

  test('despecifySemver4to3', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha.0');
      semverishSuper.setSemverishArray('1.0.0-alpha.0');
      return semverishSuper.despecifySemver(3);
    })).resolves.toEqual('1.0.0');
  });

  test('despecifySemver3toUndefined', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.0');
      return semverishSuper.despecifySemver();
    })).resolves.toEqual('1');
  });

  test('despecifySemverishArrayEntity', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(2);
    })).resolves.toEqual('1.0');
  });


  test('despecifySemverishNoBuild', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha+124');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(4);
    })).resolves.toEqual('1.0.0-alpha');
  });

  test('despecifySemverishWithBuild', () => {
    expect(semverah.then((semverishSuper) => {
      semverishSuper.setSemver('1.0.0-alpha+124');
      semverishSuper.setSemverishArray('1.0.entity');
      return semverishSuper.despecifySemver(5);
    })).resolves.toEqual('1.0.0-alpha+124');
  });
});
