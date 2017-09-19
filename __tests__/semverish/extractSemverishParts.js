const semverishFactory = require('../../lib/semverish/semverish');

test('extractSemverGoodSemver', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0');
  });
  expect(t.context.data).toEqual('4.1.0');
});

test('extractSemverMinorSemverOnly', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1');
  });
  expect(t.context.data).toEqual('4.1');
});

test('extractSemverAlpha', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha');
  });
  expect(t.context.data).toEqual('4.1.0-alpha');
});

test('extractSemverAlphaDotVersion', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.1');
  });
  expect(t.context.data).toEqual('4.1.0-alpha.1');
});

test('extractSemverDeathStar', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-deathstar.1');
  });
  expect(t.context.data).toEqual('4.1.0-deathstar.1');
});

test('extractWithAttribute', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0.entity');
  });
  expect(t.context.data).toEqual('4.1.0');
});

test('extractParitalWithAttribute', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.entity');
  });
  expect(t.context.data).toEqual('4.1');
});

test('extractMoreParitalWithAttribute', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.entity');
  });
  expect(t.context.data).toEqual('4');
});

test('extractAttributeWithAlpha', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setPreReleasePattern();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.entity');
  });
  expect(t.context.data).toEqual('4.1.0-alpha');
});

test('extractAttributeWithAlpha1', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.setPreReleasePattern();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0');
  });
  expect(t.context.data).toEqual('4.1.0-alpha.0');
});

test('extractAttributeWithAlphaAndNumber', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0.entity');
  });
  expect(t.context.data).toEqual('4.1.0-alpha.0');
});

test('setSourceBadSourceLeading0', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity');
  })).toThrowError('The semverish value must be able to be converted to a semver value.' +
  ' SemveristElement names can not have leading 0s.');
});

test('setSourceBadSourceLeading0DeepPath', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('4.1.0-alpha.0entity.attribute');
  })).toThrowError('The semverish value must be able to be converted to a semver value.' +
  ' SemveristElement names can not have leading 0s.');
});

test('setSourceBadSource', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('entity');
  })).toThrowError('The semverish value must be able to be converted to a semver value.' +
  ' Unable to compare version string: entity');
});

test('extractDifferentBadValue', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('entity.0');
  })).toThrowError('The semverish value must be able to be converted to a semver value. '
  + 'Unable to compare version string: entity.');
});

test('extractTooManySemverWithoutPrerelease', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('4.0.0.0');
  })).toThrowError('The semverish value must be able to be converted to a semver '
  + 'value. Unable to compare version string: 4.0.0.0');
});


test('extractSemverPartsFromTooManyPeriods', async () => {
  t.context.data = await semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    return semverishSuper.extractSemverishFromPath('4.1.');
  });
  expect(t.context.data).toEqual('4.1');
});

test('extractSemverPartsFromLeadingPeriods', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('.1.');
  })).toThrowError('The semverish value must be able to be converted to a semver value. '
  + 'The semverish value must have atleast a major portion.');
});

test('Very bad semverish', async () => {
  await expect(semverishFactory('semverist', 'semverish')
  .then((SemverishSuperClass) => {
    const semverishSuper = new SemverishSuperClass();
    semverishSuper.extractSemverishFromPath('1.1.entity......1');
  })).toThrowError('The semverish value must be able to be converted to a semver value. ' +
  'There was a problem with your semverish path and the regex pattern used '
  + 'to identify your prereleases.');
});
