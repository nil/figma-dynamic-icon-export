/**
 * Remove all the cloned frames and show error message on the UI
 *
 * @param name      - name of the error message
 * @param content   - content of the error message
 */
export default function (name: string, content): void {
  figma.showUI(__html__, { visible: true });
  figma.ui.postMessage({ name, content });
}
