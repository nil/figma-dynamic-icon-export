import showError from './showError';

const indicationMark: string = '$$$';
const separatingMarks: string[] = [' ', '/', '_', '-'];
const multipleSizeMarks: string[] = ['|', ','];


/**
 * Get all frames that start with a specific string
 */
function findFrames(): FrameNode[] {
  let frameList: FrameNode[] = [];

  for (const child of figma.currentPage.children) {
    if (child.type !== 'FRAME') { continue }
    if (!child.name.startsWith(indicationMark)) { continue }

    frameList.push(child);
  }

  return frameList;
};


/**
 * Check if an array of Frame nodes contains a duplicated name
 * and returns a filtered array or `false`
 *
 * @param list - The list to check
 */
function checkDuplicatedNames(list: FrameNode[]): FrameNode[] | false {
  const nameList: string[] = list.map((node) => node.name);

  // Get new array with only duplicated values
  // https://stackoverflow.com/a/35922651/9917803
  const checkedList = nameList.reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
  }, []);

  if (checkedList.length > 0) {
    return list.filter((node, index) => node.name === checkedList[index])
  } else {
    return false;
  }
}


/**
 * Clone exportable frames and export results
 */
export default function(): FrameNode[] | undefined {
  const errorNodes: ErrorEntry[] = [];
  const originalList: FrameNode[] = findFrames();

  // Clone exportable nodes
  originalList.forEach(node => {
    node.clone()
  });

  // Throw error if there is a duplicated layer name
  const sameNameList = checkDuplicatedNames(originalList);
  const preRenameCloneList: FrameNode[] = findFrames().filter((node) => {
    return !originalList.map((node) => node.id).includes(node.id)
  });

  if (sameNameList) {
    sameNameList.forEach(n => errorNodes.push({ id: n.id, name: n.name, type: 'duplicated name' }));
    showError(preRenameCloneList, 'contentError', errorNodes);

    return undefined;
  }

  const cloneList = preRenameCloneList;
  return cloneList;
}
