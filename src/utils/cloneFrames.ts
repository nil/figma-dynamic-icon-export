import showError from './showError';

const indicationMark = '$$$';
const separatingMarks: string[] = [' ', '/', '_', '-'];
const multipleSizeMarks: string[] = ['|', ','];


/**
 * Get all frames that start with a specific string
 */
function findFrames(): FrameNode[] {
  const frameList: FrameNode[] = [];

  figma.currentPage.children.forEach((child) => {
    if (child.type !== 'FRAME') { return; }
    if (!child.name.startsWith(indicationMark)) { return; }

    frameList.push(child);
  });

  return frameList;
}


/**
 * Check if an array of Frame nodes contains a duplicated name
 * and returns a filtered array or `false`
 *
 * @param list - The list to check
 */
function checkDuplicatedNames(list: FrameNode[]): string[] | false {
  const nameList: string[] = list.map((node) => node.name);

  // Get new array with only duplicated values
  // https://stackoverflow.com/a/35922651/9917803
  const checkedList = nameList.reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
  }, []);

  if (checkedList.length > 0) {
    return checkedList;
  }

  return false;
}


/**
 * Clone exportable frames and export results
 */
export default function (): FrameNode[] | undefined {
  const errorNodes: ErrorEntry[] = [];
  const originalList: FrameNode[] = findFrames();

  // Clone exportable nodes
  originalList.forEach((node) => {
    node.clone();
  });

  // Throw error if there is a duplicated layer name
  const sameNameList = checkDuplicatedNames(originalList);
  const originalIdList = originalList.map((node) => node.id);
  const cloneList: FrameNode[] = findFrames().filter((frame) => !originalIdList.includes(frame.id));

  if (sameNameList) {
    sameNameList.forEach((entry, index) => errorNodes.push({
      id: `error-${index}`,
      name: entry,
      type: 'duplicated name'
    }));

    showError(cloneList, 'contentError', errorNodes);

    return undefined;
  }

  return cloneList;
}
