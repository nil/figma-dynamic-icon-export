/**
 * This is a workaround as Figma currently doesn't allow
 * to detach instances from the plugin API
 *
 * @param instance - The instance to be detached
 */
export default function (instance: InstanceNode): void {
  const newFrame = figma.createFrame();

  newFrame.resize(instance.width, instance.height);
  newFrame.rotation = instance.rotation;
  newFrame.x = instance.x;
  newFrame.y = instance.y;

  instance.children.forEach((child) => {
    newFrame.appendChild(child.clone());
    instance.parent.insertChild(0, newFrame);
  });

  instance.remove();
}
