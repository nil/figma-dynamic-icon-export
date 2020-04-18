import showError from './showError';
import { postMessage } from './utils';


/**
 * Get all frames that start with a specific string
 * or a portion of that list if it contains duplicated names
 *
 * @param startMark - String that defines which frames are exportable
 */
function findFrames(startMark): FindFrames {
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
 *
 * @param userSettings - Setting values defined by the user
 */
export default function (userSettings: UserSettings): FrameNode[] | undefined {
  const { start, end, size } = userSettings;
  const errorNodes: ErrorEntry[] = [];
  const findFramesResult: FindFrames = findFrames(start);
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
    postMessage('changePanel', {
      name: 'error',
      content: [{ name: 'No content found', message: `0 frames start with ${start}`, id: 'single' }]
    });

    return undefined;
  }

  return cloneList;
}
