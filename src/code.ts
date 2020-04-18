import cloneFrames from './utils/cloneFrames';
import detachInstance from './utils/detachInstance';
import nameData from './utils/nameData';
import showError from './utils/showError';

const clipPathPattern = new RegExp(/clip(-?)path/, 'gim');
const defaultSettings = { start: '$', end: ' ', size: ',' };

let exportableAssets: { name: string; svg: string }[] = [];
let errorNodes: ErrorEntry[] = [];
let errorNodesId: string[] = [];

// Render UI
figma.showUI(__html__, { width: 360, height: 207 });

async function getSvgCode(userSettings: UserSettings): Promise<void> {
  const cloneList: FrameNode[] = cloneFrames(userSettings);

  // Empty arrays
  exportableAssets = [];
  errorNodes = [];
  errorNodesId = [];

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
}

function createExport(): void {
  if (errorNodes.length > 0) {
    showError('contentError', errorNodes);
  } else if (exportableAssets.length > 0) {
    figma.ui.postMessage({ name: 'exportableAssets', content: exportableAssets });
  }
}

function runPlugin(userSettings: UserSettings): void {
  getSvgCode(userSettings).then(() => {
    createExport();
  });
}

figma.clientStorage.getAsync('userSettings').then((userSettings) => {
  if (!userSettings) {
    figma.clientStorage.setAsync('userSettings', defaultSettings);
    runPlugin(defaultSettings);
  } else {
    runPlugin(userSettings);
  }
});


figma.ui.onmessage = (message): void => {
  // Close plugin
  if (message.closePlugin) {
    figma.closePlugin();
  }

  // Send message to re-render UI from the header
  if (message.headerAction) {
    figma.ui.postMessage({ name: 'headerAction', content: message.headerAction });

    if (message.headerAction === 'Run again') {
      getSvgCode().then(() => {
        createExport();
      });
    }
  }

  // Download icons again
  if (message.downloadAgain) {
    createExport();
  }

  // Select a list of given nodes
  if (message.viewNodes) {
    const idList = message.viewNodes;
    const idArray = idList.constructor === Array ? idList : [idList];
    const selectedNode = figma.currentPage.findAll((n) => idArray.includes(n.id));

    figma.currentPage.selection = selectedNode;
    figma.viewport.scrollAndZoomIntoView(selectedNode);
  }

  // Update settings value
  if (message.settingsUpdate) {
    figma.clientStorage.getAsync('userSettings').then((userSettings) => {
      figma.clientStorage.setAsync('userSettings', {
        ...userSettings,
        [message.settingsUpdate.name]: message.settingsUpdate.value
      });
    });
    // figma.clientStorage.setAsync('userSettings', message.settingsUpdate);
    // console.log(figma.currentPage.getPluginData(message.settingsUpdate.name));
    // figma.currentPage.setPluginData(message.settingsUpdate.name, message.settingsUpdate)
  }

  if (message.userSettings) {
    figma.clientStorage.setAsync('userSettings', message.userSettings);
  }

  if (message.runAgain) {
    console.log('the plugin is running again');
    // clearInterval(updateSetting);
  }
};

setTimeout(() => {
  figma.ui.postMessage({ changeState: true });
}, 3000);

// const updateSetting = setInterval(() => {
//   figma.clientStorage.getAsync('dataStart').then((value) => {
//     figma.ui.postMessage({ previewSetting: value });
//   });
// }, 200);

// figma.clientStorage.getAsync('start').then((value) => {
//   figma.ui.postMessage({ dataStart: value });
// });
figma.clientStorage.getAsync('userSettings').then((value) => {
  figma.ui.postMessage({ userSettings: value });
});
