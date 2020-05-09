/**
 * Clone exportable nodes and export results
 *
 * @param idList - List of the id from the nodes to be exported
 * @param sizeInput - The value defined in the size input
 */
export default function (idList: string[], sizeInput: string): AllowedNodes[] {
  const exportNodes: SceneNode[] = figma.currentPage.findAll((node) => idList.includes(node.id));
  const cloneList: AllowedNodes[] = [];

  // Clone exportable nodes
  exportNodes.forEach((node) => {
    if (node.type === 'FRAME' || node.type === 'COMPONENT') {
      const sizeList: string[] = sizeInput.replace(/(?:[^\d.,])/g, '').split(',');

      [...new Set(sizeList)].forEach((nodeSize) => {
        const clone = node.clone();

        clone.setPluginData('originalId', node.id);
        clone.setPluginData('size', nodeSize);
        cloneList.push(clone);
      });
    }
  });

  return cloneList;
}
