import detachInstance from './utils/detachInstance';
import findFrames from './utils/findFrames';

const separatingMarks: string[] = [' ', '/', '_', '-'];
const multipleSizeMarks: string[] = ['|', ','];
const clipPathPattern: RegExp = new RegExp(/clip(-?)path/, 'gim');
const uiWidth: number = 350;

async function main(): Promise<void> {
  let exportableAssets = [];
  let errorNodes: ErrorEntry[];

  // Get all frames that will be processed
  const originalNodeList: FrameNode[] = findFrames();

  // Clone selected nodes
  for (const node of originalNodeList) {
    node.clone();
  }

  // Array with the IDs of all nodes inside originalNodeList
  const originalNodeIdList: string[] = originalNodeList.map((node) => node.id);

  const clonedNodeList: FrameNode[] = findFrames().filter((node) => {
    return !originalNodeIdList.includes(node.id);
  });

  for (const node of clonedNodeList) {
    node.y = node.y + 56;

    for (const child of node.children) {
      if (child.type === 'INSTANCE') {
        detachInstance(child);
      }
    }

    // Merge all paths
    figma.union(node.children, node);

    // Obtain SVG code
    const unit8 = await node.exportAsync({ format: 'SVG' });
    const svgCode = String.fromCharCode.apply(null, new Uint16Array(unit8))
      .replace(/fill="(.*?)"\s?/gmi, '')
      .replace(/clip-rule="(.*?)"\s?/gmi, '')
      .replace(/<svg(.*)\n/gmi, '$&\t');

    // Check if there is any clipPath error
    if (clipPathPattern.test(svgCode)) {
      errorNodes.push({ id: node.id, name: node.name, type: 'clip-path' });
    }
  }

  if (errorNodes.length > 0) {
    figma.showUI(__html__, { visible: true, width: uiWidth });
    figma.ui.postMessage({ name: 'contentError', content: errorNodes });
  }






  // for (const component of nodeList) {
  //   const unit8 = await component.exportAsync({ format: 'SVG' });
  //   const svgCode = String.fromCharCode.apply(null, new Uint16Array(unit8));

  //   const slashExp = new RegExp(' ?\/ ?', 'gi');
  //   const name = component.name.replace(slashExp, '/');

  //   exportableAssets.push({
  //     name,
  //     svgCode
  //   })
  // }
  // }

  // figma.showUI(__html__, { visible: false });
  // figma.ui.postMessage({ exportableAssets });
}

main();
// correctPosition();

figma.ui.onmessage = (message) => {
  if (message === 'done') {
    figma.closePlugin();
  }

  if (message.uiHeight) {
    figma.ui.resize(uiWidth, message.uiHeight + 16);
  }

  if (message.viewNode) {
    const selectedNode = figma.currentPage.findAll(n => n.name === message.viewNode);

    figma.currentPage.selection = selectedNode;
  }
}
