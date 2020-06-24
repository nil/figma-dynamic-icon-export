import cloneNodes from './utils/cloneNodes';
import detachInstance from './utils/detachInstance';
import getSelection from './utils/getSelection';
import formatSvg from './utils/formatSvg';
import exportedName from './utils/exportedName';


let exportAssets: { name: string; svg: string }[] = [];
let currentUiSize = 237;
let userSettings = {
  size: undefined,
  sizeExplicit: false,
  sizeUnits: false,
  sizeName: 'beginning'
};


/**
 * Start up the plugin. Show UI and
 * send user settings and intial selection,
 * or show error message is no layer is slected
 */
figma.showUI(__html__, { visible: false });

figma.clientStorage.getAsync('userSettings').then((resp): void => {
  const respSettings = resp || userSettings;
  const initialSelection = getSelection();

  // Send and save user settings
  userSettings = respSettings;
  figma.ui.postMessage({ userSettings: respSettings });
  figma.clientStorage.setAsync('userSettings', respSettings);

  // Send initial selection
  if (initialSelection.nodeList.length === 0) {
    figma.closePlugin('⚠ Select at least one component or frame');
  } else {
    figma.showUI(__html__, { width: 300, height: currentUiSize });
    figma.ui.postMessage({ initialSelection });
  }
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
const getSvgCode = async (exportNodes: ExportNodes, userValues: UserValues): Promise<void> => {
  const sizeList: string[] = [...new Set(exportNodes.values.sizeValue.replace(/(?:[^\d.,])/g, '').split(','))];
  const cloneList: AllowedNodes[] = cloneNodes(exportNodes.nodes, sizeList);

  // Reset list
  exportAssets = [];

  // Get SVG code from the nodes in cloneList
  cloneList.forEach(async (node, index) => {
    const size: number = parseFloat(node.getPluginData('size'));
    const name: string = exportedName(node.name, size.toString(), userValues, index + 1).replace(/\s?\/\s?/g, '/');

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

    exportAssets.push({ name, svg });
    node.remove();
  });
};


/**
 * Export SVGs
 */
const createExport = (): void => {
  figma.ui.postMessage({ exportAssets });
};


/**
 * Recive messages from the UI
 */
figma.ui.onmessage = (message): void => {
  // Send current selection
  if (message.getSelection) {
    figma.ui.postMessage({ updateSelection: getSelection() });
  }

  // Send svg code to the UI to be exported
  if (message.exportNodes) {
    getSvgCode(message.exportNodes.nodes, message.exportNodes.values).then(() => {
      createExport();
    });
  }

  // Update the height of the plugin UI
  if (message.pluginHeight) {
    const newUiSize = currentUiSize + message.pluginHeight;

    figma.ui.resize(300, newUiSize);
    currentUiSize = newUiSize;
  }
};
