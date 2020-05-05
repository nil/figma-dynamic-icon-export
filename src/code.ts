import cloneNodes from './utils/cloneNodes';
import detachInstance from './utils/detachInstance';
import getSelection from './utils/getSelection';
import { sendUserSettings, getUserSettings, postMessage } from './utils/utils';


const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

let exportableAssets: { name: string; svg: string }[] = [];
let errorNodes: ErrorEntry[] = [];
let errorNodesId: string[] = [];


/**
 * Render UI and send current selection
 */
figma.showUI(__html__, { width: 360, height: 207 });
postMessage('initialSelection', getSelection());

figma.on('selectionchange', () => {
  postMessage('updateSelection', getSelection());
});


/**
 * Get SVG code from the exportable nodes
 *
 * @param userSettings - Setting values set by the user or default values
 */
const getSvgCode = async (userSettings): Promise<void> => {
  const cloneList: AllowedNodes[] = cloneNodes(userSettings);

  // Get SVG code from the nodes in cloneList
  if (cloneList) {
    cloneList.forEach(async (node) => {
      const originalId = node.getPluginData('originalId');
      const name = node.getPluginData('name').replace(/\s?\/\s?/g, '/');
      const size = parseFloat(name.match(/[0-9].(?=\/)/)[0]);

      // Detach instance
      node.children.forEach((child) => {
        if (child.type === 'BOOLEAN_OPERATION') {
          child.children.forEach((grandchild) => {
            if (grandchild.type === 'INSTANCE') {
              detachInstance(grandchild);
            }
          });

          figma.union([child], node);
        }
      });

      // Merge all paths
      figma.union(node.children, node);

      // Resize node
      node.children.forEach((child) => {
        if (child.type === 'VECTOR') {
          child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
          node.resize(size, size);
        }
      });

      // Obtain SVG code
      const unit8 = await node.exportAsync({ format: 'SVG' });
      const svg = String.fromCharCode.apply(null, new Uint16Array(unit8))
        .replace(/fill="(.*?)"\s?/gmi, '')
        .replace(/clip-rule="(.*?)"\s?/gmi, '')
        .replace(/<svg(.*)\n/gmi, '$&\t');

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

  // Send info to the ui
  sendUserSettings();
  postMessage('changePanel', 'loading');

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
// runPlugin();


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
