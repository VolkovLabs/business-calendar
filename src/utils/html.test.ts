import { checkIfNodeType } from './html';

describe('html utils', () => {
  describe('checkIfNodeType', () => {
    const createNode = (item: Partial<Node>): ParentNode =>
      ({
        ...item,
      }) as ParentNode;

    it('Should check in all parents', () => {
      expect(
        checkIfNodeType(
          createNode({
            nodeName: 'a',
          }),
          'a'
        )
      ).toBeTruthy();
      expect(
        checkIfNodeType(
          createNode({
            nodeName: 'span',
            parentNode: createNode({
              nodeName: 'a',
            }),
          }),
          'a'
        )
      ).toBeTruthy();
    });

    it('Should check until no parent', () => {
      expect(
        checkIfNodeType(
          createNode({
            nodeName: 'span',
            parentNode: createNode({
              nodeName: 'div',
              parentNode: createNode({
                nodeName: 'body',
                parentNode: null,
              }),
            }),
          }),
          'a'
        )
      ).toBeFalsy();
    });
  });
});
