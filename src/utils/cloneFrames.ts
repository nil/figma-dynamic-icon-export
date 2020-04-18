import showError from './showError';
import nameData, { startMark } from './nameData';


/**
 * Get all frames that start with a specific string
 * or a portion of that list if it contains duplicated names
 */
function findFrames(): FindFrames {
  const frameList: FrameNode[] = [];
  const nameList: string[] = [];
  const duplicatedList: FrameNode[][] = [];

  figma.currentPage.children.forEach((node) => {
    if (node.type !== 'FRAME') { return; }
    if (!node.name.startsWith(startMark)) { return; }

    if (nameList.includes(node.name)) {
      const otherNode = frameList.find((frame) => frame.name === node.name);
      duplicatedList.push([node, otherNode]);
    }

    nameList.push(node.name);
    frameList.push(node);
  });

  return {
    duplicates: duplicatedList.length > 0,
    frames: duplicatedList.length > 0 ? duplicatedList : frameList
  };
}


/**
 * Clone exportable frames and export results
 */
export default function (): FrameNode[] | undefined {
  const errorNodes: ErrorEntry[] = [];
  const findFramesResult: FindFrames = findFrames();
  const originalList = findFramesResult.frames;
  const cloneList: FrameNode[] = [];

  // Throw error if there are multiple frames with the same name
  if (findFramesResult.duplicates) {
    originalList.forEach((frame) => {
      errorNodes.push({
        id: frame.map((f) => f.id),
        name: frame[0].name,
        type: 'duplicated name'
      });
    });

    showError('contentError', errorNodes);

    return undefined;
  }

  // Clone exportable nodes
  originalList.forEach((node) => {
    const names = nameData(node.name).fullName;

    names.forEach((name) => {
      const clone = node.clone();

      clone.setPluginData('originalId', node.id);
      clone.name = name;
      cloneList.push(clone);
    });
  });

  return cloneList;
}
