/**
 * Check If Node Type
 * @param node
 * @param tagName
 */
export const checkIfNodeType = (node: Node | null, tagName: string) => {
  let current = node;

  while (current) {
    if (current.nodeName.toLowerCase() === tagName) {
      return true;
    }

    current = current.parentNode;
  }

  return false;
};
