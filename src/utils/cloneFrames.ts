import showError from './showError';
import nameData, { startMark, idMark } from './nameData';


/**
 * Get all frames that start with a specific string
 * or a portion of that list if it contains duplicated names
 *
 * @param checkDuplicates - Check if the final list includes frames with duplicated names
 */
function findFrames(checkDuplicates: boolean): FindFrames {
  const frameList: FrameNode[] = [];
  const nameList: string[] = [];
  const duplicatedList: FrameNode[] = [];

  figma.currentPage.children.forEach((node) => {
    if (node.type !== 'FRAME') { return; }
    if (!node.name.startsWith(startMark)) { return; }

    if (checkDuplicates) {
      if (nameList.includes(node.name)) {
        duplicatedList.push(node);
      }
      nameList.push(node.name);
    }

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
  const findFramesResult: FindFrames = findFrames(true);
  const originalList = findFramesResult.frames;

  // Throw error if there are multiple frames with the same name
  if (findFramesResult.duplicates) {
    originalList.forEach((frame) => errorNodes.push({
      id: frame.id,
      name: frame.name,
      type: 'duplicated name'
    }));

    showError('contentError', errorNodes);

    return undefined;
  }

  // Clone exportable nodes
  originalList.forEach((node) => {
    const names = nameData(node.name).fullNameMark.map((name) => `${name}${idMark}${node.id}`);

    names.forEach((name) => {
      node.clone().name = name;
    });
  });

  // Throw error if there is a duplicated layer name
  const idList = originalList.map((node) => node.id);
  const newFrameList = findFrames(false).frames;
  const cloneList: FrameNode[] = newFrameList.filter((frame) => !idList.includes(frame.id));

  return cloneList;
}
