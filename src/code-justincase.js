const indicationMark = '$$$';
const separatingMarks = [' ', '/', '_', '-'];
const multipleSizeMarks = ['|', ','];
const skipNodeTypes = ['VECTOR', 'STAR', 'LINE', 'ELLIPSE', 'POLYGON', 'RECTANGLE', 'TEXT'];

// Get all frames that will be processed
function findFrames() {
  return figma.currentPage.findAll(node => {
    return node.type === 'FRAME' && node.name.startsWith(indicationMark);
  })
};

// Convert an array of items into a regular expression
function arrayToRegex(array) {
  return new RegExp(`\\${array.join('\\')}`);
}

async function main() {
  let exportableAssets = [];

  // Get all frames that will be processed
  const originalNodeList = findFrames();

  // Clone selected nodes
  for (const node of originalNodeList) {
    node.clone();
  }

  // Array with the IDs of all nodes inside originalNodeList
  const originalNodeIdList = originalNodeList.map((node) => node.id);
  const clonedNodeList = findFrames().filter((node) => {
    return !originalNodeIdList.includes(node.id);
  });

  for (const node of clonedNodeList) {
    node.y = node.y + 56;

    const children = node.children;
    const childrenIdList = children.map((child) => child.id);

    for (const child of children) {
      // Skip if the child is a new node
      if (!childrenIdList.includes(child.id)) {
        continue;
      }

      // Outline stroke of nodes of a selected type
      if (skipNodeTypes.includes(child.type)) {
        node.appendChild(child.outlineStroke());
        child.remove();
        continue;
      }

      // Flatten every boolean operation
      if (child.type === 'BOOLEAN_OPERATION') {
        figma.flatten([child], node);
        continue;
      }

      // Hack to detach instance, as it is currently not supported by Figma API
      if (child.type === 'INSTANCE') {
        for (const instanceChild of child.children) {
          let createdVector = figma.createVector();
          const clonableProperties = ['vectorNetwork', 'vectorPaths', 'relativeTransform', 'visible', 'opacity', 'blendMode', 'effects', 'fills', 'strokes', 'strokeWeight', 'strokeAlign', 'strokeCap', 'strokeJoin', 'strokeMiterLimit', 'dashPattern', 'cornerRadius', 'cornerSmoothing', 'x', 'y'];
          const mixableProperties = ['strokeCap', 'strokeJoin', 'cornerRadius'];

          // Clone all properties
          for (const property of clonableProperties) {
            // Apply inidividual corner radius if it has mixed values
            if (mixableProperties.includes(property) && instanceChild[property] === figma.mixed) {
              createdVector.vectorNetwork = instanceChild.vectorNetwork
            } else {

              // Apply same property of the original to the new vector
              createdVector[property] = instanceChild[property];
            }
          }

          // Outline stroke if possible
          const outlineVector = createdVector.outlineStroke();

          if (outlineVector) {
            createdVector = outlineVector;
          }

          node.appendChild(createdVector);
        }

        // child.opacity = 0.5
        child.remove();
        continue;
      }

      // child.constraints = {
      //   horizontal: 'SCALE',
      //   vertical: 'SCALE'
      // }
    }

    for (const newChild of node.children) {
      // Remove strokes and apply default fill
      newChild.strokes = [];
      newChild.fills = [{ blendMode: 'NORMAL', color: { r: 0, g: 0, b: 0 }, opacity: 1, type: 'SOLID',visible: true }];
    }

    // Flatten icon
    figma.flatten(node.children, node);
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

  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({ exportableAssets });
}

main();
// correctPosition();

figma.ui.onmessage = (message) => {
  if (message === 'done') {
    figma.closePlugin();
  }
}
