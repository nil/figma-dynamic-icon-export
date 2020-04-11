/**
 * Check if an array of Frame nodes contains a duplicated name
 * and returns a filtered array or `false`
 *
 * @param list - The list to check
 */
export default function (list: FrameNode[]): FrameNode[] | false {
  const nameList: string[] = list.map((node) => node.name);
  const checkedList = nameList.map(function(item, pos) {
    return nameList.indexOf(item) === pos ? item : 'duplicate';
  })

  if (checkedList.includes('duplicate')) {
    const pos = checkedList.indexOf('duplicate');

    return list.filter(node => node.name === nameList[pos]);
  } else {
    return false;
  }
}
