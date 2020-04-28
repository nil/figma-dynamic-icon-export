import { postMessage } from './utils';


/**
 * Get all nodes that start with a specific string
 * or a portion of that list if it contains duplicated names
 *
 * @param startMark - String that defines which nodes are exportable
 */
function findNodes(startMark): FindNodes {
  const nodeList: AllowedNodes[] = [];
  const nameList: string[] = [];
  const duplicatedList: AllowedNodes[][] = [];

  figma.currentPage.children.forEach((node) => {
    if (node.type !== 'FRAME' && node.type !== 'COMPONENT') { return; }
    if (!node.name.startsWith(startMark)) { return; }

    if (nameList.includes(node.name)) {
      const otherNode = nodeList.find((n) => node.name === n.name);
      duplicatedList.push([node, otherNode]);
    }

    nameList.push(node.name);
    nodeList.push(node);
  });

  return {
    duplicates: duplicatedList.length > 0,
    nodes: duplicatedList.length > 0 ? duplicatedList : nodeList
  };
}


/**
 * Clone exportable nodes and export results
 *
 * @param userSettings - Setting values defined by the user
 */
export default function (userSettings: UserSettings): AllowedNodes[] | undefined {
  const { start, end, size } = userSettings;
  const errorNodes: ErrorEntry[] = [];
  const findNodesResult: FindNodes = findNodes(start);
  const originalList = findNodesResult.nodes;
  const cloneList: AllowedNodes[] = [];

  // Throw error if there are multiple nodes with the same name
  if (findNodesResult.duplicates) {
    originalList.forEach((node) => {
      errorNodes.push({
        id: node.map((n) => n.id),
        name: node[0].name,
        type: 'duplicated name'
      });
    });

    postMessage('showError', errorNodes);

    return undefined;
  }

  // Clone exportable nodes
  originalList.forEach((node) => {
    const pattern = new RegExp(`(?:\\${start})?(.*?)\\${end}(?:\\/ )?(.*)`, 'i');
    const chopped = node.name.match(pattern);
    const newName = chopped[1].split(size).map((s) => `${s} / ${chopped[2]}`);

    newName.forEach((name) => {
      const clone = node.clone();

      clone.setPluginData('originalId', node.id);
      clone.setPluginData('name', name);
      cloneList.push(clone);
    });
  });

  if (cloneList.length === 0) {
    postMessage('showError', [{ name: 'No content found', message: `0 nodes start with ${start}`, id: 'single' }]);

    return undefined;
  }

  return cloneList;
}
