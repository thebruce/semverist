class manifestBase {
  getConverterGroups() {}
  addManifestCompinentItem() {}
  manifestCapability() {}
  getConfig() {}
  getConverter() {}
  addItemAlters() {}
}

const conf = {
  groups: {
    testGroup: {
      members: ['item'],
    },
  },
};

const GroupManifestComponents = require('../../../../lib/mixins/manifest/groupManifestComponents');

let tmpMocks = [];

describe('contigentSource', () => {
  beforeEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
    jest.resetAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(2000);
  });

  afterEach(() => {
    tmpMocks.forEach(mock => mock.mockRestore());
    tmpMocks = [];
  });

  test('getItemGroups', () => {
    expect.assertions(1);
    tmpMocks.push(
      jest
        .spyOn(manifestBase.prototype, 'getConverter')
        .mockReturnValue({ group: { item: ['test'] } })
    );
    tmpMocks.push(jest.spyOn(manifestBase.prototype, 'addItemAlters'));
    tmpMocks.push(
      jest.spyOn(manifestBase.prototype, 'getConfig').mockReturnValue(conf)
    );
    const group = new (GroupManifestComponents(manifestBase))();
    group.addItemAlters('1.0.0', { semveristElement: 'item' });
    expect(manifestBase.prototype.addItemAlters).toHaveBeenCalled();
  });
});
