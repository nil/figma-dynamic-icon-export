/**
 * Get the current selected nodes, excluding those that
 * are not allowed, and return a list of formatted values.
 */
export default function (): { nodeList: SelectedNode[]; disallowedList: string[]} {
  const nodeList: SelectedNode[] = [];
  const disallowedList: string[] = [];
  const { selection } = figma.currentPage;

  selection.forEach((node) => {
    if (node.type === 'FRAME' || node.type === 'COMPONENT') {
      nodeList.push({
        name: node.name,
        id: node.id,
        type: node.type,
        size: node.width,
        status: true
      });
    } else {
      disallowedList.push(node.id);
    }
  });

  return { nodeList, disallowedList };
}
