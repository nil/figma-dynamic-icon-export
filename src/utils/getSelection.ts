/**
 * Get the current selected nodes, excluding those that
 * are not allowed, and return a list of formatted values.
 */
export default function (): object {
  const nodeList = [];
  const { selection } = figma.currentPage;

  selection.forEach((node) => {
    if (node.type === 'FRAME' || node.type === 'COMPONENT') {
      nodeList.push({
        name: node.name,
        id: node.id,
        type: node.type,
        status: true
      });
    }
  });

  return nodeList;
}
