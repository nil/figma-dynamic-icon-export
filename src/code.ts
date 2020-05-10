import cloneNodes from './utils/cloneNodes';
import detachInstance from './utils/detachInstance';
import getSelection from './utils/getSelection';
import { sendUserSettings, getUserSettings, postMessage } from './utils/utils';
import formatSvg from './utils/formatSvg';


const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

let exportAssets: { name: string; svg: string }[] = [];
let errorNodes: ErrorEntry[] = [];
let errorNodesId: string[] = [];
let userSettings: UserSettings = {
  size: undefined
};


/**
 * Start up the plugin. Show UI and
 * send user settings and intial selection
 */
figma.showUI(__html__, { width: 360, height: 471 });

figma.clientStorage.getAsync('userSettings').then((resp): void => {
  const respSettings = resp || userSettings;

  // Send and save user settings
  userSettings = respSettings;
  figma.ui.postMessage({ userSettings: respSettings });
  figma.clientStorage.setAsync('userSettings', respSettings);

  // Send initial selection
  figma.ui.postMessage({ initialSelection: getSelection() });
});


/**
* Send selection when selection changes
*/
figma.on('selectionchange', () => {
  figma.ui.postMessage({ updateSelection: getSelection() });
});


/**
 * Get SVG code from the exportable nodes
 *
 * @param userSettings - Setting values set by the user or default values
 */
const getSvgCode = async (exportNodes: ExportNodes): Promise<void> => {
  const cloneList: AllowedNodes[] = cloneNodes(exportNodes.nodes, exportNodes.size);

  // Get SVG code from the nodes in cloneList
  cloneList.forEach(async (node) => {
    const originalId = node.getPluginData('originalId');
    const name = node.name.replace(/\s?\/\s?/g, '/');
    const size = parseFloat(node.getPluginData('size'));

    // Detach instances
    node.children.forEach((child) => {
      if (child.type === 'INSTANCE') {
        detachInstance(child);
      }

      if (child.type === 'BOOLEAN_OPERATION') {
        child.children.forEach((grandchild: InstanceNode) => {
          if (grandchild.type === 'INSTANCE') {
            detachInstance(grandchild);
          }
        });

        figma.union([child], node);
      }
    });

    // Merge and flatten all paths
    figma.union(node.children, node);
    figma.flatten(node.children, node);

    // Resize node
    node.children.forEach((child: VectorNode) => {
      child.constraints = { horizontal: 'SCALE', vertical: 'SCALE' };
      node.resize(size, size);
    });

    // Obtain SVG code
    const unit8 = await node.exportAsync({ format: 'SVG' });
    const svg = formatSvg(unit8);

    // Check if there is any clipPath error
    if (clipPathPattern.test(svg)) {
      if (!errorNodesId.includes(originalId)) {
        errorNodes.push({ id: originalId, name, type: 'clip-path' });
      }

      errorNodesId.push(originalId);
      node.remove();
    } else {
      exportAssets.push({ name, svg });
      node.remove();
    }
  });
};


/**
 * Export SVGs or show error
 */
const createExport = (): void => {
  if (errorNodes.length > 0) {
    postMessage('showError', errorNodes);
  } else if (exportAssets.length > 0) {
    postMessage('exportAssets', exportAssets);
  }
};


/**
 * Code to run when the plugin opens or runs again
 */
const runPlugin = (): void => {
  // Empty arrays
  exportAssets = [];
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

  if (message.exportNodes) {
    getSvgCode(message.exportNodes).then(() => {
      // createExport();
    });
  }
};
