/**
 * Remove all the cloned frames and show error message on the UI
 *
 * @param cloneList - list of cloned frames
 * @param name      - name of the error message
 * @param content   - content of the error message
 */
export default function(cloneList: FrameNode[], name: string, content: any): void {
  // Remove cloned frames
  cloneList.forEach((clone) => clone.remove());

  // Show error message on the UI
  figma.showUI(__html__, { visible: true });
  figma.ui.postMessage({ name, content });
}
