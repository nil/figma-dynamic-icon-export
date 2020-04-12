import showError from './showError';

/**
 * Get all frames that start with a specific string
 * or a portion of that list if it contains duplicated names
 *
 * @param checkDuplicates - Check if the final list includes frames with duplicated names
 * @param data            - Plugin data
 */
function findFrames(checkDuplicates: boolean, data: PluginData): FindFrames {
  const frameList: FrameNode[] = [];
  const nameList: string[] = [];
  const duplicatedList: FrameNode[] = [];

  figma.currentPage.children.forEach((node) => {
    if (node.type !== 'FRAME') { return; }
    if (!node.name.startsWith(data.start)) { return; }

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
 *
 * @param data - Plugin data
 */
export default function (data: PluginData): FrameNode[] | undefined {
  const errorNodes: ErrorEntry[] = [];
  const findFramesResult: FindFrames = findFrames(true, data);
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
    const nodeSizes = node.name.match(data.regexSizes)[1].split(data.size);

    nodeSizes.forEach((size) => {
      node.clone().name = `${data.start}${size} / ${node.name.match(data.regexName)[0]}`;
    });
  });

  // Throw error if there is a duplicated layer name
  const idList = originalList.map((node) => node.id);
  const newFrameList = findFrames(false, data).frames;
  const cloneList: FrameNode[] = newFrameList.filter((frame) => !idList.includes(frame.id));

  return cloneList;
}
