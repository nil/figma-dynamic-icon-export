import cloneFrames from './utils/cloneFrames';
import detachInstance from './utils/detachInstance';

const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

const exportableNodes: FrameNode[] = [];
const exportableAssets = [];
const errorNodes: ErrorEntry[] = [];

const marks = {
  start: '$',
  end: ' ',
  size: ','
};

const data: PluginData = {
  ...marks,
  regexSizes: new RegExp(`\\${marks.start}(.*?)\\${marks.end}`, 'i'),
  regexName: new RegExp(`\\${marks.end}(.*)`, 'i')
};

async function getSvgCode(): Promise<void> {
  const cloneList: FrameNode[] = cloneFrames(data);

  if (cloneList) {
    cloneList.forEach(async (node) => {
      node.y = node.y + 56;

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
      const size = parseFloat(node.name.match(data.regexSizes)[1]);

      node.children.forEach((child) => {
        if (child.type === 'VECTOR') {
          child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
          node.resize(size, size);
        }
      });

      // Rename frame
      node.name = node.name.replace(data.start, '');

      // Obtain SVG code
      const unit8 = await node.exportAsync({ format: 'SVG' });
      const svg = String.fromCharCode.apply(null, new Uint16Array(unit8))
        .replace(/fill="(.*?)"\s?/gmi, '')
        .replace(/clip-rule="(.*?)"\s?/gmi, '')
        .replace(/<svg(.*)\n/gmi, '$&\t')
        .replace(/" \/>\n<path( fill-rule="evenodd")? d="/gmi, ' ');

      // Check if there is any clipPath error
      if (clipPathPattern.test(svg)) {
        errorNodes.push({ id: node.id, name: node.name, type: 'clip-path' });
        node.remove();
      } else {
        exportableAssets.push({ node, svg });
        node.remove();
      }
    });
  }
}

getSvgCode().then(() => {
  // if (errorNodes.length > 0) {
  //   console.log('hey');

  //   exportableNodes.forEach((node) => {
  //     node.remove();
  //   });

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
    const selectedNode = figma.currentPage.findAll((n) => n.name === message.viewNode);

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }
};
