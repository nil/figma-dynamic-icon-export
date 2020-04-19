import cloneFrames from './utils/cloneFrames';
import detachInstance from './utils/detachInstance';
import nameData from './utils/nameData';
import { sendUserSettings, getUserSettings, postMessage } from './utils/utils';


const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

let exportableAssets: { name: string; svg: string }[] = [];
let errorNodes: ErrorEntry[] = [];
let errorNodesId: string[] = [];


/**
 * Render UI
 */
figma.showUI(__html__, { width: 360, height: 207 });


/**
 * Get SVG code from the exportable frames
 *
 * @param userSettings - Setting values set by the user or default values
 */
const getSvgCode = async (userSettings): Promise<void> => {
  const cloneList: FrameNode[] = cloneFrames(userSettings);

  // Get SVG code from the frames in cloneList
  if (cloneList) {
    cloneList.forEach(async (node) => {
      const nodeData = nameData(node.name);
      const name = node.getPluginData('name');
      const originalId = node.getPluginData('originalId');

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
        if (!errorNodesId.includes(originalId)) {
          errorNodes.push({ id: originalId, name, type: 'clip-path' });
        }

        errorNodesId.push(originalId);
        node.remove();
      } else {
        exportableAssets.push({ name, svg });
        node.remove();
      }
    });
  }
};


/**
 * Export SVGs or show error
 */
const createExport = (): void => {
  if (errorNodes.length > 0) {
    postMessage('showError', errorNodes);
  } else if (exportableAssets.length > 0) {
    postMessage('exportableAssets', exportableAssets);
  }
};


/**
 * Code to run when the plugin opens or runs again
 */
const runPlugin = (): void => {
  // Empty arrays
  exportableAssets = [];
  errorNodes = [];
  errorNodesId = [];

  // Send setting values to the UI
  sendUserSettings();

  // Get setting values and export SVG
  getUserSettings((userSettings) => {
    getSvgCode(userSettings).then(() => {
      createExport();
    });
  });
};


/**
 * Run plugin
 */
runPlugin();


/**
 * Recive messages from the UI
 */
figma.ui.onmessage = (message): void => {
  // Close plugin
  if (message.closePlugin) {
    figma.closePlugin();
  }

  // Run plugin again
  if (message.runAgain) {
    runPlugin();
  }

  // Download icons again
  if (message.downloadAgain) {
    createExport();
  }

  // Update settings value
  if (message.userSettings) {
    figma.clientStorage.setAsync('userSettings', message.userSettings);
  }

  // Send user settings as requested
  if (message.requestSettings) {
    figma.clientStorage.getAsync('userSettings').then((value) => {
      figma.ui.postMessage({ userSettings: value });
    });
  }

  // Select a list of given nodes
  if (message.viewNodes) {
    const idList = message.viewNodes;
    const idArray = idList.constructor === Array ? idList : [idList];
    const selectedNode = figma.currentPage.findAll((n) => idArray.includes(n.id));

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }
};
