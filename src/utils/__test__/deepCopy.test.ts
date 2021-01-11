import deepCopy from 'utils/deepCopy';

test('deepCopy', () => {
  const expectResult = {
    a: 1,
    b: 'string',
    c: [1, 2, 3],
    d: {
      e: 'e',
      f: {
        g: 'g',
      },
    },
  };

  expect(deepCopy(expectResult)).toEqual(expectResult);
  expect(deepCopy(expectResult)).not.toBe(expectResult);
});
