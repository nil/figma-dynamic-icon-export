import cloneFrames from './utils/cloneFrames';
import detachInstance from './utils/detachInstance';
import nameData, { startMark } from './utils/nameData';
import showError from './utils/showError';

const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

const exportableAssets: { node: FrameNode; svg: string }[] = [];
const errorNodes: ErrorEntry[] = [];
const errorNodesId: string[] = [];

async function getSvgCode(): Promise<void> {
  const cloneList: FrameNode[] = cloneFrames();

  if (cloneList.length > 0) {
    cloneList.forEach(async (node) => {
      const nodeData = nameData(node.name);
      node.y += 56;

      // Detach instance
      node.children.forEach((child) => {
        if (child.type === 'INSTANCE') {
          detachInstance(child);
        }
      });

      // Merge all paths
      figma.union(node.children, node);
      figma.flatten(node.children, node);

      // Resize frame
      node.children.forEach((child) => {
        if (child.type === 'VECTOR') {
          child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
          node.resize(nodeData.sizes[0], nodeData.sizes[0]);
        }
      });

      // Obtain SVG code
      const unit8 = await node.exportAsync({ format: 'SVG' });
      const svg = String.fromCharCode.apply(null, new Uint16Array(unit8))
        .replace(/fill="(.*?)"\s?/gmi, '')
        .replace(/clip-rule="(.*?)"\s?/gmi, '')
        .replace(/<svg(.*)\n/gmi, '$&\t')
        .replace(/" \/>\n<path( fill-rule="evenodd")? d="/gmi, ' ');

      // Check if there is any clipPath error
      if (clipPathPattern.test(svg)) {
        const { id } = nameData(node.name);

        if (!errorNodesId.includes(id)) {
          errorNodes.push({ id: node.id, name: node.name, type: 'clip-path' });
        }

        errorNodesId.push(id);
        node.remove();
      } else {
        exportableAssets.push({ node, svg });
        node.remove();
      }
    });
  } else {
    showError('contentError', { name: 'No content found', message: `0 frames start with ${startMark}` });
  }
}

getSvgCode().then(() => {
  if (errorNodes.length > 0) {
    showError('contentError', errorNodes);
  }

  //   figma.showUI(__html__, { visible: true });
  //   figma.ui.postMessage({ name: 'contentError', content: errorNodes });
  // } else {
  //   exportableNodes.forEach(async (node) => {
  //     const unit8 = await node.exportAsync({ format: 'SVG' });
  //     const svgCode = String.fromCharCode.apply(null, new Uint16Array(unit8));

  //     const slashExp = new RegExp(' ?/ ?', 'gi');
  //     const name = node.name.replace(slashExp, '/');

  //     exportableAssets.push({
  //       name,
  //       svgCode
  //     });
  //   });

  // figma.showUI(__html__, { visible: false });
  // figma.ui.postMessage({ name: 'exportableAssets', content: exportableAssets });
});


figma.ui.onmessage = (message): void => {
  if (message === 'done') {
    figma.closePlugin();
  }

  if (message.uiHeight) {
    figma.ui.resize(350, message.uiHeight + 16);
  }

  if (message.viewNode) {
    const selectedNode = figma.currentPage.findAll((n) => n.id === message.viewNode);

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }
};
