/**
 * This is a workaround as Figma currently doesn't allow
 * to detach instances from the plugin API
 *
 * @param instance - The instance to be detached
 */
export default function (instance: InstanceNode): void {
  for (const child of instance.children) {
    const clone = child.clone();

    // Put the instance on the correct position
    clone.x = child.x + instance.x;
    clone.y = child.y + instance.y;

    instance.parent.appendChild(clone);
  }

  instance.remove();
}
