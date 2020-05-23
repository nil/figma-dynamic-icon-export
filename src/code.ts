import cloneNodes from './utils/cloneNodes';
import detachInstance from './utils/detachInstance';
import getSelection from './utils/getSelection';
import formatSvg from './utils/formatSvg';


const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');

let exportAssets: { name: string; svg: string }[] = [];
let errorNodes: ErrorEntry[] = [];
let errorNodesId: string[] = [];
let userSettings: UserSettings = {
  size: undefined,
  sizeExplicit: false,
  sizeUnits: false,
  sizeName: 'beginning'
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
  const sizeList: string[] = [...new Set(exportNodes.size.replace(/(?:[^\d.,])/g, '').split(','))];
  const cloneList: AllowedNodes[] = cloneNodes(exportNodes.nodes, sizeList);

  // Reset lists
  exportAssets = [];
  errorNodes = [];
  errorNodesId = [];

  // Get SVG code from the nodes in cloneList
  cloneList.forEach(async (node) => {
    const originalId: string = node.getPluginData('originalId');
    const originalName: string = node.name;
    const size: number = parseFloat(node.getPluginData('size'));
    const sizeUnits: string = userSettings.sizeUnits ? 'px' : '';

    let name = node.name.replace(/\s?\/\s?/g, '/');

    // Apply name to node
    if (userSettings.sizeExplicit || sizeList.length > 1) {
      switch (userSettings.sizeName) {
        default:
        case 'beginning':
          name = `${size}${sizeUnits}/${name}`;
          break;
        case 'end':
          name = `${name}/${size}${sizeUnits}`;
          break;
        case 'appendix':
          name = `${name}-${size}${sizeUnits}`;
          break;
      }
    }

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
        errorNodes.push({ id: originalId, name: originalName, type: 'clip-path' });
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
    figma.ui.postMessage({ errorNodes });
  } else if (exportAssets.length > 0) {
    figma.ui.postMessage({ exportAssets });
  }
};


/**
 * Recive messages from the UI
 */
figma.ui.onmessage = (message): void => {
  // Close plugin
  if (message.closePlugin) {
    figma.closePlugin();
  }

  // Send current selection
  if (message.getSelection) {
    figma.ui.postMessage({ updateSelection: getSelection() });
  }

  // Download icons again
  if (message.downloadAgain) {
    createExport();
  }

  // Update settings value
  if (message.userSettings) {
    figma.clientStorage.setAsync('userSettings', message.userSettings);
    userSettings = message.userSettings;
  }

  // Send svg code to the UI to be exported
  if (message.exportNodes) {
    getSvgCode(message.exportNodes).then(() => {
      createExport();
    });
  }

  // Select a node based on its id
  if (message.viewNode) {
    const selectedNode = figma.currentPage.findAll((n) => n.id === message.viewNode);

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }
};
