import cloneFrames from './utils/cloneFrames';
import detachInstance from './utils/detachInstance';

const clipPathPattern: RegExp = new RegExp(/clip(-?)path/, 'gim');

let exportableNodes: FrameNode[] = [];
let exportableAssets = [];
let errorNodes: ErrorEntry[] = [];

async function main(): Promise<void> {
  const cloneList: FrameNode[] = cloneFrames();

  if (cloneList) {
    for (const node of cloneList) {
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
        console.warn('clip-path');

        errorNodes.push({ id: node.id, name: node.name, type: 'clip-path' });
      }
    }

    if (errorNodes.length > 0) {
      for (const node of exportableNodes) {
        node.remove();
      }

      figma.showUI(__html__, { visible: true });
      figma.ui.postMessage({ name: 'contentError', content: errorNodes });
    } else {
      for (const node of exportableNodes) {
        const unit8 = await node.exportAsync({ format: 'SVG' });
        const svgCode = String.fromCharCode.apply(null, new Uint16Array(unit8));

        const slashExp = new RegExp(' ?\/ ?', 'gi');
        const name = node.name.replace(slashExp, '/');

        exportableAssets.push({
          name,
          svgCode
        })
      }

      figma.showUI(__html__, { visible: false });
      figma.ui.postMessage({ name: 'exportableAssets', content: exportableAssets });
    }
  }
}

main();

figma.ui.onmessage = (message) => {
  if (message === 'done') {
    figma.closePlugin();
  }

  if (message.uiHeight) {
    figma.ui.resize(350, message.uiHeight + 16);
  }

  if (message.viewNode) {
    const selectedNode = figma.currentPage.findAll(n => n.name === message.viewNode);

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }
}
