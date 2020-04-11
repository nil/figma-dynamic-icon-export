const indicationMark: string = '$$$';

// Get all frames that will be processed
export default function () {
  let frameList: FrameNode[] = [];

  for (const child of figma.currentPage.children) {
    if (child.type !== 'FRAME') { continue }
    if (!child.name.startsWith(indicationMark)) { continue }

    frameList.push(child);
  }

  return frameList;
};
